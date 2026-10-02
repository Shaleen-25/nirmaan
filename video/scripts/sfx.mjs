// Synthesises the small sound effects used in the video (no samples, no licensing).
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SR = 44100
const out = join(dirname(fileURLToPath(import.meta.url)), '../public/sfx')
mkdirSync(out, { recursive: true })

let seed = 7
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1

function write(name, samples, peak = 0.7) {
  const max = Math.max(...samples.map(Math.abs)) || 1
  const pcm = Buffer.alloc(samples.length * 2)
  samples.forEach((s, i) => pcm.writeInt16LE(Math.round((s / max) * peak * 32767), i * 2))
  const h = Buffer.alloc(44)
  h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8); h.write('fmt ', 12)
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(SR, 24)
  h.writeUInt32LE(SR * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40)
  writeFileSync(join(out, `${name}.wav`), Buffer.concat([h, pcm]))
  console.log(`  ${name}.wav  ${(samples.length / SR).toFixed(2)}s`)
}

const n = (sec) => Math.round(sec * SR)
const env = (t, attack, decay) => (t < attack ? t / attack : Math.exp(-(t - attack) / decay))

// pop: quick upward blip, like a sticker landing
{
  const s = []
  let ph = 0
  for (let i = 0; i < n(0.14); i++) {
    const t = i / SR
    const f = 420 + 900 * Math.min(1, t / 0.05)
    ph += (2 * Math.PI * f) / SR
    s.push(Math.sin(ph) * env(t, 0.003, 0.035))
  }
  write('pop', s, 0.6)
}

// ding: bright two-partial notification
{
  const s = []
  for (let i = 0; i < n(0.6); i++) {
    const t = i / SR
    s.push((Math.sin(2 * Math.PI * 1568 * t) + 0.6 * Math.sin(2 * Math.PI * 2349 * t)) * env(t, 0.004, 0.16))
  }
  write('ding', s, 0.5)
}

// coin: classic two-note pickup
{
  const s = []
  for (let i = 0; i < n(0.5); i++) {
    const t = i / SR
    const f = t < 0.07 ? 1318.5 : 1975.5
    const sq = Math.sign(Math.sin(2 * Math.PI * f * t)) * 0.35 + Math.sin(2 * Math.PI * f * t) * 0.65
    s.push(sq * env(t < 0.07 ? t : t - 0.07, 0.002, t < 0.07 ? 0.05 : 0.13))
  }
  write('coin', s, 0.45)
}

// whoosh: swept filtered noise
{
  const s = []
  let lp = 0
  const len = n(0.42)
  for (let i = 0; i < len; i++) {
    const t = i / len
    const cutoff = 0.02 + 0.25 * Math.sin(Math.PI * t)
    lp += cutoff * (rand() - lp)
    s.push(lp * Math.sin(Math.PI * t) ** 1.5)
  }
  write('whoosh', s, 0.55)
}

// stamp: low thump + paper slap
{
  const s = []
  let ph = 0
  for (let i = 0; i < n(0.35); i++) {
    const t = i / SR
    const f = 110 - 60 * Math.min(1, t / 0.12)
    ph += (2 * Math.PI * f) / SR
    const thump = Math.sin(ph) * env(t, 0.002, 0.09)
    const slap = rand() * env(t, 0.001, 0.012) * 0.8
    s.push(thump + slap)
  }
  write('stamp', s, 0.85)
}

// tick: tiny key click
{
  const s = []
  let prev = 0
  for (let i = 0; i < n(0.03); i++) {
    const t = i / SR
    const x = rand()
    s.push((x - prev) * env(t, 0.0005, 0.004))
    prev = x
  }
  write('tick', s, 0.35)
}

// rip: tearing paper crackle
{
  const s = []
  let prev = 0
  const len = n(0.38)
  for (let i = 0; i < len; i++) {
    const t = i / len
    const x = rand()
    const crackle = Math.random() < 0.08 ? 1 : 0.25
    s.push((x - prev) * crackle * Math.sin(Math.PI * t) * (1 - t * 0.4))
    prev = x
  }
  write('rip', s, 0.5)
}

// click: button press
{
  const s = []
  for (let i = 0; i < n(0.08); i++) {
    const t = i / SR
    s.push((Math.sin(2 * Math.PI * 2200 * t) * 0.5 + rand() * 0.5) * env(t, 0.001, 0.008))
  }
  write('click', s, 0.45)
}
