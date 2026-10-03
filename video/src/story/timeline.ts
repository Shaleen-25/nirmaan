import lines from './lines.json'
import durations from './durations.json'
import words from './words.json'
import { FPS } from '../timeline'

/** The 9:16 Instagram story: same idea as the main timeline, fitted to its own short voiceover */
export const STORY_WIDTH = 1080
export const STORY_HEIGHT = 1920

export type StoryLineId = keyof typeof lines
export const STORY_LINES = lines as Record<StoryLineId, { say: string; text: string; cap: boolean }>
const DUR = durations as Record<StoryLineId, number>

/** Per line: spoken words and caption phrases with their times (seconds into the clip), from `align-vo.mjs --story` */
type LineTiming = { words: [string, number][]; caps: [string, number, number][] }
export const STORY_TIMINGS = words as unknown as Partial<Record<StoryLineId, LineTiming>>

export type StorySceneId = 'proof' | 'brand' | 'app' | 'end'

interface SceneDef {
  id: StorySceneId
  lines: StoryLineId[]
  /** Minimum on-screen seconds */
  min: number
  lead?: number
  gap?: number
  tail?: number
}

/** Stories get skipped fast, so the voice starts almost at once and scenes cut tight */
const DEFS: SceneDef[] = [
  { id: 'proof', lines: ['q', 'this'], min: 5, lead: 0.15, gap: 0.25, tail: 0.6 },
  { id: 'brand', lines: ['built'], min: 1.9, lead: 0.2, tail: 0.5 },
  { id: 'app', lines: ['pick'], min: 5.4, lead: 0.2, tail: 0.9 },
  // a long hold so there is time to tap the link sticker
  { id: 'end', lines: ['end'], min: 4, lead: 0.2, tail: 1.4 },
]

export interface StoryPlacedLine {
  id: StoryLineId
  /** Start, in frames, relative to the scene */
  from: number
  duration: number
}

export interface StoryPlacedScene {
  id: StorySceneId
  index: number
  from: number
  duration: number
  lines: StoryPlacedLine[]
}

export const STORY_TIMELINE: StoryPlacedScene[] = (() => {
  let t = 0
  return DEFS.map((d, index) => {
    let cur = d.lead ?? 0.3
    const gap = d.gap ?? 0.3
    const placed = d.lines.map((id) => {
      const from = cur
      cur += DUR[id] + gap
      return { id, from: Math.round(from * FPS), duration: Math.ceil(DUR[id] * FPS) }
    })
    const seconds = Math.max(d.min, cur - gap + (d.tail ?? 0.5))
    const scene = { id: d.id, index, from: Math.round(t * FPS), duration: Math.round(seconds * FPS), lines: placed }
    t += seconds
    return scene
  })
})()

const last = STORY_TIMELINE[STORY_TIMELINE.length - 1]
export const STORY_TOTAL_FRAMES = last.from + last.duration

const SYN: Record<string, string> = { nirman: 'nirmaan' }
const norm = (s: string) => {
  const t = s.toLowerCase().replace(/[^a-z0-9]/g, '')
  return SYN[t] ?? t
}

/**
 * Frame (relative to the scene) at which `word` (or a phrase) is spoken. Uses the recorded word
 * timings when available, else estimates from the word's position in the line's text.
 */
export function storyWordAt(scene: StoryPlacedScene, line: StoryLineId, word: string, nth = 0): number {
  const l = scene.lines.find((x) => x.id === line)
  if (!l) return 0
  const spoken = STORY_TIMINGS[line]?.words
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
  const text = STORY_LINES[line].text.toLowerCase()
  let idx = -1
  for (let i = 0; i <= nth; i++) idx = text.indexOf(word.toLowerCase(), idx + 1)
  if (idx < 0) return l.from
  return Math.round(l.from + (idx / text.length) * l.duration)
}

export function storyLineOf(scene: StoryPlacedScene, line: StoryLineId): StoryPlacedLine {
  return scene.lines.find((x) => x.id === line) ?? { id: line, from: 0, duration: 0 }
}
