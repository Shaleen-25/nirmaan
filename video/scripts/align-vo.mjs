// Fits a self-recorded narration to the video, word by word.
//   1. Transcribes public/vo-full/narration.(m4a|mp3|wav) with word timestamps (ElevenLabs Scribe,
//      cached next to the recording as narration.transcript.json)
//   2. Aligns the transcript to the script lines in src/vo-lines.json, so ad-libs are fine
//   3. Cuts one clip per line on real word boundaries, drops false starts ("I know it's..."),
//      trims over-long pauses, high-passes and levels the voice
//   4. Writes public/vo/<id>.wav, src/vo-durations.json and src/vo-words.json (word + caption timings),
//      and updates each line's text in src/vo-lines.json to what was actually said
// Run: node scripts/align-vo.mjs            (main video: public/vo-full/narration.m4a)
//      node scripts/align-vo.mjs --story    (Instagram story: public/vo-full/story.m4a)
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const STORY = process.argv.includes('--story')
const SET = STORY
  ? { take: 'story', lines: 'src/story/lines.json', out: 'public/vo-story', durations: 'src/story/durations.json', words: 'src/story/words.json' }
  : { take: 'narration', lines: 'src/vo-lines.json', out: 'public/vo', durations: 'src/vo-durations.json', words: 'src/vo-words.json' }
const SR = 44100
const MAX_PAUSE = 0.85 // pauses inside a line longer than this are trimmed…
const KEEP_PAUSE = 0.65 // …down to this
const TARGET_LUFS = -16 // social-video loudness for the voice
const CEILING = 0.84 // limiter ceiling, about -1.5 dBFS
const SILENCE = 0.006

// Display fixes: spelling, numbers, and a few words the transcriber mishears
const FIXES = [
  [/\bNirman\b/g, 'Nirmaan'],
  [/\beRupee\b/g, 'e-Rupee'],
  [/\bDefense\b/g, 'Defence'],
  [/\bneighborhood\b/g, 'neighbourhood'],
  [/\bmoney metro\b/gi, 'Money Metro'],
  [/\bIndia one\b/g, 'India 1'],
  [/\bIndia two\b/g, 'India 2'],
  [/\bIndia three\b/g, 'India 3'],
  [/\bthirty percent\b/gi, '30%'],
  [/\bninety percent\b/gi, '90%'],
  [/\bten percent\b/gi, '10%'],
  [/\beight lakh\b/gi, '₹8 lakh'],
  [/\bEighty thousand\b/g, '₹80,000'],
  [/\btransparent governments\b/g, 'transparent governance'],
  [/\bverified vouchers\b/g, 'verified vouches'],
  [/\ban EV charging\b/g, 'an EV charger,'],
  [/\bsomehow ends with\b/g, 'somehow end with'],
  [/\bin your city you live in\b/g, 'in the city you live in'],
  [/\byou are actually helping it build it\b/g, "you're actually helping build it"],
  [/\bhave hundred\b/g, 'have a hundred'],
]

const src = ['m4a', 'mp3', 'wav'].map((e) => join(root, `public/vo-full/${SET.take}.${e}`)).find(existsSync)
if (!src) throw new Error(`Put the recording at public/vo-full/${SET.take}.m4a (or .mp3/.wav)`)
const linesPath = join(root, SET.lines)
const LINES = JSON.parse(readFileSync(linesPath, 'utf8'))
const ids = Object.keys(LINES)

