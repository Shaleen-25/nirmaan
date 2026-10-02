import { useEffect, useRef, useState, type ReactNode } from 'react'
import { animate, motion, useInView } from 'motion/react'
import clsx from 'clsx'
import { Info } from 'lucide-react'

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={clsx('inline-flex items-center gap-2', className)}>
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink bg-marigold shadow-[2px_2px_0_#16130F]">
        <span className="font-display text-xl font-extrabold leading-none text-ink">n</span>
        <span className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 rounded-full border-2 border-ink bg-pink" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={clsx('font-display text-[22px] font-extrabold tracking-tight', light ? 'text-white' : 'text-ink')}>nirmaan</span>
        <span className={clsx('font-hand text-[11px]', light ? 'text-white/60' : 'text-muted')}>निर्माण · build india</span>
      </span>
    </span>
  )
}

const TONES = {
  white: 'bg-card',
  paper: 'bg-paper',
  marigold: 'bg-marigold',
  pink: 'bg-pink',
  blue: 'bg-chakra text-white',
  ink: 'bg-ink text-white',
  mint: 'bg-leaf-soft',
  lilac: 'bg-lilac-soft',
  peach: 'bg-saffron-soft',
  sky: 'bg-chakra-soft',
} as const
export type Tone = keyof typeof TONES

export function Card({ className, children, tone = 'white', size = 'md' }: { className?: string; children: ReactNode; tone?: Tone; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className={clsx('rounded-[26px]', size === 'sm' ? 'brut-sm' : size === 'lg' ? 'brut-lg' : 'brut', TONES[tone], className)}>{children}</div>
  )
}

export function Pill({ children, color, soft, className }: { children: ReactNode; color?: string; soft?: string; className?: string }) {
  return (
    <span
      className={clsx('inline-flex items-center gap-1 rounded-full border-[1.5px] border-ink px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide', className)}
      style={{ color: color ?? '#16130F', background: soft ?? '#FFFFFF' }}
    >
      {children}
    </span>
  )
}

/** A rotated badge, like a laptop sticker */
export function Sticker({ children, className, tone = 'pink', rotate = -6 }: { children: ReactNode; className?: string; tone?: 'pink' | 'marigold' | 'blue' | 'mint' | 'ink' | 'lilac'; rotate?: number }) {
  const bg = { pink: 'bg-pink text-white', marigold: 'bg-marigold text-ink', blue: 'bg-chakra text-white', mint: 'bg-leaf text-white', ink: 'bg-ink text-marigold', lilac: 'bg-lilac text-white' }[tone]
  return (
    <span
      className={clsx('inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3.5 py-1.5 font-display text-sm font-extrabold shadow-[3px_3px_0_#16130F]', bg, className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  )
}

export function Eyebrow({ children, className, dot = '#FF4F8B' }: { children: ReactNode; className?: string; dot?: string }) {
  return (
    <p className={clsx('inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink', className)}>
      <span className="h-2.5 w-2.5 rounded-full border-[1.5px] border-ink" style={{ background: dot }} />
      {children}
    </p>
  )
}

/** Handwritten margin note */
export function Scribble({ children, className, arrow = 'down' }: { children: ReactNode; className?: string; arrow?: 'down' | 'left' | 'right' | 'none' }) {
  return (
    <span className={clsx('inline-flex items-center gap-1 font-hand text-lg leading-tight text-pink', className)}>
      {arrow === 'left' && <Arrow className="h-6 w-8 -scale-x-100" />}
      {children}
      {arrow === 'right' && <Arrow className="h-6 w-8" />}
      {arrow === 'down' && <Arrow className="h-8 w-6 rotate-90" />}
    </span>
  )
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 14c8-8 20-10 33-3" />
      <path d="M28 4l7 7-9 3" />
    </svg>
  )
}

/** Hand-drawn underline that draws itself */
export function Squiggle({ className, color = '#FF4F8B' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 300 20" preserveAspectRatio="none" className={className} fill="none">
      <motion.path
        d="M3 13 C 40 3, 70 19, 110 10 S 180 2, 220 11 S 280 16, 297 6"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, delay: 0.5, ease: 'easeInOut' }}
      />
    </svg>
  )
}

/** Marker-pen highlight behind text */
export function Mark({ children, color = '#FFC22E' }: { children: ReactNode; color?: string }) {
  return (
    <span className="relative isolate whitespace-nowrap">
      <span className="absolute inset-x-[-4px] bottom-[0.08em] top-[0.45em] -z-10 -rotate-1 rounded-md" style={{ background: color }} />
      {children}
    </span>
  )
}

