import type { ComponentType, CSSProperties } from 'react'
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion'
import { ArrowDown, Check } from 'lucide-react'
import { DELIVERED, PROJECTS } from '../../../src/data/projects'
import { Bg, C, INK, LogoMark, ProjectGlyph, Sfx, SfxOn, Sticker, pop, ramp, rise, rupees, sp } from '../kit'
import { FPS } from '../timeline'
import {
  STORY_LINES, STORY_TIMELINE, STORY_TIMINGS, STORY_TOTAL_FRAMES, storyLineOf, storyWordAt,
  type StoryPlacedScene, type StorySceneId,
} from './timeline'

export type StoryProps = {
  voiceover: boolean
  captions: boolean
  music: boolean
  sfx: boolean
  musicFile?: string
  musicLufs?: number
  /** Seconds into the track to start from: Indie Pop's last chorus lifts at 2:21 */
  musicFrom?: number
}

/** Instagram draws its header over the top ~250px and the reply bar over the bottom ~280px */
const CAPTION_TOP = 1470

const SCENES: Record<StorySceneId, ComponentType<{ scene: StoryPlacedScene }>> = {
  proof: ProofScene,
  brand: BrandScene,
  app: AppScene,
  end: EndScene,
}

const WIPE = 12
const WIPE_COLORS = [C.marigold, C.pink, C.blue]

export function NirmaanStory({ voiceover, captions, music, sfx, musicFile = 'music.mp3', musicLufs = MUSIC_REF_LUFS, musicFrom = 140.93 }: StoryProps) {
  return (
    <SfxOn.Provider value={sfx}>
      <AbsoluteFill style={{ background: C.paper }}>
        {STORY_TIMELINE.map((s) => {
          const Scene = SCENES[s.id]
          return (
            <Sequence key={s.id} from={s.from} durationInFrames={s.duration} name={s.id}>
              <Scene scene={s} />
            </Sequence>
          )
        })}

        {voiceover &&
          STORY_TIMELINE.flatMap((s) =>
            s.lines.map((l) => (
              <Sequence key={`vo-${l.id}`} from={s.from + l.from} durationInFrames={l.duration + 6} name={`vo:${l.id}`}>
                <Audio src={staticFile(`vo-story/${l.id}.wav`)} />
              </Sequence>
            )),
          )}

        {music && <StoryMusic file={musicFile} lufs={musicLufs} from={musicFrom} />}
        {captions && <StoryCaptions />}

        {STORY_TIMELINE.slice(1).map((s, i) => (
          <Sequence key={`wipe-${s.id}`} from={s.from - WIPE / 2} durationInFrames={WIPE} name={`wipe→${s.id}`}>
            <Wipe color={WIPE_COLORS[i % WIPE_COLORS.length]} />
            <Sfx at={0} name="whoosh" volume={0.18} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </SfxOn.Provider>
  )
}

function Wipe({ color }: { color: string }) {
  const f = useCurrentFrame()
  const x = interpolate(f, [0, WIPE], [-150, 150])
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          top: -300,
          bottom: -300,
          left: `${x}%`,
          width: '130%',
          background: color,
          borderLeft: `10px solid ${INK}`,
          borderRight: `10px solid ${INK}`,
          transform: 'skewX(-12deg)',
        }}
      />
    </AbsoluteFill>
  )
}

/* ───────── sound ───────── */

/** Same bed as the main video, a touch more present for phone speakers: ~13 dB under the voice, lifting in the gaps */
const MUSIC_REF_LUFS = -13.3
const MUSIC_DUCKED = 0.16
const MUSIC_OPEN = 0.28
const MUSIC_VOL: number[] = (() => {
  const target = new Array<number>(STORY_TOTAL_FRAMES).fill(MUSIC_OPEN)
  for (const s of STORY_TIMELINE)
    for (const l of s.lines)
      for (let f = s.from + l.from - 6; f <= s.from + l.from + l.duration + 4; f++) if (f >= 0 && f < STORY_TOTAL_FRAMES) target[f] = MUSIC_DUCKED
  const out: number[] = []
  let v = MUSIC_DUCKED
  for (let f = 0; f < STORY_TOTAL_FRAMES; f++) {
    const t = target[f]
    v += (t - v) * (t < v ? 0.18 : 0.05)
    out.push(v)
  }
  // starts right on the chorus, so only a tiny fade in; 1 s fade out
  return out.map((v, f) => v * Math.min(1, (f + 1) / 4) * Math.min(1, (STORY_TOTAL_FRAMES - f) / 30))
})()

