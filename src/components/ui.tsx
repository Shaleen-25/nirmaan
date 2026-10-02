import { useEffect, useRef, useState, type ReactNode } from 'react'
import { animate, motion, useInView } from 'motion/react'
import clsx from 'clsx'
import { Info } from 'lucide-react'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-2 font-display font-extrabold tracking-tight', className)}>
      <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden>
        <rect width="64" height="64" rx="16" fill="#0E1330" />
        <path d="M18 46V18l28 28V18" fill="none" stroke="#FF8A1F" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="46" cy="46" r="4" fill="#19A35B" />
      </svg>
      <span className="text-xl">Nirmaan</span>
    </span>
  )
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx('rounded-3xl border border-line bg-card', className)}>{children}</div>
}

export function Pill({ children, color, soft, className }: { children: ReactNode; color?: string; soft?: string; className?: string }) {
  return (
    <span
      className={clsx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold', className)}
      style={{ color: color ?? '#0E1330', background: soft ?? '#F1EEE8' }}
    >
      {children}
    </span>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={clsx('text-xs font-bold uppercase tracking-[0.14em] text-saffron', className)}>{children}</p>
}

export function Progress({ value, color = '#19A35B', className }: { value: number; color?: string; className?: string }) {
  return (
    <div className={clsx('h-2 w-full overflow-hidden rounded-full bg-line', className)}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        whileInView={{ width: `${Math.min(100, value * 100)}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}

/** Counts up to `value` the first time it scrolls into view */
export function Counter({ value, format, className }: { value: number; format: (n: number) => string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [shown, setShown] = useState(0)
  const prev = useRef(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(prev.current, value, {
      duration: 1.1,
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
    <span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted transition hover:text-ink"
      >
        <Info className="h-4 w-4" />
      </button>
      {open && (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-1/2 top-7 z-50 w-72 -translate-x-1/2 rounded-2xl bg-ink p-4 text-left text-xs font-normal leading-relaxed text-white/90 shadow-xl sm:w-80"
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
  variant?: 'primary' | 'ghost' | 'saffron' | 'outline'
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
        'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40',
        variant === 'primary' && 'bg-ink text-white hover:bg-ink-soft',
        variant === 'saffron' && 'bg-saffron text-white shadow-[0_8px_24px_-8px_rgba(255,138,31,.7)] hover:brightness-105',
        variant === 'ghost' && 'text-ink hover:bg-black/5',
        variant === 'outline' && 'border border-line bg-white text-ink hover:border-ink/30',
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
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  const total = segments.reduce((a, s) => a + s.value, 0)
  let offset = 0
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
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
              strokeWidth={active === s.id ? thickness + 8 : thickness}
              strokeDasharray={`${Math.max(0, len - 2)} ${c}`}
              strokeDashoffset={-offset}
              initial={{ opacity: 0 }}
              animate={{ opacity: active && active !== s.id ? 0.25 : 1 }}
              transition={{ delay: i * 0.05 }}
              onMouseEnter={() => onHover?.(s.id)}
              onMouseLeave={() => onHover?.(null)}
              className="cursor-pointer transition-[stroke-width]"
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

export function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

export function PageHeader({ eyebrow, title, sub, right }: { eyebrow?: string; title: ReactNode; sub?: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow className="mb-2">{eyebrow}</Eyebrow>}
        <h1 className="text-3xl font-bold leading-[1.05] sm:text-5xl">{title}</h1>
        {sub && <p className="mt-3 text-base text-muted sm:text-lg">{sub}</p>}
      </div>
      {right}
    </div>
  )
}
