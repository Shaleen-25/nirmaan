// Writes the timed script (SCRIPT.md) and LinkedIn-ready captions (out/nirmaan-demo.srt)
// from the same timeline the video uses.   Run: npx tsx scripts/export-script.ts
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FPS, LINES, TIMELINE, TOTAL_FRAMES } from '../src/timeline'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ts = (frames: number, srt = false) => {
  const ms = Math.round((frames / FPS) * 1000)
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  const s = Math.floor((ms % 60_000) / 1000)
  const r = ms % 1000
  const pad = (n: number, w = 2) => String(n).padStart(w, '0')
  return srt ? `${pad(h)}:${pad(m)}:${pad(s)},${pad(r, 3)}` : `${pad(m)}:${pad(s)}.${pad(Math.floor(r / 100), 1)}`
}

const TITLES: Record<string, string> = {
  hook: 'Hook: the family WhatsApp group',
  pain: '30% tax, zero say',
  whatif: 'What if you could choose?',
  title: 'Meet Nirmaan',
  split9010: 'The 90% and the debatable 10%',
  start: 'Slide in your tax, tear off 10%',
  browse: 'Back projects',
  allocate: 'Split it, no quotas',
  mint: 'Minted as purpose-bound e-Rupee',
  metro: 'The Money Metro',
  pitch: 'Pitch an idea, rally vouches',
  loop: 'Govt shortlist and the feedback loop',
  winwin: 'Everybody wins',
  edge: 'It is a far-fetched idea',
  public: 'Building in public',
  end: 'End card',
}

let md = `# Nirmaan demo video: voiceover script\n\nTotal length **${ts(TOTAL_FRAMES)}** at ${FPS} fps. Times are when each line starts; read at a natural, upbeat pace and the scenes will match. To use your own recording, save one file per line as \`public/vo/<id>.wav\` and run \`node scripts/vo.mjs --measure\` (or just re-render with your full take laid over the silent version).\n\n| # | Time | Scene | Line id | Voiceover |\n|---|---|---|---|---|\n`
let srt = ''
let n = 1
TIMELINE.forEach((s, i) => {
  s.lines.forEach((l) => {
    const start = s.from + l.from
    md += `| ${i + 1} | ${ts(start)} | ${TITLES[s.id]} | \`${l.id}\` | ${LINES[l.id].text} |\n`
    srt += `${n++}\n${ts(start, true)} --> ${ts(start + l.duration, true)}\n${LINES[l.id].text}\n\n`
  })
})

writeFileSync(join(root, 'SCRIPT.md'), md)
mkdirSync(join(root, 'out'), { recursive: true })
writeFileSync(join(root, 'out/nirmaan-demo.srt'), srt)
console.log(`Wrote SCRIPT.md and out/nirmaan-demo.srt (${n - 1} lines, ${ts(TOTAL_FRAMES)})`)
