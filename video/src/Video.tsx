import type { ComponentType } from 'react'
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion'
import { C, INK, Sfx, SfxOn, Wordmark } from './kit'
import { FPS, LINES, TIMELINE, TIMINGS, TOTAL_FRAMES, type PlacedScene, type SceneId } from './timeline'
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
  /** Track in public/ and its integrated loudness, so any track sits at the same level under the voice */
  musicFile?: string
  musicLufs?: number
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

export function NirmaanVideo({ voiceover, captions, music, sfx, musicFile = 'music.mp3', musicLufs = MUSIC_REF_LUFS }: VideoProps) {
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

      {music && <Music file={musicFile} lufs={musicLufs} />}

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

/** Burned-in captions for muted autoplay: short phrases timed to the spoken words */
function Captions() {
  const f = useCurrentFrame()
  for (const s of TIMELINE) {
    for (const l of s.lines) {
      if (!LINES[l.id].cap) continue
      const start = s.from + l.from
      if (f < start - 2 || f >= start + l.duration + 4) continue
      const phrases = TIMINGS[l.id]?.caps ?? chunk(LINES[l.id].text).map((c, i, all) => [c, (i / all.length) * (l.duration / FPS), 0] as const)
      let current = phrases[0][0]
      for (const [text, t] of phrases) if (f >= start + Math.round(t * FPS) - 2) current = text
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

/** Fallback when a line has no recorded timings: phrases of at most ~9 words, preferring punctuation */
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

/**
 * Background bed (public/music.mp3, about -13 LUFS; other tracks are trimmed to match via musicLufs). Sits ~18 dB under the voice while you speak,
 * lifts a little between lines, and ducks smoothly so it never pumps.
 */
const MUSIC_REF_LUFS = -13.3
const MUSIC_DUCKED = 0.11
const MUSIC_OPEN = 0.2
const MUSIC_VOL: number[] = (() => {
  const target = new Array<number>(TOTAL_FRAMES).fill(MUSIC_OPEN)
  for (const s of TIMELINE)
    for (const l of s.lines)
      for (let f = s.from + l.from - 6; f <= s.from + l.from + l.duration + 4; f++) if (f >= 0 && f < TOTAL_FRAMES) target[f] = MUSIC_DUCKED
  // fast duck (~0.2 s), slow recovery (~0.7 s)
  const out: number[] = []
  let v = MUSIC_DUCKED
  for (let f = 0; f < TOTAL_FRAMES; f++) {
    const t = target[f]
    v += (t - v) * (t < v ? 0.18 : 0.05)
    out.push(v)
  }
  // ease in over the first half second, fade out over the last 2.5 s
  return out.map((v, f) => v * Math.min(1, f / 15) * Math.min(1, (TOTAL_FRAMES - f) / 75))
})()

function Music({ file, lufs }: { file: string; lufs: number }) {
  const trim = 10 ** ((MUSIC_REF_LUFS - lufs) / 20)
  return <Audio src={staticFile(file)} loop volume={(f) => trim * MUSIC_VOL[Math.min(MUSIC_VOL.length - 1, f)]} />
}
