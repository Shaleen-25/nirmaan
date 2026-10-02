// Splits a full narration into one clip per script line, using the pauses between lines as boundaries,
// then records durations for the timeline. Accepts either:
//   public/vo-full/narration.(mp3|m4a|wav)   one take of the whole script, ~2s pause between lines
//   public/vo-full/part1.mp3 + part2.mp3      two takes (first 10 lines, then the rest)
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ids = Object.keys(JSON.parse(readFileSync(join(root, 'src/vo-lines.json'), 'utf8')))
const single = ['mp3', 'm4a', 'wav'].map((e) => join(root, `public/vo-full/narration.${e}`)).find(existsSync)
const parts = single ? [ids] : [ids.slice(0, 10), ids.slice(10)]
const SR = 44100
mkdirSync(join(root, 'public/vo'), { recursive: true })

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

/** Speech segments separated by the N-1 longest silences */
function segments(x, want) {
  const win = Math.round(SR * 0.02)
  const loud = []
  for (let i = 0; i < x.length; i += win) {
    let e = 0
    for (let j = i; j < Math.min(x.length, i + win); j++) e += x[j] * x[j]
    loud.push(Math.sqrt(e / win) > 0.012)
  }
  const gaps = []
  let start = -1
  loud.forEach((l, k) => {
    if (!l && start < 0) start = k
    if (l && start >= 0) { gaps.push([start, k]); start = -1 }
  })
  const first = loud.indexOf(true)
  const last = loud.lastIndexOf(true)
  const inner = gaps.filter(([a, b]) => a > first && b <= last)
  const cuts = inner.sort((g, h) => (h[1] - h[0]) - (g[1] - g[0])).slice(0, want - 1).sort((g, h) => g[0] - h[0])
  if (cuts.length < want - 1) throw new Error(`found ${cuts.length + 1} lines, expected ${want}: check the break tags`)
  const bounds = [first, ...cuts.flatMap(([a, b]) => [a, b]), last + 1]
  const segs = []
  for (let i = 0; i < bounds.length; i += 2) {
    const pad = Math.round(0.05 * SR)
    segs.push(x.slice(Math.max(0, bounds[i] * win - pad), Math.min(x.length, bounds[i + 1] * win + pad)))
  }
  return segs
}

const durations = {}
parts.forEach((lineIds, n) => {
  const src = single ?? join(root, `public/vo-full/part${n + 1}.mp3`)
  if (!existsSync(src)) throw new Error(`Missing ${src}`)
  const wav = join(root, `public/vo-full/.decoded-${n}.wav`)
  execFileSync('afconvert', ['-f', 'WAVE', '-d', 'LEI16@44100', '-c', '1', src, wav])
  segments(readPcm(wav), lineIds.length).forEach((seg, i) => {
    writeWav(join(root, `public/vo/${lineIds[i]}.wav`), seg)
    durations[lineIds[i]] = Math.round((seg.length / SR) * 1000) / 1000
    console.log(`  ${lineIds[i].padEnd(8)} ${durations[lineIds[i]].toFixed(2)}s`)
  })
})
writeFileSync(join(root, 'src/vo-durations.json'), JSON.stringify(durations, null, 2) + '\n')
console.log('Done. Re-render to fit the new voice.')