/* ── 1. transcript ─────────────────────────────────────────── */
const transcriptPath = join(root, `public/vo-full/${SET.take}.transcript.json`)
if (!existsSync(transcriptPath)) {
  const env = existsSync(join(root, '.env')) ? readFileSync(join(root, '.env'), 'utf8') : ''
  const key = process.env.ELEVENLABS_API_KEY ?? env.match(/ELEVENLABS_API_KEY=(.+)/)?.[1]?.trim()
  if (!key) throw new Error('Need ELEVENLABS_API_KEY (in .env) to transcribe the recording')
  const form = new FormData()
  form.append('model_id', 'scribe_v1')
  form.append('language_code', 'en')
  form.append('timestamps_granularity', 'word')
  form.append('tag_audio_events', 'false')
  form.append('file', new Blob([readFileSync(src)]), src.split('/').pop())
  const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', { method: 'POST', headers: { 'xi-api-key': key }, body: form })
  if (!res.ok) throw new Error(`Transcription failed: ${res.status} ${await res.text()}`)
  writeFileSync(transcriptPath, JSON.stringify(await res.json(), null, 2))
  console.log('Transcribed the recording')
}
const words = JSON.parse(readFileSync(transcriptPath, 'utf8')).words.filter((w) => w.type === 'word')

/* ── 2. align transcript words to script lines ─────────────── */
const SYN = { nirman: 'nirmaan', defense: 'defence', neighborhood: 'neighbourhood', erupee: 'erupee' }
const norm = (s) => {
  const t = s.toLowerCase().replace(/[^a-z0-9]/g, '')
  return SYN[t] ?? t
}
const script = ids.flatMap((id, li) => LINES[id].text.split(/\s+/).map((w) => ({ t: norm(w), li })).filter((w) => w.t))
const spoken = words.map((w) => norm(w.text))

// Needleman–Wunsch: match +2, substitution -1, gap -1
const n = script.length
const m = spoken.length
const score = Array.from({ length: n + 1 }, () => new Int32Array(m + 1))
for (let i = 1; i <= n; i++) score[i][0] = -i
for (let j = 1; j <= m; j++) score[0][j] = -j
for (let i = 1; i <= n; i++)
  for (let j = 1; j <= m; j++)
    score[i][j] = Math.max(score[i - 1][j - 1] + (script[i - 1].t === spoken[j - 1] ? 2 : -1), score[i - 1][j] - 1, score[i][j - 1] - 1)
const lineOfWord = new Array(m).fill(-1)
for (let i = n, j = m; i > 0 && j > 0; ) {
  if (score[i][j] === score[i - 1][j - 1] + (script[i - 1].t === spoken[j - 1] ? 2 : -1)) lineOfWord[--j] = script[--i].li
  else if (score[i][j] === score[i - 1][j] - 1) i--
  else j--
}
const firstOf = ids.map((_, li) => lineOfWord.indexOf(li))
const lastOf = ids.map((_, li) => lineOfWord.lastIndexOf(li))
ids.forEach((id, li) => {
  if (firstOf[li] < 0) throw new Error(`Couldn't find line "${id}" in the recording`)
})
// Line boundaries sit in the longest pause between one line's last matched word and the next line's first
const starts = [0]
for (let li = 1; li < ids.length; li++) {
  let best = firstOf[li]
  let bestGap = -1
  for (let j = lastOf[li - 1] + 1; j <= firstOf[li]; j++) {
    const gap = words[j].start - words[j - 1].end
    if (gap > bestGap) [best, bestGap] = [j, gap]
  }
  starts.push(best)
}
const ranges = ids.map((_, li) => [starts[li], li + 1 < ids.length ? starts[li + 1] : words.length])

/* ── 3. audio ──────────────────────────────────────────────── */
const wavPath = join(root, 'public/vo-full/.decoded.wav')
execFileSync('afconvert', ['-f', 'WAVE', '-d', 'LEI16@44100', '-c', '1', src, wavPath])
const raw = readPcm(wavPath)
const x = highpass(raw, 80)
const rmsAt = (t) => {
  const c = Math.round(t * SR)
  let e = 0
  for (let i = c - 441; i < c + 441; i++) e += (x[i] ?? 0) ** 2
  return Math.sqrt(e / 882)
}
mkdirSync(join(root, SET.out), { recursive: true })
const durations = {}
const timings = {}
const report = []
const clips = {}

