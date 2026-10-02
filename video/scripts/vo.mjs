// Generates one voiceover clip per script line into public/vo/<id>.wav and records durations
// in src/vo-durations.json (the video timeline is built from these, so scenes re-fit any voice).
//
//   node scripts/vo.mjs                      → macOS `say` scratch voice (Rishi, Indian English)
//   ELEVENLABS_API_KEY=… ELEVENLABS_VOICE_ID=… node scripts/vo.mjs   → ElevenLabs studio voice
//   node scripts/vo.mjs --measure            → keep your own recordings in public/vo (wav/mp3/m4a), just re-time
//
// Keys can also live in video/.env (git-ignored).
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public/vo')
mkdirSync(outDir, { recursive: true })

// Minimal .env loader
const envFile = join(root, '.env')
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
  }
}

const lines = JSON.parse(readFileSync(join(root, 'src/vo-lines.json'), 'utf8'))
const MEASURE = process.argv.includes('--measure')
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const KEY = process.env.ELEVENLABS_API_KEY
const VOICE = process.env.ELEVENLABS_VOICE_ID
const SAY_VOICE = process.env.SAY_VOICE ?? 'Rishi'
const SAY_RATE = process.env.SAY_RATE ?? '172'

/** Duration in seconds of a PCM WAV file */
function wavDuration(file) {
  const b = readFileSync(file)
  let off = 12
  let byteRate = 0
  while (off < b.length) {
    const id = b.toString('ascii', off, off + 4)
    const size = b.readUInt32LE(off + 4)
    if (id === 'fmt ') byteRate = b.readUInt32LE(off + 16)
    if (id === 'data') return size / byteRate
    off += 8 + size + (size % 2)
  }
  throw new Error('No data chunk in ' + file)
}

async function eleven(text, file, prev, next) {
  const model = process.env.ELEVENLABS_MODEL ?? 'eleven_multilingual_v2'
  const prefix = process.env.ELEVENLABS_PREFIX ?? ''
  const body =
    model === 'eleven_v3'
      ? { text: prefix + text, model_id: model }
      : {
          text,
          model_id: model,
          // Neighbouring lines keep intonation consistent across clips
          previous_text: prev,
          next_text: next,
          voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true },
        }
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`)
  const mp3 = file.replace(/\.wav$/, '.mp3')
  writeFileSync(mp3, Buffer.from(await res.arrayBuffer()))
  execFileSync('afconvert', ['-f', 'WAVE', '-d', 'LEI16@44100', '-c', '1', mp3, file])
  unlinkSync(mp3)
}

function sayClip(text, file) {
  const aiff = file.replace(/\.wav$/, '.aiff')
  execFileSync('say', ['-v', SAY_VOICE, '-r', SAY_RATE, '-o', aiff, text])
  execFileSync('afconvert', ['-f', 'WAVE', '-d', 'LEI16@44100', '-c', '1', aiff, file])
  unlinkSync(aiff)
}

const durFile = join(root, 'src/vo-durations.json')
const durations = existsSync(durFile) ? JSON.parse(readFileSync(durFile, 'utf8')) : {}
const engine = MEASURE ? 'your recordings' : KEY && VOICE ? `ElevenLabs (${VOICE})` : `macOS say (${SAY_VOICE})`
console.log(`Voice: ${engine}`)

const entries = Object.entries(lines)
for (const [i, [id, { say }]] of entries.entries()) {
  if (only.length && !only.includes(id)) continue
  const file = join(outDir, `${id}.wav`)
  if (MEASURE) {
    // Accept a self-recorded take in any common format and normalise it to WAV
    for (const ext of ['mp3', 'm4a']) {
      const src = join(outDir, `${id}.${ext}`)
      if (existsSync(src)) execFileSync('afconvert', ['-f', 'WAVE', '-d', 'LEI16@44100', '-c', '1', src, file])
    }
    if (!existsSync(file)) throw new Error(`Missing recording for "${id}" in public/vo`)
  } else if (KEY && VOICE) await eleven(say, file, entries[i - 1]?.[1].say, entries[i + 1]?.[1].say)
  else sayClip(say, file)
  durations[id] = Math.round(wavDuration(file) * 1000) / 1000
  console.log(`  ${id.padEnd(8)} ${durations[id].toFixed(2)}s`)
}

writeFileSync(durFile, JSON.stringify(durations, null, 2) + '\n')
const total = Object.values(durations).reduce((a, b) => a + b, 0)
console.log(`Total speech: ${total.toFixed(1)}s`)
