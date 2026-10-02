import { createContext, useContext, type CSSProperties, type ReactNode } from 'react'
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, type SpringConfig } from 'remotion'
import {
  Bike, BookOpen, Brain, Bus, Cpu, Droplets, Dumbbell, Film, Footprints, Heart, Lamp, Library, Mountain, Recycle,
  Stethoscope, Telescope, TrainFront, Trees, Trophy, Truck, WavesHorizontal, Wind, Zap, type LucideIcon,
} from 'lucide-react'
import { FPS } from './timeline'
import { CATEGORIES, type IconKey, type Project } from '../../src/data/projects'

export const INK = '#16130F'
export const C = {
  ink: INK,
  paper: '#FFF6EA',
  marigold: '#FFC22E',
  pink: '#FF4F8B',
  blue: '#3D5AFE',
  mint: '#17B26A',
  lilac: '#9B6BFF',
  saffron: '#FF7A1A',
  teal: '#00A6A6',
}

/* ───────── timing helpers (pure, frame-based) ───────── */

export function sp(frame: number, delay = 0, config: Partial<SpringConfig> = {}) {
  return spring({ frame: frame - delay, fps: FPS, config: { damping: 13, stiffness: 170, mass: 0.8, ...config } })
}

export function ramp(frame: number, range: [number, number], out: [number, number] = [0, 1], ease = Easing.bezier(0.22, 1, 0.36, 1)) {
  return interpolate(frame, range, out, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease })
}

