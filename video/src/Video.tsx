import type { ComponentType } from 'react'
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion'
import { C, INK, Sfx, SfxOn, Wordmark } from './kit'
import { LINES, TIMELINE, TOTAL_FRAMES, type PlacedScene, type SceneId } from './timeline'
import { HookScene, PainScene, ThreeIndiasScene, TitleScene, WhatIfScene } from './scenes/Intro'
import { Split9010Scene } from './scenes/Concept'
import { AllocateScene, BrowseScene, MintScene, StartScene } from './scenes/Demo'
import { MetroScene } from './scenes/Metro'
import { LoopScene, PitchScene } from './scenes/Ideas'
import { EdgeScene, EndScene, PublicScene, WinWinScene } from './scenes/Outro'

export type VideoProps = {
  voiceover: boolean
  captions: boolean
  music: boolean
  sfx: boolean
}

const SCENES: Record<SceneId, ComponentType<{ scene: PlacedScene }>> = {
  hook: HookScene,
  three: ThreeIndiasScene,
  pain: PainScene,
  whatif: WhatIfScene,
  title: TitleScene,
  split9010: Split9010Scene,
  start: StartScene,
  browse: BrowseScene,
  allocate: AllocateScene,
  mint: MintScene,
  metro: MetroScene,
  pitch: PitchScene,
  loop: LoopScene,
  winwin: WinWinScene,
  edge: EdgeScene,
  public: PublicScene,
  end: EndScene,
}

const WIPE_COLORS = [C.marigold, C.pink, C.blue, C.mint, C.lilac]
const WIPE = 14
/** Scenes that start with a hard cut instead of a colour wipe */
const HARD_CUT: SceneId[] = ['title', 'allocate', 'loop', 'end']

export function NirmaanVideo({ voiceover, captions, music, sfx }: VideoProps) {
  return (
    <SfxOn.Provider value={sfx}>
    <AbsoluteFill style={{ background: C.paper }}>
      {TIMELINE.map((s) => {
        const Scene = SCENES[s.id]
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.duration} name={s.id}>
            <Scene scene={s} />
          </Sequence>
        )
      })}

      {voiceover &&
        TIMELINE.flatMap((s) =>
          s.lines.map((l) => (
            <Sequence key={`vo-${l.id}`} from={s.from + l.from} durationInFrames={l.duration + 6} name={`vo:${l.id}`}>
              <Audio src={staticFile(`vo/${l.id}.wav`)} volume={1} />
            </Sequence>
          )),
        )}

      {music && <Music />}

      <Watermark />
      {captions && <Captions />}

      {TIMELINE.slice(1).map((s, i) =>
        HARD_CUT.includes(s.id) ? null : (
          <Sequence key={`wipe-${s.id}`} from={s.from - Math.floor(WIPE / 2)} durationInFrames={WIPE} name={`wipe→${s.id}`}>
            <Wipe color={WIPE_COLORS[i % WIPE_COLORS.length]} />
            <Sfx at={0} name="whoosh" volume={0.18} />
          </Sequence>
        ),
      )}
    </AbsoluteFill>
    </SfxOn.Provider>
  )
}

function Wipe({ color }: { color: string }) {
  const f = useCurrentFrame()
  const x = interpolate(f, [0, WIPE], [-130, 130])
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          top: -200,
          bottom: -200,
          left: `${x}%`,
          width: '110%',
          background: color,
          borderLeft: `10px solid ${INK}`,
          borderRight: `10px solid ${INK}`,
          transform: 'skewX(-14deg)',
        }}
      />
    </AbsoluteFill>
  )
}

/** Small logo in the corner after the title card, hidden on the closing cards */
function Watermark() {
  const f = useCurrentFrame()
  const title = TIMELINE.find((s) => s.id === 'title')!
  const pub = TIMELINE.find((s) => s.id === 'public')!
  const start = title.from + title.duration
  const opacity =
    interpolate(f, [start, start + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) *
    interpolate(f, [pub.from - 8, pub.from], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  if (opacity <= 0) return null
  const current = TIMELINE.find((s) => f >= s.from && f < s.from + s.duration)
  return (
    <div style={{ position: 'absolute', right: 48, top: 40, opacity, zIndex: 40 }}>
      <Wordmark size={34} light={current?.id === 'mint'} />
    </div>
  )
}

/** Burned-in captions for muted autoplay, chunked into short phrases */
function Captions() {
  const f = useCurrentFrame()
  for (const s of TIMELINE) {
    for (const l of s.lines) {
      const meta = LINES[l.id]
      if (!meta.cap) continue
      const start = s.from + l.from
      const end = start + l.duration
      if (f < start || f >= end + 4) continue
      const chunks = chunk(meta.text)
      const total = chunks.reduce((a, c) => a + c.length, 0)
      let acc = 0
      let current = chunks[chunks.length - 1]
      for (const c of chunks) {
        const cEnd = start + ((acc + c.length) / total) * l.duration
        if (f < cEnd) {
          current = c
          break
        }
        acc += c.length
      }
      return (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 44, display: 'flex', justifyContent: 'center', zIndex: 60 }}>
          <span
            className="font-sans"
            style={{
              background: INK,
              color: '#fff',
              fontSize: 40,
              fontWeight: 600,
              lineHeight: 1.25,
              padding: '14px 30px',
              borderRadius: 22,
              maxWidth: 1500,
              textAlign: 'center',
              boxShadow: `6px 6px 0 rgba(22,19,15,.25)`,
            }}
          >
            {current}
          </span>
        </div>
      )
    }
  }
  return null
}

/** Split a line into caption phrases of at most ~9 words, preferring punctuation */
function chunk(text: string): string[] {
  const parts = text.split(/(?<=[.,:?!…])\s+/)
  const out: string[] = []
  for (const p of parts) {
    const words = p.split(' ')
    for (let i = 0; i < words.length; i += 9) out.push(words.slice(i, i + 9).join(' '))
  }
  // merge tiny fragments into the previous phrase
  return out.reduce<string[]>((acc, c) => {
    if (acc.length && c.split(' ').length <= 2 && acc[acc.length - 1].split(' ').length < 8) acc[acc.length - 1] += ' ' + c
    else acc.push(c)
    return acc
  }, [])
}

/** Optional background bed: drop a track at public/music.mp3 and render with music on */
function Music() {
  const f = useCurrentFrame()
  // Duck under the voice
  const speaking = TIMELINE.some((s) => s.lines.some((l) => f >= s.from + l.from - 6 && f <= s.from + l.from + l.duration + 6))
  const fadeOut = interpolate(f, [TOTAL_FRAMES - 60, TOTAL_FRAMES], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  return <Audio src={staticFile('music.mp3')} volume={(speaking ? 0.12 : 0.3) * fadeOut} loop />
}