export function Progress({ value, color = '#17B26A', className }: { value: number; color?: string; className?: string }) {
  return (
    <div className={clsx('h-3.5 w-full overflow-hidden rounded-full border-2 border-ink bg-white', className)}>
      <motion.div
        className="h-full rounded-full border-r-2 border-ink"
        style={{ background: color }}
        initial={{ width: 0 }}
        whileInView={{ width: `${Math.max(4, Math.min(100, value * 100))}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}

/** Counts up to `value` when it scrolls into view, and re-animates on change */
export function Counter({ value, format, className }: { value: number; format: (n: number) => string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [shown, setShown] = useState(0)
  const prev = useRef(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(prev.current, value, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(v),
    })
    prev.current = value
    return () => controls.stop()
  }, [inView, value])
  return (
    <span ref={ref} className={clsx('tabular', className)}>
      {format(shown)}
    </span>
  )
}

export function InfoTip({ children, label = 'More info' }: { children: ReactNode; label?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-flex align-middle" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-current opacity-70 transition hover:opacity-100"
      >
        <Info className="h-4 w-4" />
      </button>
      {open && (
        <motion.span
          initial={{ opacity: 0, y: 4, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: -1 }}
          className="brut absolute left-1/2 top-7 z-50 w-72 -translate-x-1/2 rounded-2xl bg-marigold p-4 text-left text-xs font-medium normal-case leading-relaxed tracking-normal text-ink sm:w-80"
        >
          {children}
        </motion.span>
      )}
    </span>
  )
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  className,
  disabled,
  type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'marigold' | 'pink' | 'white' | 'ghost'
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-display text-[15px] font-bold transition disabled:pointer-events-none disabled:opacity-40',
        variant !== 'ghost' && 'brut-sm press',
        variant === 'primary' && 'bg-ink text-white',
        variant === 'marigold' && 'bg-marigold text-ink',
        variant === 'pink' && 'bg-pink text-white',
        variant === 'white' && 'bg-white text-ink',
        variant === 'ghost' && 'text-ink hover:bg-black/5',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function Donut({
  segments,
  size = 220,
  thickness = 28,
  active,
  onHover,
  children,
}: {
  segments: { id: string; value: number; color: string }[]
  size?: number
  thickness?: number
  active?: string | null
  onHover?: (id: string | null) => void
  children?: ReactNode
}) {
  const r = (size - thickness) / 2 - 3
  const c = 2 * Math.PI * r
  const total = segments.reduce((a, s) => a + s.value, 0) || 1
  let offset = 0
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r + thickness / 2} fill="none" stroke="#16130F" strokeWidth={2.5} />
        <circle cx={size / 2} cy={size / 2} r={r - thickness / 2} fill="none" stroke="#16130F" strokeWidth={2.5} />
        {segments.map((s, i) => {
          const len = (s.value / total) * c
          const el = (
            <motion.circle
              key={s.id}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness - 2.5}
              strokeDasharray={`${Math.max(0, len - 3)} ${c}`}
              strokeDashoffset={-offset}
              initial={{ opacity: 0 }}
              animate={{ opacity: active && active !== s.id ? 0.3 : 1 }}
              transition={{ delay: i * 0.04 }}
              onMouseEnter={() => onHover?.(s.id)}
              onMouseLeave={() => onHover?.(null)}
              className="cursor-pointer"
            />
          )
          offset += len
          return el
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  )
}

export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = [...items, ...items]
  return (
    <div className={clsx('overflow-hidden border-y-2 border-ink', className)}>
      <div className="flex w-max animate-marquee gap-8 py-2">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap font-display text-sm font-bold uppercase tracking-wide">
            {t}
            <span aria-hidden>✺</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function PageHeader({ eyebrow, title, sub, right, dot }: { eyebrow?: string; title: ReactNode; sub?: ReactNode; right?: ReactNode; dot?: string }) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow className="mb-3" dot={dot}>{eyebrow}</Eyebrow>}
        <h1 className="text-[2.6rem] font-extrabold leading-[0.95] sm:text-6xl">{title}</h1>
        {sub && <p className="mt-4 text-base text-ink-soft sm:text-lg">{sub}</p>}
      </div>
      {right}
    </div>
  )
}

export function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3 1 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3z" />
    </svg>
  )
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )
}

export function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.2 2.25h3.3l-7.2 8.26 8.5 11.24h-6.65l-5.2-6.8-5.96 6.8H1.68l7.73-8.84L1.25 2.25h6.82l4.7 6.2 5.43-6.2zm-1.16 17.52h1.83L7.08 4.13H5.12l11.92 15.64z" />
    </svg>
  )
}