/** Scale-and-tilt pop-in style */
export function pop(frame: number, delay: number, rotate = 0, from = 0.4): CSSProperties {
  const s = sp(frame, delay)
  return {
    transform: `scale(${from + (1 - from) * s}) rotate(${rotate * s}deg)`,
    opacity: interpolate(frame - delay, [0, 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  }
}

/** Fade-and-rise style */
export function rise(frame: number, delay: number, dist = 40): CSSProperties {
  const s = sp(frame, delay, { damping: 18, stiffness: 140 })
  return {
    transform: `translateY(${(1 - s) * dist}px)`,
    opacity: interpolate(frame - delay, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  }
}

/** Fade out over the last frames of a scene */
export function outro(frame: number, duration: number, len = 8): number {
  return interpolate(frame, [duration - len, duration], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
}

export function rupees(n: number) {
  return '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(n))
}

/* ───────── audio ───────── */

export type SfxName = 'pop' | 'ding' | 'coin' | 'whoosh' | 'stamp' | 'tick' | 'rip' | 'click'

/** Lets a render switch all sound effects off */
export const SfxOn = createContext(true)

export function Sfx({ at, name, volume = 0.35 }: { at: number; name: SfxName; volume?: number }) {
  const on = useContext(SfxOn)
  if (!on) return null
  return (
    <Sequence from={Math.max(0, Math.round(at))} durationInFrames={24} layout="none">
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
    </Sequence>
  )
}

/* ───────── surfaces ───────── */

export function Bg({ color = C.paper, pattern = 'grid', children }: { color?: string; pattern?: 'grid' | 'dots' | 'none'; children?: ReactNode }) {
  return (
    <AbsoluteFill style={{ background: color }}>
      {pattern !== 'none' && <AbsoluteFill className={pattern === 'grid' ? 'bg-grid' : 'bg-dots'} style={{ opacity: pattern === 'dots' ? 0.35 : 1 }} />}
      {children}
    </AbsoluteFill>
  )
}

const STICKER_TONES = {
  pink: { bg: C.pink, fg: '#fff' },
  marigold: { bg: C.marigold, fg: INK },
  blue: { bg: C.blue, fg: '#fff' },
  mint: { bg: C.mint, fg: '#fff' },
  ink: { bg: INK, fg: C.marigold },
  white: { bg: '#fff', fg: INK },
  lilac: { bg: C.lilac, fg: '#fff' },
}

export function Sticker({ children, tone = 'pink', size = 34, style }: { children: ReactNode; tone?: keyof typeof STICKER_TONES; size?: number; style?: CSSProperties }) {
  const t = STICKER_TONES[tone]
  return (
    <span
      className="inline-flex items-center gap-3 rounded-full font-display font-extrabold"
      style={{
        background: t.bg,
        color: t.fg,
        border: `4px solid ${INK}`,
        boxShadow: `6px 6px 0 ${INK}`,
        padding: `${size * 0.32}px ${size * 0.7}px`,
        fontSize: size,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  )
}

export function Eyebrow({ children, dot = C.pink, color = INK, size = 24 }: { children: ReactNode; dot?: string; color?: string; size?: number }) {
  return (
    <p className="flex items-center gap-3 font-mono font-bold uppercase" style={{ fontSize: size, letterSpacing: '0.18em', color }}>
      <span style={{ width: size * 0.6, height: size * 0.6, borderRadius: 99, background: dot, border: `3px solid ${color === INK ? INK : '#fff'}` }} />
      {children}
    </p>
  )
}

/** The e₹ coin */
export function Coin({ size = 110, spin = 0 }: { size?: number; spin?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-full font-display font-extrabold"
      style={{
        width: size,
        height: size,
        background: C.marigold,
        border: `${Math.max(4, size * 0.05)}px solid ${INK}`,
        boxShadow: `${size * 0.06}px ${size * 0.06}px 0 ${INK}`,
        fontSize: size * 0.36,
        color: INK,
        transform: `rotateY(${spin}deg)`,
      }}
    >
      e₹
    </div>
  )
}

/** Mouse pointer that glides between points and squishes on click */
export function Cursor({ x, y, pressed = 0 }: { x: number; y: number; pressed?: number }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, zIndex: 50, transform: `scale(${1 - pressed * 0.18})`, transformOrigin: 'top left' }}>
      {pressed > 0.05 && (
        <span
          style={{
            position: 'absolute',
            left: -34,
            top: -34,
            width: 68,
            height: 68,
            borderRadius: 99,
            border: `5px solid ${C.pink}`,
            opacity: pressed,
            transform: `scale(${0.6 + pressed * 0.6})`,
          }}
        />
      )}
      <svg width="58" height="66" viewBox="0 0 29 33" style={{ filter: `drop-shadow(4px 4px 0 ${INK})` }}>
        <path d="M2 2 L2 27 L9 21 L14 31 L19 29 L14 19 L23 19 Z" fill="#fff" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/** Animate the cursor along keyframes [{f, x, y}] */
export function cursorAt(frame: number, keys: { f: number; x: number; y: number }[]) {
  if (frame <= keys[0].f) return { x: keys[0].x, y: keys[0].y }
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i]
    const b = keys[i + 1]
    if (frame <= b.f) {
      const t = ramp(frame, [a.f, b.f], [0, 1], Easing.bezier(0.65, 0, 0.35, 1))
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
    }
  }
  const last = keys[keys.length - 1]
  return { x: last.x, y: last.y }
}

/** 0→1→0 pulse around click frames, for button squish + cursor ring */
export function clickPulse(frame: number, clicks: number[]) {
  let p = 0
  for (const c of clicks) p = Math.max(p, interpolate(frame, [c - 3, c, c + 7], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))
  return p
}

/** Hand-drawn underline that draws in with progress 0→1 */
export function Squiggle({ progress, color = C.pink, width = 600, height = 36, strokeWidth = 12 }: { progress: number; color?: string; width?: number; height?: number; strokeWidth?: number }) {
  const len = 1000
  return (
    <svg width={width} height={height} viewBox="0 0 300 20" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
      <path
        d="M3 13 C 40 3, 70 19, 110 10 S 180 2, 220 11 S 280 16, 297 6"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth / 2}
        strokeLinecap="round"
        pathLength={len}
        strokeDasharray={len}
        strokeDashoffset={len * (1 - progress)}
      />
    </svg>
  )
}

export function LogoMark({ size = 120 }: { size?: number }) {
  return (
    <span
      className="relative inline-flex items-center justify-center font-display font-extrabold"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.26,
        background: C.marigold,
        border: `${size * 0.055}px solid ${INK}`,
        boxShadow: `${size * 0.06}px ${size * 0.06}px 0 ${INK}`,
        fontSize: size * 0.62,
        lineHeight: 1,
        color: INK,
      }}
    >
      <span style={{ marginTop: -size * 0.08 }}>N</span>
      <span
        style={{
          position: 'absolute',
          right: -size * 0.12,
          top: -size * 0.12,
          width: size * 0.3,
          height: size * 0.3,
          borderRadius: 99,
          background: C.pink,
          border: `${size * 0.05}px solid ${INK}`,
        }}
      />
    </span>
  )
}

