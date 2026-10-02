import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import clsx from 'clsx'
import { BadgeCheck, Camera, HardHat, Landmark, Lock, UserRound, type LucideIcon } from 'lucide-react'
import type { Project } from '../data/projects'
import { maskPan } from '../data/personas'
import { compact, txHash } from '../lib/format'

export interface TrailStep {
  key: string
  title: string
  who: string
  detail: string
  hash: string
  icon: LucideIcon
}

/** The six hops a citizen-directed rupee takes, from your PAN to proof on the ground */
export function buildTrail(project: Project, amount: number, pan: string, seed: number): TrailStep[] {
  const tag = `NRM-${project.tier.slice(0, 3).toUpperCase()}-${project.id.toUpperCase().replace(/-/g, '').slice(0, 6)}`
  const h = (k: string) => txHash(`${seed}-${project.id}-${k}`)
  return [
    { key: 'you', title: 'You allocated', who: maskPan(pan), detail: `${compact(amount)} from your 10% share`, hash: h('you'), icon: UserRound },
    { key: 'mint', title: 'e₹ minted', who: 'RBI e-Rupee rail', detail: `Purpose-bound to tag ${tag}`, hash: h('mint'), icon: Landmark },
    { key: 'escrow', title: 'Locked in escrow', who: 'Project escrow wallet', detail: 'Released only on verified milestones', hash: h('escrow'), icon: Lock },
    { key: 'agency', title: 'Tranche released', who: project.agency, detail: `Milestone “${project.milestones[0]}” verified`, hash: h('agency'), icon: BadgeCheck },
    { key: 'vendor', title: 'Vendor paid', who: project.vendor, detail: `Spent on: ${project.spendRules[0].toLowerCase()}`, hash: h('vendor'), icon: HardHat },
    { key: 'proof', title: 'Proof on ground', who: `${Math.round(project.backers * 0.04).toLocaleString('en-IN')} citizens verified`, detail: 'Geotagged photos + agency sign-off', hash: h('proof'), icon: Camera },
  ]
}

export function ERupeeTrail({
  steps,
  reached,
  autoplay = false,
  compactMode = false,
}: {
  steps: TrailStep[]
  reached: number
  autoplay?: boolean
  compactMode?: boolean
}) {
  const [shown, setShown] = useState(autoplay ? 0 : reached)

  useEffect(() => {
    if (!autoplay) {
      setShown(reached)
      return
    }
    setShown(0)
    const id = setInterval(() => setShown((s) => (s >= reached ? s : s + 1)), 750)
    return () => clearInterval(id)
  }, [autoplay, reached])

  return (
    <ol className="relative flex flex-col gap-0 md:flex-row">
      {steps.map((s, i) => {
        const done = i < shown
        const active = i === shown && shown < steps.length
        const last = i === steps.length - 1
        return (
          <li key={s.key} className="relative flex gap-4 pb-6 md:flex-1 md:flex-col md:items-center md:gap-3 md:pb-0 md:text-center">
            {/* connector */}
            {!last && (
              <div className="absolute left-5 top-11 bottom-1 w-0.5 bg-line md:left-[calc(50%+26px)] md:right-[calc(-50%+26px)] md:top-5 md:bottom-auto md:h-0.5 md:w-auto">
                <motion.div
                  className="h-full w-full origin-top bg-leaf md:origin-left"
                  initial={false}
                  animate={{ scaleY: done ? 1 : 0, scaleX: done ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            )}
            {/* node */}
            <motion.span
              animate={active ? { scale: [1, 1.12, 1] } : { scale: 1 }}
              transition={active ? { repeat: Infinity, duration: 1.4 } : {}}
              className={clsx(
                'relative z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-500',
                done ? 'border-leaf bg-leaf text-white' : active ? 'border-saffron bg-saffron-soft text-saffron' : 'border-line bg-white text-muted',
              )}
            >
              <s.icon className="h-[18px] w-[18px]" />
              {active && <span className="absolute inset-0 animate-ping rounded-full border-2 border-saffron/50" />}
            </motion.span>
            {/* copy */}
            <div className={clsx('min-w-0 transition-opacity duration-500 md:px-1', done || active ? 'opacity-100' : 'opacity-45')}>
              <p className="text-sm font-bold text-ink">{s.title}</p>
              <p className="truncate text-xs font-medium text-ink-soft md:whitespace-normal">{s.who}</p>
              {!compactMode && <p className="mt-0.5 text-xs text-muted">{s.detail}</p>}
              {!compactMode && done && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 font-mono text-[10px] text-leaf">
                  {s.hash}
                </motion.p>
              )}
              {!compactMode && active && <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-saffron">In progress</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
