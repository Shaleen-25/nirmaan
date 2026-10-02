import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import clsx from 'clsx'
import { BadgeCheck, Camera, HardHat, Landmark, Lock, RotateCcw, Wallet, type LucideIcon } from 'lucide-react'
import { CATEGORIES, type Project } from '../data/projects'
import { maskPan } from '../data/personas'
import { rupees, txHash } from '../lib/format'

export interface Station {
  key: string
  name: string
  who: string
  detail: string
  amount: number
  hash: string
  icon: LucideIcon
}

/** The six stops a citizen-directed rupee makes, from your wallet to the project going live */
export function buildStations(project: Project, amount: number, seed: number, pan?: string | null): Station[] {
  const tag = `NRM-${project.tier.slice(0, 3).toUpperCase()}-${project.id.toUpperCase().replace(/-/g, '').slice(0, 6)}`
  const h = (k: string) => txHash(`${seed}-${project.id}-${k}`, 8)
  const tranche = Math.round(amount / 4)
  const backersVerified = Math.round(project.backers * 0.04).toLocaleString('en-IN')
  return [
    { key: 'you', name: 'Your wallet', who: pan ? maskPan(pan) : 'You · PAN linked', detail: 'Earmarked from your 10%', amount, hash: h('you'), icon: Wallet },
    { key: 'mint', name: 'e₹ Mint', who: 'RBI e-Rupee rail', detail: `Purpose-bound · ${tag}`, amount, hash: h('mint'), icon: Landmark },
    { key: 'escrow', name: 'Escrow', who: 'Project escrow wallet', detail: 'Locked till milestones verify', amount, hash: h('escrow'), icon: Lock },
    { key: 'agency', name: 'Agency', who: project.agency, detail: `Milestone 1: ${project.milestones[0]}`, amount: tranche, hash: h('agency'), icon: BadgeCheck },
    { key: 'vendor', name: 'Vendor', who: project.vendor, detail: `Paid for ${project.spendRules[0].toLowerCase()}`, amount: tranche, hash: h('vendor'), icon: HardHat },
    { key: 'live', name: 'Live!', who: `${backersVerified} citizens verified`, detail: 'Geotagged proof on the ground', amount: tranche, hash: h('live'), icon: Camera },
  ]
}

/**
 * Steps the coin from station to station until it reaches `reached`.
 * Starts once `active`; moving `reached` forward continues from where the coin is.
 */
export function useMetroPlayer(reached: number, { autoplay = true, active = true, stepMs = 1150 } = {}) {
  const [pos, setPos] = useState(autoplay ? 0 : reached)
  useEffect(() => {
    if (!autoplay) {
      setPos(reached)
      return
    }
    if (!active) return
    const id = setInterval(() => setPos((p) => (p < reached ? p + 1 : Math.min(p, reached))), stepMs)
    return () => clearInterval(id)
  }, [autoplay, active, reached, stepMs])
  const replay = useCallback(() => setPos(0), [])
  return { pos, replay }
}

const TILTS = [-2.5, 1.5, -1, 2, -1.5, 1]
const ROW = 116