export function Wordmark({ size = 52, light = false }: { size?: number; light?: boolean }) {
  return (
    <span className="inline-flex items-center" style={{ gap: size * 0.3 }}>
      <LogoMark size={size * 1.25} />
      <span className="flex flex-col" style={{ lineHeight: 1 }}>
        <span className="font-display font-extrabold" style={{ fontSize: size, letterSpacing: '-0.03em', color: light ? '#fff' : INK }}>
          Nirmaan
        </span>
        <span className="font-hand" style={{ fontSize: size * 0.34, color: light ? 'rgba(255,255,255,.7)' : '#6B645B' }}>
          निर्माण · build india
        </span>
      </span>
    </span>
  )
}

/* ───────── projects ───────── */

const ICONS: Record<IconKey, LucideIcon> = {
  cpu: Cpu, brain: Brain, trophy: Trophy, stethoscope: Stethoscope, heart: Heart, film: Film, wind: Wind,
  telescope: Telescope, library: Library, droplets: Droplets, train: TrainFront, trees: Trees, mountain: Mountain,
  bus: Bus, recycle: Recycle, footprints: Footprints, bike: Bike, lamp: Lamp, dumbbell: Dumbbell, book: BookOpen,
  waves: WavesHorizontal, truck: Truck, zap: Zap,
}

export function projectIcon(p: Project): LucideIcon {
  return ICONS[p.icon]
}

export function ProjectGlyph({ project, size = 72 }: { project: Project; size?: number }) {
  const Icon = ICONS[project.icon]
  const cat = CATEGORIES[project.category]
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size, borderRadius: size * 0.28, background: cat.soft, border: `4px solid ${INK}`, color: INK }}
    >
      <Icon size={size * 0.5} strokeWidth={2.3} />
    </span>
  )
}

export function Pill({ children, bg = '#fff', fg = INK, size = 18 }: { children: ReactNode; bg?: string; fg?: string; size?: number }) {
  return (
    <span
      className="inline-flex items-center rounded-full font-bold uppercase"
      style={{ background: bg, color: fg, border: `3px solid ${INK}`, padding: `${size * 0.2}px ${size * 0.6}px`, fontSize: size, letterSpacing: '0.04em', lineHeight: 1.1 }}
    >
      {children}
    </span>
  )
}

/** Chunky progress bar */
export function Bar({ value, color, height = 22 }: { value: number; color: string; height?: number }) {
  return (
    <div style={{ height, borderRadius: 99, border: `4px solid ${INK}`, background: '#fff', overflow: 'hidden' }}>
      <div style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, height: '100%', background: color, borderRight: value > 0.01 ? `4px solid ${INK}` : 'none' }} />
    </div>
  )
}

/* ───────── brand marks (drawn, not imported, to keep the video self-contained) ───────── */

export function BrandIcon({ name, size = 28 }: { name: 'whatsapp' | 'instagram' | 'linkedin' | 'x'; size?: number }) {
  if (name === 'instagram')
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    )
  const paths = {
    whatsapp:
      'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3 1 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3z',
    linkedin:
      'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z',
    x: 'M18.2 2.25h3.3l-7.2 8.26 8.5 11.24h-6.65l-5.2-6.8-5.96 6.8H1.68l7.73-8.84L1.25 2.25h6.82l4.7 6.2 5.43-6.2zm-1.16 17.52h1.83L7.08 4.13H5.12l11.92 15.64z',
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d={paths[name]} />
    </svg>
  )
}
