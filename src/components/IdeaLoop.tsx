import { motion } from 'motion/react'
import { Landmark, Lightbulb, ListOrdered, Rocket, Users, type LucideIcon } from 'lucide-react'

const NODES: { icon: LucideIcon; t: string; d: string; bg: string; fg: string }[] = [
  { icon: Lightbulb, t: 'Pitch', d: 'Post an idea', bg: '#9B6BFF', fg: '#fff' },
  { icon: Users, t: 'Rally', d: 'Friends vouch', bg: '#FF4F8B', fg: '#fff' },
  { icon: ListOrdered, t: 'Rank', d: 'Leaderboard', bg: '#FFC22E', fg: '#16130F' },
  { icon: Landmark, t: 'Shortlist', d: 'Govt reviews', bg: '#3D5AFE', fg: '#fff' },
  { icon: Rocket, t: 'Go live', d: 'Funded on Nirmaan', bg: '#17B26A', fg: '#fff' },
]

/** Circular diagram of the citizen-idea feedback loop */
export function IdeaLoop() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]">
      {/* ring */}
      <motion.svg viewBox="0 0 100 100" className="absolute inset-[11%]" animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}>
        <circle cx="50" cy="50" r="48" fill="none" stroke="#16130F" strokeWidth="0.8" strokeDasharray="2.5 2.5" />
      </motion.svg>
      {/* travelling e₹ dot */}
      <motion.div className="absolute inset-[11%]" animate={{ rotate: 360 }} transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}>
        <span className="absolute left-1/2 top-0 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-marigold" />
      </motion.div>
      {/* centre */}
      <div className="absolute inset-[30%] flex flex-col items-center justify-center rounded-full border-[2.5px] border-ink bg-white text-center shadow-[4px_4px_0_#16130F]">
        <p className="font-display text-3xl font-extrabold leading-none sm:text-4xl">1,284</p>
        <p className="mt-1 px-3 text-[11px] font-semibold leading-tight text-ink-soft">citizen ideas waiting for the next Budget</p>
      </div>
      {/* nodes */}
      {NODES.map((n, i) => {
        const a = (i / NODES.length) * Math.PI * 2 - Math.PI / 2
        const x = 50 + Math.cos(a) * 39
        const y = 50 + Math.sin(a) * 39
        return (
          <motion.div
            key={n.t}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 * i, type: 'spring', stiffness: 220, damping: 14 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="brut-sm flex items-center gap-2 rounded-2xl px-3 py-2" style={{ background: n.bg, color: n.fg, rotate: `${i % 2 ? 4 : -4}deg` }}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-white text-ink">
                <n.icon className="h-4 w-4" />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-sm font-extrabold">{i + 1}. {n.t}</span>
                <span className="block whitespace-nowrap text-[10px] font-semibold opacity-85">{n.d}</span>
              </span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