export function MoneyMetro({
  project,
  stations,
  pos,
  onReplay,
  showTickets = true,
}: {
  project: Project
  stations: Station[]
  /** Number of stations the coin has passed (0 = waiting at the first) */
  pos: number
  onReplay?: () => void
  showTickets?: boolean
}) {
  const color = CATEGORIES[project.category].color
  const n = stations.length
  const at = Math.min(pos, n - 1)
  const live = pos >= n
  const pct = (i: number) => (i / (n - 1)) * 100

  return (
    <div className="relative">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-md border-2 border-ink px-2 py-0.5 font-mono text-[11px] font-bold text-white" style={{ background: color }}>
            {stations[1].detail.split('· ')[1]}
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={live ? 'live' : at}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="font-mono text-xs text-ink-soft"
            >
              {live ? 'Arrived · project is live' : pos === 0 ? 'Boarding at Your wallet…' : `Now arriving: ${stations[at].name}`}
            </motion.span>
          </AnimatePresence>
        </div>
        {onReplay && (
          <button onClick={onReplay} className="brut-sm press inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold">
            <RotateCcw className="h-3.5 w-3.5" /> Replay journey
          </button>
        )}
      </div>

      {/* ── Desktop: horizontal metro line ── */}
      <div className="relative hidden px-[9%] md:block">
        <div className="relative h-14">
          {/* track */}
          <div className="absolute inset-x-0 top-1/2 h-4 -translate-y-1/2 rounded-full border-2 border-ink bg-white" />
          <motion.div
            className="absolute left-0 top-1/2 h-4 -translate-y-1/2 rounded-full border-2 border-ink"
            style={{ background: color }}
            initial={false}
            animate={{ width: `${pct(at)}%` }}
            transition={{ type: 'spring', stiffness: 60, damping: 16 }}
          />
          {/* stations */}
          {stations.map((s, i) => (
            <StationDot key={s.key} style={{ left: `${pct(i)}%` }} state={i < pos ? 'done' : i === at && !live ? 'here' : live ? 'done' : 'todo'} color={color} icon={s.icon} last={i === n - 1} live={live} />
          ))}
          {/* coin */}
          <motion.div
            className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-[130%]"
            initial={false}
            animate={{ left: `${pct(at)}%` }}
            transition={{ type: 'spring', stiffness: 70, damping: 14 }}
          >
            <Coin spinKey={at} />
          </motion.div>
        </div>

        <div className="relative mt-3 grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`, marginInline: `calc(-50% / ${n - 1})` }}>
          {stations.map((s, i) => (
            <StationLabel key={s.key} s={s} reached={i < pos || live || i === at} ticket={showTickets && (i < pos || live)} tilt={TILTS[i]} color={color} />
          ))}
        </div>
      </div>

      {/* ── Mobile: vertical metro line ── */}
      <div className="relative md:hidden">
        <div className="absolute left-[22px] top-[22px] w-4 rounded-full border-2 border-ink bg-white" style={{ height: (n - 1) * ROW }} />
        <motion.div
          className="absolute left-[22px] top-[22px] w-4 rounded-full border-2 border-ink"
          style={{ background: color }}
          initial={false}
          animate={{ height: Math.max(16, at * ROW) }}
          transition={{ type: 'spring', stiffness: 60, damping: 16 }}
        />
        <motion.div className="absolute left-[30px] z-20 -translate-x-1/2" initial={false} animate={{ top: at * ROW + 2 }} transition={{ type: 'spring', stiffness: 70, damping: 14 }}>
          <Coin spinKey={at} small />
        </motion.div>
        <ol>
          {stations.map((s, i) => {
            const reached = i < pos || live || i === at
            return (
              <li key={s.key} className="relative flex gap-4 pl-16" style={{ height: ROW }}>
                <StationDot
                  style={{ left: 30, top: 22 }}
                  state={i < pos || live ? 'done' : i === at ? 'here' : 'todo'}
                  color={color}
                  icon={s.icon}
                  last={i === n - 1}
                  live={live}
                />
                <StationLabel s={s} reached={reached} ticket={showTickets && (i < pos || live)} tilt={TILTS[i] / 2} color={color} align="left" />
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

function StationDot({
  style, state, color, icon: Icon, last, live,
}: { style: React.CSSProperties; state: 'done' | 'here' | 'todo'; color: string; icon: LucideIcon; last: boolean; live: boolean }) {
  return (
    <div className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2" style={style}>
      <motion.div
        animate={{ scale: state === 'here' ? 1.15 : 1 }}
        className={clsx('relative flex h-11 w-11 items-center justify-center rounded-full border-[2.5px] border-ink', state === 'todo' ? 'bg-white text-muted' : 'text-ink')}
        style={{ background: state === 'done' ? '#FFC22E' : state === 'here' ? '#FFFFFF' : undefined }}
      >
        <Icon className="h-5 w-5" />
        {state === 'here' && <span className="absolute inset-[-6px] animate-ping rounded-full border-2" style={{ borderColor: color }} />}
        {last && live && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -bottom-3 left-7 inline-flex items-center gap-1 rounded-full border-2 border-ink bg-pink px-2 py-0.5 font-mono text-[10px] font-bold text-white">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE
          </motion.span>
        )}
      </motion.div>
    </div>
  )
}

function StationLabel({
  s, reached, ticket, tilt, color, align = 'center',
}: { s: Station; reached: boolean; ticket: boolean; tilt: number; color: string; align?: 'center' | 'left' }) {
  return (
    <div className={clsx('min-w-0 px-1 transition-opacity duration-500', align === 'center' ? 'text-center' : 'text-left', reached ? 'opacity-100' : 'opacity-40')}>
      <p className="font-display text-base font-extrabold leading-tight">{s.name}</p>
      <p className="truncate text-xs font-semibold text-ink-soft">{s.who}</p>
      <AnimatePresence>
        {ticket && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.9, rotate: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: tilt }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className={clsx('brut-sm mt-2 inline-block max-w-full rounded-lg bg-white px-2.5 py-1.5 text-left', align === 'center' && 'mx-auto')}
          >
            <p className="font-mono text-[11px] font-bold" style={{ color }}>{rupees(s.amount)}</p>
            <p className="line-clamp-2 text-[10px] leading-snug text-ink-soft">{s.detail}</p>
            <p className="mt-0.5 font-mono text-[9px] text-muted">{s.hash}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Coin({ spinKey, small }: { spinKey: number; small?: boolean }) {
  return (
    <div className="relative">
      <motion.div
        key={spinKey}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 360 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={clsx(
          'flex items-center justify-center rounded-full border-[2.5px] border-ink bg-marigold font-display font-extrabold text-ink shadow-[3px_3px_0_#16130F]',
          small ? 'h-10 w-10 text-sm' : 'h-12 w-12 text-base',
        )}
      >
        e₹
      </motion.div>
      {/* sparkle burst on arrival */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2
        return (
          <motion.span
            key={`${spinKey}-${i}`}
            className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full border border-ink"
            style={{ background: ['#FF4F8B', '#3D5AFE', '#17B26A'][i % 3] }}
            initial={{ x: -4, y: -4, opacity: 0, scale: 0.5 }}
            animate={{ x: Math.cos(a) * 34 - 4, y: Math.sin(a) * 34 - 4, opacity: [0, 1, 0], scale: [0.5, 1, 0.4] }}
            transition={{ duration: 0.8, delay: 0.55 }}
          />
        )
      })}
    </div>
  )
}
