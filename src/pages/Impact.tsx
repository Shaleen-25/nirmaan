import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import clsx from 'clsx'
import { ArrowRight, BadgeCheck, Camera, Clock, FastForward, MapPin, Sparkles, Trophy, Users } from 'lucide-react'
import { Card, Counter, PageHeader, Pill, Progress } from '../components/ui'
import { ProjectIcon } from '../components/ProjectIcon'
import { ERupeeTrail, buildTrail } from '../components/Trail'
import { DELIVERED, PROJECTS, TIERS, type Project } from '../data/projects'
import { CITIES, type CityId } from '../data/personas'
import { useStore } from '../store'
import { compact, count, rupees } from '../lib/format'
import { yourMatch } from '../lib/qf'

const COORDS: Record<CityId, string> = {
  bengaluru: '12.926°N 77.676°E',
  pune: '18.559°N 73.786°E',
  delhi: '28.592°N 77.046°E',
  mumbai: '19.136°N 72.828°E',
}

const TIME_STOPS = [
  { label: 'Today', reached: 3, months: 0 },
  { label: '+1 month', reached: 4, months: 1 },
  { label: '+3 months', reached: 5, months: 3 },
  { label: '+6 months', reached: 6, months: 6 },
]

interface Holding {
  project: Project
  amount: number
  past?: boolean
}