function StoryMusic({ file, lufs, from }: { file: string; lufs: number; from: number }) {
  const trim = 10 ** ((MUSIC_REF_LUFS - lufs) / 20)
  return <Audio src={staticFile(file)} trimBefore={Math.round(from * FPS)} volume={(f) => trim * MUSIC_VOL[Math.min(MUSIC_VOL.length - 1, f)]} />
}

/* ───────── captions ───────── */

function StoryCaptions() {
  const f = useCurrentFrame()
  for (const s of STORY_TIMELINE) {
    for (const l of s.lines) {
      if (!STORY_LINES[l.id].cap) continue
      const start = s.from + l.from
      if (f < start - 2 || f >= start + l.duration + 4) continue
      const phrases = STORY_TIMINGS[l.id]?.caps ?? estimatePhrases(STORY_LINES[l.id].text, l.duration / FPS)
      let current = phrases[0][0]
      for (const [text, t] of phrases) if (f >= start + Math.round(t * FPS) - 2) current = text
      return (
        <div style={{ position: 'absolute', left: 60, right: 60, top: CAPTION_TOP, display: 'flex', justifyContent: 'center', zIndex: 60 }}>
          <span
            className="font-sans"
            style={{
              background: INK,
              color: '#fff',
              fontSize: 50,
              fontWeight: 700,
              lineHeight: 1.2,
              padding: '16px 32px',
              borderRadius: 26,
              textAlign: 'center',
              boxShadow: '6px 6px 0 rgba(22,19,15,.25)',
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

/** Until the real take is aligned: short phrases timed by their share of the line */
function estimatePhrases(text: string, seconds: number): [string, number, number][] {
  const words = text.split(' ')
  const groups: string[][] = []
  let g: string[] = []
  words.forEach((w, i) => {
    g.push(w)
    if ((/[,.?!…]$/.test(w) && g.length >= 3) || g.length >= 6 || i === words.length - 1) {
      if (g.length <= 2 && groups.length) groups[groups.length - 1].push(...g)
      else groups.push(g)
      g = []
    }
  })
  let acc = 0
  return groups.map((grp) => {
    const t = (acc / text.length) * seconds
    acc += grp.join(' ').length + 1
    return [grp.join(' '), t, 0]
  })
}

/* ───────── pieces ───────── */

interface Blur {
  /** centre and radii, in source-image pixels */
  cx: number
  cy: number
  rx: number
  ry: number
}

/** A taped-on photo print. The photo covers the frame; `anchor` (0–1 per axis) picks which part shows */
function PhotoCard({
  src, natW, natH, width, height, anchor = [0.5, 0.5], zoom = 1, blurs = [], circle, style,
}: {
  src: string
  natW: number
  natH: number
  width: number
  height: number
  anchor?: [number, number]
  zoom?: number
  blurs?: Blur[]
  /** red marker ring: centre in source px, radii in displayed px, progress 0→1 */
  circle?: { cx: number; cy: number; rx: number; ry: number; p: number }
  style?: CSSProperties
}) {
  const s = Math.max(width / natW, height / natH)
  const left = -(natW * s - width) * anchor[0]
  const top = -(natH * s - height) * anchor[1]
  const img: CSSProperties = { position: 'absolute', left, top, width: natW * s, height: natH * s, maxWidth: 'none' }
  return (
    <div className="absolute" style={{ background: '#fff', padding: 18, border: `6px solid ${INK}`, borderRadius: 18, boxShadow: `14px 14px 0 ${INK}`, ...style }}>
      <div className="relative overflow-hidden" style={{ width, height, borderRadius: 8, border: `4px solid ${INK}` }}>
        <div className="absolute inset-0" style={{ transform: `scale(${zoom})` }}>
          <Img src={staticFile(src)} style={img} />
          {blurs.map((b, i) => (
            <Img
              key={i}
              src={staticFile(src)}
              style={{ ...img, filter: 'blur(16px)', clipPath: `ellipse(${b.rx * s}px ${b.ry * s}px at ${b.cx * s}px ${b.cy * s}px)` }}
            />
          ))}
          {circle && (
            <svg className="absolute" style={{ left: 0, top: 0, overflow: 'visible' }} width={width} height={height}>
              <ellipse
                cx={left + circle.cx * s}
                cy={top + circle.cy * s}
                rx={circle.rx}
                ry={circle.ry}
                fill="none"
                stroke="#E4002B"
                strokeWidth={10}
                strokeLinecap="round"
                pathLength={1000}
                strokeDasharray={1000}
                strokeDashoffset={1000 * (1 - circle.p)}
                transform={`rotate(-8 ${left + circle.cx * s} ${top + circle.cy * s})`}
              />
            </svg>
          )}
        </div>
      </div>
      <span className="absolute" style={{ left: '50%', top: -26, width: 210, height: 50, marginLeft: -105, background: 'rgba(255,255,255,.75)', border: '3px solid rgba(22,19,15,.2)', transform: 'rotate(-4deg)' }} />
    </div>
  )
}

/* ───────── 1 · "…when our roads look like this? And this?" ───────── */

// taller than the photo, so it fills the screen; the sides crop a little
const POTHOLES = { natW: 1024, natH: 697, width: 880, height: 740 }
// the heap and the truck (source rows ~620–1810); the woman sorting through it and the truck's phone numbers are blurred
const GARBAGE = { natW: 1500, natH: 2000, width: 860, height: 680, anchor: [0.5, 0.762] as [number, number] }
const GARBAGE_BLURS: Blur[] = [
  { cx: 505, cy: 1078, rx: 120, ry: 125 },
  { cx: 777, cy: 969, rx: 48, ry: 32 },
]

function ProofScene({ scene }: { scene: StoryPlacedScene }) {
  const f = useCurrentFrame()
  const roadsAt = storyWordAt(scene, 'q', 'roads')
  const thisAt = storyLineOf(scene, 'this').from
  const swap = sp(f, thisAt - 3, { damping: 15, stiffness: 170 })
  const slap = sp(f, thisAt - 3, { damping: 12, stiffness: 190 })
  const zoom = 1 + ramp(f, [0, scene.duration], [0, 0.07], Easing.linear)

  return (
    <Bg>
      <div className="absolute w-full text-center" style={{ top: 270, padding: '0 40px' }}>
        <h1 className="font-display font-extrabold" style={{ fontSize: 92, lineHeight: 1, letterSpacing: '-0.04em', color: INK }}>
          Where's our <span style={{ background: C.marigold, padding: '0 14px', borderRadius: 16 }}>tax money</span> going? 🤔
        </h1>
      </div>

      {/* Exhibit A: on screen from the first frame, so the story's preview already hooks */}
      <div
        className="absolute"
        style={{ left: 76, top: 510, transform: `translate(${-24 * swap}px, ${-60 * swap}px) rotate(${-3 - 5 * swap}deg) scale(${1 - 0.14 * swap})` }}
      >
        <PhotoCard
          src="story/potholes.webp"
          {...POTHOLES}
          zoom={zoom}
          circle={{ cx: 575, cy: 578, rx: 150, ry: 88, p: ramp(f, [roadsAt, roadsAt + 14]) }}
          style={{ position: 'relative' }}
        />
        <div className="absolute" style={{ left: 30, bottom: -40, ...pop(f, roadsAt, -4) }}>
          <Sticker tone="pink" size={42}>Exhibit A: our roads 🕳️</Sticker>
        </div>
      </div>

      {/* Exhibit B slaps on top */}
      {f >= thisAt - 4 && (
        <div className="absolute" style={{ left: 86, top: 800, transform: `translateY(${(1 - slap) * 1300}px) rotate(${4 + 10 * (1 - slap)}deg)` }}>
          <PhotoCard
            src="story/garbage.webp"
            {...GARBAGE}
            zoom={1 + ramp(f, [thisAt, scene.duration], [0, 0.05], Easing.linear)}
            blurs={GARBAGE_BLURS}
            circle={{ cx: 700, cy: 1280, rx: 330, ry: 130, p: ramp(f, [thisAt + 8, thisAt + 22]) }}
            style={{ position: 'relative' }}
          />
          <div className="absolute" style={{ right: 30, bottom: -40, ...pop(f, thisAt + 6, 4) }}>
            <Sticker tone="blue" size={42}>Exhibit B: our streets 🗑️</Sticker>
          </div>
        </div>
      )}

      <Sfx at={roadsAt} name="pop" volume={0.35} />
      <Sfx at={thisAt - 1} name="stamp" volume={0.5} />
      <Sfx at={thisAt + 6} name="pop" volume={0.35} />
    </Bg>
  )
}

/* ───────── 2 · "So I built Nirmaan." ───────── */

function BrandScene({ scene }: { scene: StoryPlacedScene }) {
  const f = useCurrentFrame()
  const line = storyLineOf(scene, 'built')
  const nameAt = storyWordAt(scene, 'built', 'nirmaan')

  return (
    <Bg color={C.marigold} pattern="dots">
      <AbsoluteFill className="flex flex-col items-center justify-center" style={{ paddingBottom: 60 }}>
        <div style={pop(f, line.from - 6, -6, 0.3)}>
          <LogoMark size={300} />
        </div>
        <p className="font-display font-extrabold" style={{ fontSize: 176, lineHeight: 1, letterSpacing: '-0.05em', color: INK, marginTop: 56, ...pop(f, nameAt - 3, 0, 0.6) }}>
          Nirmaan
        </p>
        <p className="font-hand" style={{ fontSize: 52, color: INK, opacity: 0.75, marginTop: 6, ...rise(f, nameAt + 4) }}>
          निर्माण · build india
        </p>
        <div style={{ marginTop: 64, ...pop(f, nameAt + 9, -3) }}>
          <Sticker tone="ink" size={54}>
            Your tax. Your say.
          </Sticker>
        </div>
      </AbsoluteFill>
      <Sfx at={line.from - 6} name="pop" volume={0.4} />
      <Sfx at={nameAt + 9} name="ding" volume={0.3} />
    </Bg>
  )
}

/* ───────── 3 · "You pick where a slice of the tax you already pay goes, and track every rupee." ───────── */

// the fixes for exactly what the photos show (the pothole drive is one of last year's delivered projects)
const PICKS = ['blr-potholes', 'blr-garbage', 'blr-lake-park']
const ALL_PROJECTS = [...PROJECTS, ...Object.values(DELIVERED)]

// ₹8 L income tax → the 10% slice (₹80,000) split 3:3:2 across the picks, then tracked as it gets spent
const TAX = 8_00_000
const SPLIT = [30_000, 30_000, 20_000]
const SPENT = [21_000, 12_000, 6_000]
const BAR = { left: 98, top: 562, w: 884, h: 64 }
const SLICE_X = BAR.left + BAR.w * 0.9
const SLICE_W = BAR.w * 0.1
const CARD_TOP = 760
const CARD_STEP = 190
const CARD_H = 172
const PILL = { left: 1080 - 98 - 200, top: 22, w: 200, h: 58 }

function AppScene({ scene }: { scene: StoryPlacedScene }) {
  const f = useCurrentFrame()
  const pickAt = storyWordAt(scene, 'pick', 'pick')
  const sliceAt = storyWordAt(scene, 'pick', 'slice')
  const alreadyAt = storyWordAt(scene, 'pick', 'already')
  const goesAt = storyWordAt(scene, 'pick', 'goes')
  const trackAt = storyWordAt(scene, 'pick', 'track')
  const projects = PICKS.map((id) => ALL_PROJECTS.find((p) => p.id === id)!)
  const lift = sp(f, sliceAt, { damping: 10, stiffness: 200 })
  const emptied = f >= goesAt

  return (
    <Bg>
      <div className="absolute w-full" style={{ top: 270, padding: '0 70px' }}>
        <h2 className="font-display font-extrabold" style={{ fontSize: 84, lineHeight: 0.95, letterSpacing: '-0.045em', color: INK, ...rise(f, -4) }}>
          You pick what
          <br />
          your tax <span style={{ color: C.pink }}>builds.</span>
        </h2>
      </div>

      {/* your income tax, with the 10% slice that tears off */}
      <div className="absolute" style={{ left: 70, right: 70, top: 470, height: 250, background: '#fff', border: `5px solid ${INK}`, borderRadius: 28, boxShadow: `8px 8px 0 ${INK}`, ...rise(f, 0, 50) }}>
        <div className="flex items-baseline justify-between" style={{ padding: '20px 28px 0' }}>
          <span className="font-mono font-bold uppercase" style={{ fontSize: 22, letterSpacing: '0.16em', color: INK }}>Your income tax</span>
          <span className="font-display font-extrabold" style={{ fontSize: 46, letterSpacing: '-0.02em', color: INK }}>{rupees(TAX)}</span>
        </div>
      </div>
      <div className="absolute inset-0" style={{ ...rise(f, 0, 50) }}>
        <div
          className="absolute flex items-center"
          style={{ left: BAR.left, top: BAR.top, width: BAR.w * 0.9 - 8, height: BAR.h, background: INK, borderRadius: 14, paddingLeft: 22 }}
        >
          <span className="font-sans" style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>90% keeps India running</span>
        </div>
        <div
          className="absolute flex items-center justify-center font-display font-extrabold"
          style={{
            left: SLICE_X,
            top: BAR.top,
            width: SLICE_W,
            height: BAR.h,
            borderRadius: 14,
            fontSize: 26,
            color: INK,
            background: emptied ? 'transparent' : C.marigold,
            border: emptied ? `4px dashed ${INK}` : `4px solid ${INK}`,
            transform: `translateY(${-12 * lift}px) rotate(${6 * lift}deg) scale(${1 + 0.12 * lift})`,
            zIndex: 5,
          }}
        >
          {emptied ? '' : '10%'}
        </div>
        <div className="absolute" style={{ left: BAR.left, top: BAR.top + BAR.h + 18, ...pop(f, alreadyAt, -3, 0.3) }}>
          <Sticker tone="mint" size={28}>
            ₹0 extra · already paid
          </Sticker>
        </div>
        <p
          className="absolute font-display font-extrabold"
          style={{ right: 1080 - (BAR.left + BAR.w), top: BAR.top + BAR.h + 18, fontSize: 30, color: C.pink, ...rise(f, sliceAt + 3, 20) }}
        >
          {rupees(TAX / 10)} is yours to direct
        </p>
      </div>

      {/* the projects you picked */}
      {projects.map((p, i) => {
        const top = CARD_TOP + i * CARD_STEP
        const picked = sp(f, pickAt + i * 7, { damping: 12, stiffness: 230 })
        const spend = ramp(f, [trackAt + i * 5, trackAt + i * 5 + 26])
        return (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: 70,
              right: 70,
              top,
              height: CARD_H,
              padding: '22px 28px',
              borderRadius: 28,
              border: `5px solid ${INK}`,
              boxShadow: `8px 8px 0 ${INK}`,
              background: picked > 0.5 ? '#FFF3D1' : '#fff',
              ...rise(f, 4 + i * 4, 60),
            }}
          >
            <div className="flex items-center" style={{ gap: 22, paddingRight: PILL.w + 6 }}>
              <span className="relative">
                <ProjectGlyph project={p} size={80} />
                <span
                  className="absolute flex items-center justify-center rounded-full"
                  style={{ left: -14, top: -14, width: 44, height: 44, background: C.mint, border: `4px solid ${INK}`, transform: `scale(${Math.min(1.15, picked)})` }}
                >
                  <Check size={26} strokeWidth={4.5} color="#fff" />
                </span>
              </span>
              <div className="min-w-0">
                <p className="font-display font-extrabold" style={{ fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.02em', color: INK }}>{p.title}</p>
                <p className="font-sans" style={{ fontSize: 22, color: '#6B645B', marginTop: 4 }}>{p.where}</p>
              </div>
            </div>
            {/* where the money goes: fills as it's spent, milestone by milestone */}
            <div className="flex items-center" style={{ gap: 18, marginTop: 14, opacity: f >= trackAt - 4 ? 1 : 0.35 }}>
              <div className="flex-1" style={{ height: 22, borderRadius: 99, border: `4px solid ${INK}`, background: '#fff', overflow: 'hidden' }}>
                <div style={{ width: `${(SPENT[i] / SPLIT[i]) * spend * 100}%`, height: '100%', background: C.saffron }} />
              </div>
              <span className="font-mono font-bold" style={{ fontSize: 22, color: INK, width: 230, textAlign: 'right' }}>
                {f >= trackAt - 4 ? `${rupees(Math.round((SPENT[i] * spend) / 100) * 100)} spent` : 'not spent yet'}
              </span>
            </div>
            {/* empty slot until its share of the slice lands */}
            <span
              className="absolute flex items-center justify-center rounded-full font-display font-bold"
              style={{ left: PILL.left - 70 - 5, top: PILL.top - 5, width: PILL.w, height: PILL.h, border: `4px dashed rgba(22,19,15,.35)`, fontSize: 24, color: 'rgba(22,19,15,.4)' }}
            >
              ₹ ?
            </span>
          </div>
        )
      })}

      {/* the running total across all three, as it would show on the public ledger */}
      <div className="absolute flex w-full justify-center" style={{ top: CARD_TOP + 3 * CARD_STEP + 6, ...pop(f, trackAt + 10, -2, 0.5) }}>
        <span
          className="inline-flex items-center rounded-full font-display font-extrabold"
          style={{ gap: 14, background: INK, color: '#fff', border: `4px solid ${INK}`, boxShadow: `6px 6px 0 rgba(22,19,15,.25)`, padding: '14px 30px', fontSize: 32 }}
        >
          <span style={{ color: C.marigold }}>e₹ ledger</span>
          {rupees(Math.round(SPENT.reduce((sum, v, i) => sum + v * ramp(f, [trackAt + i * 5, trackAt + i * 5 + 26]), 0) / 100) * 100)} of {rupees(TAX / 10)} spent
        </span>
      </div>

      {/* the slice splits and each piece flies into its project */}
      {f >= goesAt &&
        SPLIT.map((amt, i) => {
          const before = SPLIT.slice(0, i).reduce((a, b) => a + b, 0)
          const total = SPLIT.reduce((a, b) => a + b, 0)
          const x0 = SLICE_X + (SLICE_W * before) / total
          const w0 = (SLICE_W * amt) / total
          const y0 = BAR.top - 12
          const x1 = PILL.left
          const y1 = CARD_TOP + i * CARD_STEP + PILL.top
          const t = sp(f, goesAt + i * 4, { damping: 15, stiffness: 150 })
          return (
            <div
              key={i}
              className="absolute flex items-center justify-center font-display font-extrabold"
              style={{
                left: x0 + (x1 - x0) * t,
                top: y0 + (y1 - y0) * t,
                width: w0 + (PILL.w - w0) * t,
                height: BAR.h + (PILL.h - BAR.h) * t,
                borderRadius: 8 + 21 * Math.min(1, t),
                background: C.marigold,
                border: `4px solid ${INK}`,
                boxShadow: `${4 * t}px ${4 * t}px 0 ${INK}`,
                fontSize: 30,
                color: INK,
                zIndex: 10,
              }}
            >
              <span style={{ opacity: ramp(t, [0.75, 1]) }}>{rupees(amt)}</span>
            </div>
          )
        })}

      {projects.map((p, i) => (
        <Sfx key={p.id} at={pickAt + i * 7} name="tick" volume={0.35} />
      ))}
      <Sfx at={sliceAt} name="rip" volume={0.4} />
      <Sfx at={alreadyAt} name="stamp" volume={0.4} />
      {SPLIT.map((_, i) => (
        <Sfx key={i} at={goesAt + i * 4 + 8} name="coin" volume={0.3} />
      ))}
      <Sfx at={trackAt + 30} name="ding" volume={0.3} />
    </Bg>
  )
}

/* ───────── 4 · "Less ranting, more building. Tap the link!" ───────── */

function EndScene({ scene }: { scene: StoryPlacedScene }) {
  const f = useCurrentFrame()
  const line = storyLineOf(scene, 'end')
  const rantAt = storyWordAt(scene, 'end', 'ranting')
  const moreAt = storyWordAt(scene, 'end', 'more')
  const tapAt = storyWordAt(scene, 'end', 'tap')
  const strike = ramp(f, [rantAt, rantAt + 9])
  const bob = Math.sin(f / 4) * 14

  return (
    <Bg>
      {/* the rant, crossed out */}
      <div className="absolute" style={{ left: 70, right: 70, top: 280, opacity: 1 - 0.45 * strike, ...rise(f, -6) }}>
        <div className="overflow-hidden" style={{ borderRadius: 34, border: `5px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}` }}>
          <div className="flex items-center" style={{ gap: 18, background: C.mint, padding: '18px 26px', borderBottom: `5px solid ${INK}` }}>
            <span className="flex items-center justify-center rounded-full" style={{ width: 62, height: 62, background: C.marigold, border: `4px solid ${INK}`, fontSize: 32 }}>☕</span>
            <span className="font-display font-extrabold" style={{ fontSize: 38, color: '#fff' }}>Chai Sutta Gang</span>
          </div>
          <div style={{ background: '#EFE7DC', padding: '26px 26px 30px' }}>
            <div className="relative inline-block" style={{ background: '#fff', border: `4px solid ${INK}`, borderRadius: 26, borderBottomLeftRadius: 8, padding: '14px 24px' }}>
              <p className="font-sans" style={{ fontSize: 26, fontWeight: 700, color: C.pink }}>Every. Single. Break.</p>
              <p className="font-sans" style={{ fontSize: 44, fontWeight: 600, lineHeight: 1.15, color: INK }}>
                Where the hell is my
                <br />
                tax money going?? 😤
              </p>
              <span
                className="absolute"
                style={{ left: '-3%', top: '86%', height: 14, width: `${strike * 106}%`, background: C.pink, borderRadius: 99, transform: 'rotate(-15deg)', transformOrigin: '0% 50%' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute w-full text-center" style={{ top: 760 }}>
        <p className="font-display font-extrabold" style={{ fontSize: 124, lineHeight: 1, letterSpacing: '-0.05em', color: INK, ...pop(f, line.from - 2, -2, 0.5) }}>
          Less ranting.
        </p>
        <p className="font-display font-extrabold" style={{ fontSize: 124, lineHeight: 1, letterSpacing: '-0.05em', color: INK, marginTop: 18, ...pop(f, moreAt - 2, 2, 0.5) }}>
          <span style={{ background: C.marigold, padding: '0 22px', borderRadius: 22 }}>More building.</span>
        </p>
      </div>

      <div className="absolute flex w-full flex-col items-center" style={{ top: 1110, ...pop(f, tapAt - 2, -3, 0.4) }}>
        <Sticker tone="pink" size={58}>
          Tap the link
        </Sticker>
        <ArrowDown size={110} strokeWidth={3.2} color={INK} style={{ marginTop: 26, transform: `translateY(${bob}px)` }} />
      </div>

      <Sfx at={rantAt} name="rip" volume={0.4} />
      <Sfx at={moreAt - 2} name="pop" volume={0.35} />
      <Sfx at={tapAt - 2} name="ding" volume={0.35} />
    </Bg>
  )
}
