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
      className={clsx(
        'group flex flex-col overflow-hidden rounded-3xl border bg-card transition',
        backed ? 'border-saffron ring-2 ring-saffron/30' : 'border-line hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-20px_rgba(14,19,48,.3)]',
      )}
    >
      <Link to={`/project/${p.id}`} className="block">
        <ProjectCover project={p} className="h-28" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-1.5">
          <Pill className="!bg-ink !text-white">{TIERS[p.tier].label}</Pill>
          <Pill color={cat.color} soft={cat.soft}>{cat.label}</Pill>
        </div>
        <Link to={`/project/${p.id}`}>
          <h3 className="mt-3 text-lg font-bold leading-snug group-hover:underline">{p.title}</h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{p.tagline}</p>
        <p className="mt-2 flex items-center gap-1 text-xs text-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{p.where}</span>
        </p>

        <div className="mt-auto pt-5">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-bold tabular">{crore(p.raisedCr)}</span>
            <span className="text-xs text-muted">of {crore(p.goalCr)} · {pct(funded)}</span>
          </div>
          <Progress value={funded} color={funded >= 1 ? '#19A35B' : cat.color} className="mt-2" />
          <div className="mt-3 flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {count(p.backers)} backers</span>
            <span className="flex items-center gap-1 font-medium text-leaf"><Sparkles className="h-3.5 w-3.5" /> +{crore(match)} match</span>
          </div>
          <button
            onClick={() => toggle(p.id)}
            className={clsx(
              'mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition active:scale-[0.98]',
              backed ? 'bg-saffron text-white' : 'bg-ink text-white hover:bg-ink-soft',
            )}
          >
            {backed ? <><Check className="h-4 w-4" /> Backing this</> : <><Plus className="h-4 w-4" /> Back this project</>}
          </button>
        </div>
      </div>
    </motion.article>
  )
}