ids.forEach((id, li) => {
  const [a, b] = ranges[li]
  let kept = words.slice(a, b)
  // False start: a phrase trailing off in "..." followed by a pause is a restart, so drop it
  for (let k = kept.length - 2; k >= 0; k--) {
    if (/(\.\.\.|…)$/.test(kept[k].text) && kept[k + 1].start - kept[k].end > 0.3) {
      let p = k
      while (p > 0 && kept[p].start - kept[p - 1].end < 0.3) p--
      report.push(`${id}: dropped false start "${kept.slice(p, k + 1).map((w) => w.text).join(' ')}"`)
      kept = [...kept.slice(0, p), ...kept.slice(k + 1)]
    }
  }
  const first = kept[0]
  const last = kept[kept.length - 1]
  const prevEnd = words[words.indexOf(first) - 1]?.end ?? 0
  const nextStart = words[words.indexOf(last) + 1]?.start ?? x.length / SR
  // Pad edges, then let energy decide where the breath/decay really starts and ends
  let t0 = Math.max(first.start - 0.25, (prevEnd + first.start) / 2)
  while (t0 < first.start && rmsAt(t0) < SILENCE) t0 += 0.01
  t0 = Math.max(prevEnd, t0 - 0.04)
  let t1 = Math.min(last.end + 0.45, (last.end + nextStart) / 2)
  while (t1 > last.end && rmsAt(t1) < SILENCE) t1 -= 0.01
  t1 = Math.min(nextStart, t1 + 0.1)

  // Pieces of source audio to keep: drop removed words, shorten long silent pauses
  const pieces = []
  let cur = t0
  kept.forEach((w, k) => {
    if (k === 0) return
    const prev = kept[k - 1]
    const jumped = words.indexOf(w) !== words.indexOf(prev) + 1
    if (jumped) {
      pieces.push([cur, prev.end + 0.06])
      cur = w.start - 0.06
      return
    }
    // silent stretch inside the gap
    let s0 = prev.end
    while (s0 < w.start && rmsAt(s0) >= SILENCE) s0 += 0.01
    let s1 = w.start
    while (s1 > s0 && rmsAt(s1) >= SILENCE) s1 -= 0.01
    if (s1 - s0 > MAX_PAUSE) {
      const cut = s1 - s0 - KEEP_PAUSE
      const mid = (s0 + s1) / 2
      pieces.push([cur, mid - cut / 2])
      cur = mid + cut / 2
    }
  })
  pieces.push([cur, t1])

  // map source time -> clip time
  const toClip = (t) => {
    let acc = 0
    for (const [p0, p1] of pieces) {
      if (t < p1) return acc + Math.max(0, t - p0)
      acc += p1 - p0
    }
    return acc
  }
  const parts = pieces.map(([p0, p1]) => x.slice(Math.round(p0 * SR), Math.round(p1 * SR)))
  const clip = joinWithFades(parts, Math.round(0.012 * SR))
  clips[id] = clip
  durations[id] = Math.round((clip.length / SR) * 1000) / 1000

  const ws = kept.map((w) => ({ w: norm(w.text), text: w.text, t: round(toClip(w.start)), e: round(toClip(w.end)) }))
  const caps = captionsFor(ws)
  timings[id] = { words: ws.map((w) => [w.w, w.t]), caps }
  LINES[id].text = caps.map((c) => c[0]).join(' ')
  const trimmed = (t1 - t0) - clip.length / SR
  console.log(`  ${id.padEnd(7)} ${durations[id].toFixed(2)}s${trimmed > 0.05 ? `  (trimmed ${trimmed.toFixed(2)}s of pauses)` : ''}`)
})

// Level the whole voice to TARGET_LUFS: gain, a gentle compressor, then a look-ahead limiter so peaks never clip
let gain = 1
let leveled = {}
for (let round = 0; round < 6; round++) {
  leveled = Object.fromEntries(Object.entries(clips).map(([id, c]) => [id, limiter(compress(c.map((v) => v * gain)))]))
  const lufs = measureLufs(Object.values(leveled))
  if (round === 5 || Math.abs(lufs - TARGET_LUFS) < 0.3) {
    console.log(`Voice leveled to ${lufs.toFixed(1)} LUFS (+${(20 * Math.log10(gain)).toFixed(1)} dB)`)
    break
  }
  gain *= 10 ** ((TARGET_LUFS - lufs) / 20)
}
for (const [id, c] of Object.entries(leveled)) writeWav(join(root, `${SET.out}/${id}.wav`), c)