export default function Impact() {
  const { persona, confirmation, pan } = useStore()
  const [time, setTime] = useState(0)
  const past = persona ? DELIVERED[persona.city] : undefined

  const holdings: Holding[] = useMemo(() => {
    const now: Holding[] = Object.entries(confirmation?.allocations ?? {})
      .map(([id, amount]) => ({ project: PROJECTS.find((p) => p.id === id)!, amount }))
      .filter((h) => h.project && h.amount > 0)
      .sort((a, b) => b.amount - a.amount)
    return past ? [...now, { project: past, amount: 12_000, past: true }] : now
  }, [confirmation, past])

  const [selId, setSelId] = useState<string | null>(null)
  if (!persona || !pan) return null
  const sel = holdings.find((h) => h.project.id === selId) ?? holdings[0]
  const current = holdings.filter((h) => !h.past)
  const total = current.reduce((a, h) => a + h.amount, 0)
  const matched = Object.values(yourMatch(confirmation?.allocations ?? {})).reduce((a, b) => a + b, 0)
  const coBackers = current.reduce((a, h) => a + h.project.backers, 0)
  const stop = sel?.past ? TIME_STOPS[3] : TIME_STOPS[time]
  const seed = confirmation?.at ?? 1
  // Milestones complete at the pace of each project's own timeline
  const milestonesDone = !sel
    ? 0
    : sel.past
      ? 4
      : stop.reached < 4
        ? 0
        : Math.max(1, Math.min(4, Math.floor(stop.months / (sel.project.months / 4))))
  const photos = Math.min(4, milestonesDone + (stop.reached >= 5 ? 1 : 0))

  return (
    <div>
      <PageHeader
        eyebrow="My Impact"
        title="Your rupees, hop by hop."
        sub="Every rupee you directed moves as purpose-bound e-Rupee. Here's where it is right now."
        right={
          <div className="no-scrollbar flex items-center gap-1 self-start overflow-x-auto rounded-full bg-white p-1 ring-1 ring-line">
            <FastForward className="ml-2 h-4 w-4 shrink-0 text-saffron" />
            {TIME_STOPS.map((t, i) => (
              <button
                key={t.label}
                onClick={() => setTime(i)}
                className={clsx('whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition', time === i ? 'bg-ink text-white' : 'text-muted hover:text-ink')}
              >
                {t.label}
              </button>
            ))}
          </div>
        }
      />

      {current.length === 0 && (
        <Card className="mb-6 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <p className="text-muted">You haven't directed your 10% for FY 2026-27 yet.</p>
          <Link to="/build" className="inline-flex items-center gap-2 rounded-full bg-saffron px-5 py-3 text-sm font-semibold text-white">
            Choose projects <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      )}

      {current.length > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat icon={Sparkles} label="You directed" value={<Counter value={total} format={rupees} />} />
          <Stat icon={BadgeCheck} label="Matching unlocked" value={<Counter value={matched} format={rupees} />} tone="leaf" />
          <Stat icon={Trophy} label="Projects backed" value={current.length} />
          <Stat icon={Users} label="Fellow backers" value={count(coBackers)} />
        </div>
      )}

      {/* holdings picker */}
      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {holdings.map((h) => (
          <button
            key={h.project.id}
            onClick={() => setSelId(h.project.id)}
            className={clsx(
              'flex shrink-0 items-center gap-2.5 rounded-2xl border p-2 pr-4 text-left transition',
              sel?.project.id === h.project.id ? 'border-ink bg-white shadow-sm' : 'border-line bg-white/60',
            )}
          >
            <ProjectIcon project={h.project} size="sm" />
            <span>
              <span className="block max-w-[180px] truncate text-sm font-semibold">{h.project.title}</span>
              <span className="block text-[11px] text-muted">{h.past ? 'FY 25-26 · Delivered' : `${compact(h.amount)} · ${TIERS[h.project.tier].label}`}</span>
            </span>
          </button>
        ))}
      </div>

      {sel && (
        <AnimatePresence mode="wait">
          <motion.div key={sel.project.id + stop.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap gap-2">
                    {sel.past ? (
                      <Pill soft="#E5F6EC" color="#11804A"><BadgeCheck className="h-3.5 w-3.5" /> Delivered</Pill>
                    ) : stop.reached >= 6 ? (
                      <Pill soft="#E5F6EC" color="#11804A"><BadgeCheck className="h-3.5 w-3.5" /> {milestonesDone} of 4 milestones verified</Pill>
                    ) : (
                      <Pill soft="#FFF1E3" color="#C25E00"><Clock className="h-3.5 w-3.5" /> In progress</Pill>
                    )}
                    <Pill>{sel.project.where}</Pill>
                  </div>
                  <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{sel.project.title}</h2>
                </div>
                <div className="sm:text-right">
                  <p className="font-display text-3xl font-extrabold">{rupees(sel.amount)}</p>
                  <p className="text-xs text-muted">your contribution</p>
                </div>
              </div>

              <div className="mt-8">
                <ERupeeTrail steps={buildTrail(sel.project, sel.amount, pan, seed)} reached={stop.reached} autoplay />
              </div>
            </Card>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
              <Card className="p-6">
                <h3 className="text-lg font-bold">Milestones</h3>
                <ul className="mt-4 space-y-4">
                  {sel.project.milestones.map((m, i) => {
                    const doneCount = milestonesDone
                    const state = i < doneCount ? 'done' : i === doneCount ? 'active' : 'todo'
                    return (
                      <li key={m}>
                        <div className="flex items-center justify-between text-sm">
                          <span className={state === 'todo' ? 'text-muted' : 'font-semibold'}>{m}</span>
                          <span className={clsx('text-xs font-semibold', state === 'done' ? 'text-leaf' : state === 'active' ? 'text-saffron' : 'text-muted')}>
                            {state === 'done' ? 'Verified' : state === 'active' ? 'Underway' : 'Upcoming'}
                          </span>
                        </div>
                        <Progress value={state === 'done' ? 1 : state === 'active' ? 0.45 : 0} color={state === 'done' ? '#19A35B' : '#FF8A1F'} className="mt-2" />
                      </li>
                    )
                  })}
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="flex items-center gap-2 text-lg font-bold"><Camera className="h-5 w-5" /> Proof from the ground</h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => {
                    const caption = i < milestonesDone ? sel.project.milestones[i] : ['Site inspection', 'Material delivery', 'Progress check', 'Citizen audit'][i]
                    return <ProofTile key={i} project={sel.project} index={i} caption={caption} visible={i < photos} coords={COORDS[sel.project.city ?? persona.city]} />
                  })}
                </div>
                <p className="mt-4 text-xs text-muted">
                  Photos are geotagged by the agency and verified by {count(Math.round(sel.project.backers * 0.04))} citizen auditors near{' '}
                  {sel.project.city ? CITIES[sel.project.city].name : 'the site'}.
                </p>
              </Card>
            </div>

            {sel.past && (
              <Card className="mt-4 flex items-center gap-4 bg-leaf-soft p-6">
                <Trophy className="h-8 w-8 shrink-0 text-leaf" />
                <p className="text-sm">
                  <strong>Last year, you and {count(sel.project.backers)} neighbours made this happen:</strong> {sel.project.impact[0].value}{' '}
                  {sel.project.impact[0].label}, delivered in {sel.project.months} months.
                </p>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}

function Stat({ icon: Icon, label, value, tone }: { icon: typeof Sparkles; label: string; value: React.ReactNode; tone?: 'leaf' }) {
  return (
    <Card className="p-5">
      <Icon className={clsx('h-5 w-5', tone === 'leaf' ? 'text-leaf' : 'text-saffron')} />
      <p className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </Card>
  )
}

function ProofTile({ project, index, caption, visible, coords }: { project: Project; index: number; caption: string; visible: boolean; coords: string }) {
  const days = [12, 34, 71, 128][index]
  const date = new Date(Date.now() + days * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  return (
    <div className={clsx('relative aspect-[4/3] overflow-hidden rounded-2xl', visible ? '' : 'bg-paper')}>
      {visible ? (
        <motion.div initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(${120 + index * 40}deg, #2A3052, #5B6178 45%, ${['#C9A227', '#19A35B', '#FF8A1F', '#2B4ACB'][index]})`,
            }}
          />
          <div className="grain absolute inset-0 opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center opacity-25">
            <ProjectIcon project={project} size="lg" />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 p-2.5 text-white">
            <p className="truncate text-[11px] font-semibold">{caption}</p>
            <p className="flex items-center gap-1 font-mono text-[9px] text-white/70">
              <MapPin className="h-2.5 w-2.5" /> {coords} · {date}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-muted">Awaiting milestone</div>
      )}
    </div>
  )
}
