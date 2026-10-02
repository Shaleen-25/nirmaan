import lines from './vo-lines.json'
import durations from './vo-durations.json'
import words from './vo-words.json'

export const FPS = 30
export const WIDTH = 1920
export const HEIGHT = 1080

export type LineId = keyof typeof lines
export const LINES = lines as Record<LineId, { say: string; text: string; cap: boolean }>
const DUR = durations as Record<LineId, number>

/** Per line: spoken words and caption phrases with their times (seconds into the clip), from scripts/align-vo.mjs */
type LineTiming = { words: [string, number][]; caps: [string, number, number][] }
export const TIMINGS = words as unknown as Partial<Record<LineId, LineTiming>>

export type SceneId =
  | 'hook' | 'three' | 'pain' | 'whatif' | 'title' | 'split9010' | 'start' | 'browse' | 'allocate'
  | 'mint' | 'metro' | 'pitch' | 'loop' | 'winwin' | 'edge' | 'public' | 'end'

interface SceneDef {
  id: SceneId
  lines: LineId[]
  /** Minimum on-screen seconds, so visuals get room even when the voice is quick */
  min: number
  lead?: number
  gap?: number
  tail?: number
}

/** Scene order and which voice lines play in each. Durations are fitted to the voiceover. */
const DEFS: SceneDef[] = [
  { id: 'hook', lines: ['hook'], min: 6.8, lead: 0.35 },
  { id: 'three', lines: ['three'], min: 15 },
  { id: 'pain', lines: ['pain'], min: 8.8 },
  { id: 'whatif', lines: ['whatif', 'wishes'], min: 10.5, gap: 0.3, tail: 1.1 },
  { id: 'title', lines: ['meet'], min: 3.8, lead: 0.3 },
  { id: 'split9010', lines: ['ninety', 'ten'], min: 13.5, gap: 0.55 },
  { id: 'start', lines: ['start'], min: 8.2 },
  { id: 'browse', lines: ['browse'], min: 11.2 },
  { id: 'allocate', lines: ['split'], min: 4 },
  { id: 'mint', lines: ['mint'], min: 8.4 },
  { id: 'metro', lines: ['metro'], min: 13.4 },
  { id: 'pitch', lines: ['pitch'], min: 9.4 },
  { id: 'loop', lines: ['loop'], min: 9.4, tail: 0.8 },
  { id: 'winwin', lines: ['govt', 'you'], min: 11.4, gap: 0.45, tail: 1.0 },
  { id: 'edge', lines: ['edge'], min: 8, tail: 0.8 },
  { id: 'public', lines: ['public'], min: 8.6 },
  { id: 'end', lines: ['end'], min: 4.4, lead: 0.7 },
]

export interface PlacedLine {
  id: LineId
  /** Start, in frames, relative to the scene */
  from: number
  duration: number
}

export interface PlacedScene {
  id: SceneId
  index: number
  /** Absolute start frame */
  from: number
  duration: number
  lines: PlacedLine[]
}

export const TIMELINE: PlacedScene[] = (() => {
  let t = 0
  return DEFS.map((d, index) => {
    const lead = d.lead ?? 0.35
    const gap = d.gap ?? 0.35
    let cur = lead
    const placed = d.lines.map((id) => {
      const from = cur
      cur += DUR[id] + gap
      return { id, from: Math.round(from * FPS), duration: Math.ceil(DUR[id] * FPS) }
    })
    const seconds = Math.max(d.min, cur - gap + (d.tail ?? 0.55))
    const scene = { id: d.id, index, from: Math.round(t * FPS), duration: Math.round(seconds * FPS), lines: placed }
    t += seconds
    return scene
  })
})()

export const TOTAL_FRAMES = TIMELINE[TIMELINE.length - 1].from + TIMELINE[TIMELINE.length - 1].duration

const SYN: Record<string, string> = { nirman: 'nirmaan', defense: 'defence' }
const norm = (s: string) => {
  const t = s.toLowerCase().replace(/[^a-z0-9]/g, '')
  return SYN[t] ?? t
}

/**
 * Frame (relative to the scene) at which `word` (or a phrase) is spoken in a line. Uses the
 * recorded word timings when available, else estimates from the word's position in the text.
 */
export function wordAt(scene: PlacedScene, line: LineId, word: string, nth = 0): number {
  const l = scene.lines.find((x) => x.id === line)
  if (!l) return 0
  const spoken = TIMINGS[line]?.words
  if (spoken) {
    const q = word.split(/\s+/).map(norm).filter(Boolean)
    for (const loose of [false, true]) {
      let seen = 0
      for (let i = 0; i + q.length <= spoken.length; i++) {
        const hit = q.every((w, k) => spoken[i + k][0] === w || (loose && spoken[i + k][0].startsWith(w)))
        if (hit && seen++ === nth) return l.from + Math.round(spoken[i][1] * FPS)
      }
    }
  }
  const say = LINES[line].say.toLowerCase()
  let idx = -1
  for (let i = 0; i <= nth; i++) idx = say.indexOf(word.toLowerCase(), idx + 1)
  if (idx < 0) return l.from
  return Math.round(l.from + (idx / say.length) * l.duration)
}

export function lineOf(scene: PlacedScene, line: LineId): PlacedLine {
  return scene.lines.find((x) => x.id === line) ?? { id: line, from: 0, duration: 0 }
}