writeFileSync(join(root, SET.durations), JSON.stringify(durations, null, 2) + '\n')
writeFileSync(join(root, SET.words), JSON.stringify(timings) + '\n')
writeFileSync(linesPath, JSON.stringify(LINES, null, 2) + '\n')
report.forEach((r) => console.log(r))
console.log(`Total voice ${Object.values(durations).reduce((p, q) => p + q, 0).toFixed(1)}s. Re-render to fit.`)

/* ── captions ──────────────────────────────────────────────── */

/** Caption phrases of 2–9 words, broken where speech naturally breaks, each timed from its first word */
function captionsFor(ws) {
  const line = ws.map((w) => w.text).join(' ')
  const offsets = []
  ws.reduce((o, w) => (offsets.push(o), o + w.text.length + 1), 0)
  // never split a phrase that a display fix rewrites
  const locked = new Set()
  for (const [re] of FIXES) {
    for (const m of line.matchAll(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'))) {
      const a = offsets.findLastIndex((o) => o <= m.index)
      const b = offsets.findLastIndex((o) => o < m.index + m[0].length)
      for (let k = a; k < b; k++) locked.add(k)
    }
  }
  const SOFT = /^(and|or|but|that|to|in|of|with|for|because|until|on|so|the|a|an|why|what|is)$/i
  const breakCost = (i) => {
    if (i === ws.length - 1) return 0
    if (locked.has(i)) return 100
    const w = ws[i].text
    const pause = ws[i + 1].t - ws[i].e
    let c = /[.?!…]["”]?$/.test(w) ? 0 : /[,;:]$/.test(w) ? 1 : SOFT.test(ws[i + 1].text) ? 3.5 : 6
    if (pause > 0.35) c = Math.min(c, 1.2)
    return c
  }
  const chunkCost = (a, b) => {
    const n = b - a + 1
    if (n > 9) return 1000
    return (n - 6) ** 2 * 0.35 + (n === 1 ? 3 : 0) + Math.max(0, ws[b].e - ws[a].t - 3.4) * 4
  }
  // best[i] = cheapest way to caption words 0..i-1
  const best = [0]
  const from = [0]
  for (let i = 1; i <= ws.length; i++) {
    best[i] = Infinity
    for (let a = Math.max(0, i - 9); a < i; a++) {
      const c = best[a] + chunkCost(a, i - 1) + breakCost(i - 1)
      if (c < best[i]) [best[i], from[i]] = [c, a]
    }
  }
  const out = []
  for (let i = ws.length; i > 0; i = from[i]) out.unshift([from[i], i - 1])
  return out.map(([a, b]) => {
    let text = ws.slice(a, b + 1).map((w) => w.text).join(' ')
    for (const [re, to] of FIXES) text = text.replace(re, to)
    return [text.replace(/,,/g, ','), ws[a].t, ws[b].e]
  })
}

/* ── audio helpers ─────────────────────────────────────────── */

function round(t) {
  return Math.round(t * 1000) / 1000
}

function highpass(input, hz) {
  // 2nd-order Butterworth
  const w = (2 * Math.PI * hz) / SR
  const q = Math.SQRT1_2
  const al = Math.sin(w) / (2 * q)
  const cw = Math.cos(w)
  const a0 = 1 + al
  const b0 = (1 + cw) / 2 / a0
  const b1 = -(1 + cw) / a0
  const b2 = b0
  const a1 = (-2 * cw) / a0
  const a2 = (1 - al) / a0
  const out = new Float32Array(input.length)
  let x1 = 0
  let x2 = 0
  let y1 = 0
  let y2 = 0
  for (let i = 0; i < input.length; i++) {
    const y = b0 * input[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2
    ;[x2, x1, y2, y1] = [x1, input[i], y1, y]
    out[i] = y
  }
  return out
}

/** Gentle 2.5:1 compression above -10 dBFS so loud syllables don't lean on the limiter */
function compress(input) {
  const thr = -10
  const ratio = 2.5
  const att = Math.exp(-1 / (0.005 * SR))
  const rel = Math.exp(-1 / (0.12 * SR))
  const out = new Float32Array(input.length)
  let env = 0
  for (let i = 0; i < input.length; i++) {
    const a = Math.abs(input[i])
    env = a > env ? a + (env - a) * att : a + (env - a) * rel
    const db = 20 * Math.log10(Math.max(1e-9, env))
    const over = db - thr
    // 6 dB soft knee
    const red = over <= -3 ? 0 : over >= 3 ? over * (1 - 1 / ratio) : ((over + 3) ** 2 / 12) * (1 - 1 / ratio)
    out[i] = input[i] * 10 ** (-red / 20)
  }
  return out
}

/** Look-ahead peak limiter: gain dips just before a peak and recovers over ~80 ms */
function limiter(input) {
  const ahead = Math.round(0.003 * SR)
  const release = Math.exp(-1 / (0.08 * SR))
  const need = new Float32Array(input.length)
  for (let i = 0; i < input.length; i++) need[i] = Math.min(1, CEILING / Math.max(1e-9, Math.abs(input[i])))
  // minimum over the look-ahead window (simple sliding scan; clips are short)
  const target = new Float32Array(input.length)
  for (let i = 0; i < input.length; i++) {
    let m = 1
    for (let j = i; j <= Math.min(input.length - 1, i + ahead); j++) if (need[j] < m) m = need[j]
    target[i] = m
  }
  const out = new Float32Array(input.length)
  let g = 1
  for (let i = 0; i < input.length; i++) {
    g = target[i] < g ? target[i] : target[i] + (g - target[i]) * release
    out[i] = Math.max(-CEILING, Math.min(CEILING, input[i] * g))
  }
  return out
}

/** Integrated loudness (LUFS) of the clips laid end to end, via ffmpeg's EBU R128 meter */
function measureLufs(parts) {
  const gap = new Float32Array(Math.round(0.3 * SR))
  const all = joinWithFades(parts.flatMap((p) => [p, gap]), 1)
  const tmp = join(root, 'public/vo-full/.measure.wav')
  writeWav(tmp, all)
  const r = spawnSync('npx', ['remotion', 'ffmpeg', '-hide_banner', '-nostats', '-i', tmp, '-af', 'loudnorm=print_format=json', '-f', 'null', '-'], { cwd: root, encoding: 'utf8' })
  const m = (r.stderr + r.stdout).match(/"input_i"\s*:\s*"(-?[\d.]+)"/)
  if (!m) throw new Error('Could not measure loudness: ' + r.stderr.slice(-400))
  return +m[1]
}

function joinWithFades(parts, fade) {
  const total = parts.reduce((s, p) => s + p.length, 0)
  const out = new Float32Array(total)
  let o = 0
  parts.forEach((p) => {
    for (let i = 0; i < p.length; i++) {
      const fi = Math.min(1, i / fade, (p.length - 1 - i) / fade)
      out[o + i] = p[i] * fi
    }
    o += p.length
  })
  return out
}

function readPcm(file) {
  const b = readFileSync(file)
  let off = 12
  while (off < b.length) {
    const id = b.toString('ascii', off, off + 4)
    const size = b.readUInt32LE(off + 4)
    if (id === 'data') {
      const out = new Float32Array(size / 2)
      for (let i = 0; i < out.length; i++) out[i] = b.readInt16LE(off + 8 + i * 2) / 32768
      return out
    }
    off += 8 + size + (size % 2)
  }
  throw new Error('no data chunk')
}

function writeWav(file, samples) {
  const pcm = Buffer.alloc(samples.length * 2)
  samples.forEach((s, i) => pcm.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(s * 32767))), i * 2))
  const h = Buffer.alloc(44)
  h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8); h.write('fmt ', 12)
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(SR, 24)
  h.writeUInt32LE(SR * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40)
  writeFileSync(file, Buffer.concat([h, pcm]))
}
