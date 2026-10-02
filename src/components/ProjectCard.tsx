import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import clsx from 'clsx'
import { Check, MapPin, Plus, Sparkles, Users } from 'lucide-react'
import { CATEGORIES, TIERS, type Project } from '../data/projects'
import { ProjectCover } from './ProjectIcon'
import { Pill, Progress } from './ui'
import { count, crore, pct } from '../lib/format'
import { projectMatch } from '../lib/qf'
import { useStore } from '../store'

export function ProjectCard({ project: p }: { project: Project }) {
  const { allocations, toggle } = useStore()
  const backed = p.id in allocations
  const cat = CATEGORIES[p.category]
  const funded = p.raisedCr / p.goalCr
  const match = projectMatch(p) / 1e7

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={clsx('brut press group relative flex flex-col overflow-hidden rounded-[26px] bg-white', backed && '!bg-marigold-soft')}
    >
      {backed && (
        <motion.span
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 8 }}
          className="absolute right-4 top-4 z-10 rounded-full border-2 border-ink bg-marigold px-3 py-1 font-display text-xs font-extrabold shadow-[2px_2px_0_#16130F]"
        >
          You're in!
        </motion.span>
      )}
      <Link to={`/project/${p.id}`} className="block">
        <ProjectCover project={p} className="h-28" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-1.5">
          <Pill soft="#16130F" color="#FFFFFF">{TIERS[p.tier].label}</Pill>
          <Pill soft={cat.soft}>{cat.label}</Pill>
        </div>
        <Link to={`/project/${p.id}`}>
          <h3 className="mt-3 text-xl font-extrabold leading-tight group-hover:underline">{p.title}</h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">{p.tagline}</p>
        <p className="mt-2 flex items-center gap-1 text-xs text-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{p.where}</span>
        </p>

        <div className="mt-auto pt-5">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-display text-lg font-extrabold tabular">{crore(p.raisedCr)}</span>
            <span className="font-mono text-[11px] text-muted">of {crore(p.goalCr)} · {pct(funded)}</span>
          </div>
          <Progress value={funded} color={cat.color} className="mt-2" />
          <div className="mt-3 flex items-center justify-between text-xs font-semibold text-ink-soft">
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {count(p.backers)} backers</span>
            <span className="flex items-center gap-1 text-leaf"><Sparkles className="h-3.5 w-3.5" /> +{crore(match)} match</span>
          </div>
          <button
            onClick={() => toggle(p.id)}
            className={clsx(
              'brut-sm mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full py-2.5 font-display text-sm font-bold transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
              backed ? 'bg-white text-ink' : 'bg-ink text-white',
            )}
          >
            {backed ? <><Check className="h-4 w-4" /> Backing this</> : <><Plus className="h-4 w-4" /> Back this project</>}
          </button>
        </div>
      </div>
    </motion.article>
  )
}
