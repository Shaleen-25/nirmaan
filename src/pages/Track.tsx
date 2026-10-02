import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import clsx from 'clsx'
import { ArrowRight, BadgeCheck, Camera, Clock, FastForward, MapPin, Receipt, Sparkles, Trophy, Users } from 'lucide-react'
import { Card, Counter, PageHeader, Pill, Progress, Sticker } from '../components/ui'
import { ProjectIcon } from '../components/ProjectIcon'
import { MoneyMetro, buildStations, useMetroPlayer } from '../components/MoneyMetro'
import { CATEGORIES, DELIVERED, PROJECTS, TIERS, type Project } from '../data/projects'
import { CITIES, type CityId } from '../data/personas'
import { useStore } from '../store'
import { compact, count, rupees } from '../lib/format'
import { yourMatch } from '../lib/qf'

const COORDS: Record<CityId, string> = {
  bengaluru: '12.926°N 77.676°E',
  hyderabad: '17.440°N 78.348°E',
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

export default function Track() {
  const { city, confirmation, pan, budget } = useStore()
  const [time, setTime] = useState(0)
  const [selId, setSelId] = useState<string | null>(null)
  const cityId: CityId = city ?? 'bengaluru'
  const past = DELIVERED[cityId]
  const sample = !confirmation || Object.keys(confirmation.allocations).length === 0

  const holdings: Holding[] = useMemo(() => {
    const allocs = sample
      ? { [PROJECTS.find((p) => p.city === cityId)!.id]: Math.max(budget, 10_000) }
      : confirmation!.allocations
    const now: Holding[] = Object.entries(allocs)
      .map(([id, amount]) => ({ project: PROJECTS.find((p) => p.id === id)!, amount }))
      .filter((h) => h.project && h.amount > 0)
      .sort((a, b) => b.amount - a.amount)
    return past ? [...now, { project: past, amount: 12_000, past: true }] : now
  }, [confirmation, sample, cityId, budget, past])

  const sel = holdings.find((h) => h.project.id === selId) ?? holdings[0]
  const current = holdings.filter((h) => !h.past)
  const total = current.reduce((a, h) => a + h.amount, 0)
  const matched = sample ? 0 : Object.values(yourMatch(confirmation!.allocations)).reduce((a, b) => a + b, 0)
  const coBackers = current.reduce((a, h) => a + h.project.backers, 0)
  const stop = sel?.past ? TIME_STOPS[3] : TIME_STOPS[time]

  return (
    <div>
      <PageHeader
        eyebrow="Track my ₹"
        dot="#3D5AFE"
        title={<>Watch your e₹ ride the <span className="text-chakra">Money Metro.</span></>}
        sub="Every rupee you direct moves as purpose-bound e-Rupee, stop by stop, until the project is live on the ground."
        right={
          <div className="brut-sm no-scrollbar flex items-center gap-1 self-start overflow-x-auto rounded-full bg-white p-1">
            <FastForward className="ml-2 h-4 w-4 shrink-0 text-pink" />
            {TIME_STOPS.map((t, i) => (
              <button
                key={t.label}
                onClick={() => setTime(i)}
                className={clsx('whitespace-nowrap rounded-full px-3 py-1.5 font-display text-xs font-bold transition', time === i ? 'bg-ink text-white' : 'text-ink-soft hover:text-ink')}
              >
                {t.label}
              </button>
            ))}
          </div>
        }
      />

      {sample ? (
        <Card tone="marigold" className="mb-6 flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
          <p className="font-medium">
            <strong className="font-display">This is a sample journey.</strong> Back a few projects and you'll see your own rupees here.
          </p>
          <Link to="/build" className="brut-sm press inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-display text-sm font-bold text-white">
            Pick projects <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      ) : (
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat icon={Sparkles} label="You directed" value={<Counter value={total} format={rupees} />} tone="bg-marigold" />
          <Stat icon={BadgeCheck} label="Matching unlocked" value={<Counter value={matched} format={rupees} />} tone="bg-leaf-soft" />
          <Stat icon={Trophy} label="Projects backed" value={current.length} tone="bg-pink-soft" />
          <Stat icon={Users} label="Fellow backers" value={count(coBackers)} tone="bg-chakra-soft" />
        </div>
      )}

      <div className="no-scrollbar -mx-4 mb-5 flex gap-2.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {holdings.map((h) => (
          <button
            key={h.project.id}
            onClick={() => setSelId(h.project.id)}
            className={clsx(
              'brut-sm flex shrink-0 items-center gap-2.5 rounded-2xl p-2 pr-4 text-left transition',
              sel?.project.id === h.project.id ? 'bg-marigold' : 'bg-white hover:bg-marigold-soft',
            )}
          >
            <ProjectIcon project={h.project} size="sm" />
            <span>
              <span className="block max-w-[190px] truncate font-display text-sm font-extrabold">{h.project.title}</span>
              <span className="block text-[11px] text-ink-soft">{h.past ? 'FY 25-26 · Delivered ✓' : `${compact(h.amount)} · ${TIERS[h.project.tier].label}`}</span>
            </span>
          </button>
        ))}
      </div>

      {sel && <Journey key={sel.project.id} holding={sel} stop={stop} seed={confirmation?.at ?? 7} pan={pan} cityId={cityId} />}
    </div>
  )
}

function Journey({ holding, stop, seed, pan, cityId }: { holding: Holding; stop: (typeof TIME_STOPS)[number]; seed: number; pan: string | null; cityId: CityId }) {
  const { project, amount, past } = holding
  const stations = buildStations(project, amount, seed, pan)
  const { pos, replay } = useMetroPlayer(stop.reached)
  const cat = CATEGORIES[project.category]
  const live = pos >= stations.length

  // Milestones complete at the pace of each project's own timeline
  const milestonesDone = past ? 4 : stop.reached < 4 ? 0 : Math.max(1, Math.min(4, Math.floor(stop.months / (project.months / 4))))
  const shownDone = pos >= 4 ? milestonesDone : 0
  const photos = Math.min(4, shownDone + (pos >= 5 ? 1 : 0))

  return (
    <div className="space-y-5">
      <Card size="lg" className="overflow-hidden">
        <div className="flex flex-col justify-between gap-3 border-b-2 border-ink p-6 sm:flex-row sm:items-center sm:p-7" style={{ background: cat.soft }}>
          <div className="flex items-center gap-4">
            <ProjectIcon project={project} size="lg" />
            <div>
              <div className="flex flex-wrap gap-1.5">
                {past ? (
                  <Pill soft="#17B26A" color="#fff"><BadgeCheck className="h-3 w-3" /> Delivered</Pill>
                ) : live ? (
                  <Pill soft="#17B26A" color="#fff"><BadgeCheck className="h-3 w-3" /> {milestonesDone} of 4 milestones verified</Pill>
                ) : (
                  <Pill soft="#FFC22E"><Clock className="h-3 w-3" /> In transit</Pill>
                )}
                <Pill>{project.where}</Pill>
              </div>
              <h2 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">{project.title}</h2>
            </div>
          </div>
          <div className="sm:text-right">
            <p className="font-display text-4xl font-extrabold tabular tracking-tight">{rupees(amount)}</p>
            <p className="text-xs font-semibold text-ink-soft">{past ? 'you directed last year' : 'your e₹ on this line'}</p>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <MoneyMetro project={project} stations={stations} pos={pos} onReplay={replay} />
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1.2fr]">
        {/* ledger */}
        <Card className="p-6">
          <h3 className="flex items-center gap-2 text-lg font-extrabold"><Receipt className="h-5 w-5 text-pink" /> Public e₹ ledger</h3>
          <ol className="mt-4 space-y-2 font-mono text-[11px]">
            <AnimatePresence initial={false}>
              {stations.slice(0, Math.min(pos, stations.length)).map((s, i) => (
                <motion.li
                  key={s.key}
                  initial={{ opacity: 0, x: -10, backgroundColor: '#FFC22E' }}
                  animate={{ opacity: 1, x: 0, backgroundColor: '#FFF6EA' }}
                  transition={{ duration: 0.6 }}
                  className="rounded-lg border-[1.5px] border-ink/20 px-2.5 py-2"
                >
                  <div className="flex justify-between gap-2">
                    <span className="font-bold">{i === 0 ? 'ALLOCATE' : i === 1 ? 'MINT' : i === 2 ? 'LOCK' : i === 3 ? 'RELEASE' : i === 4 ? 'PAY' : 'VERIFY'}</span>
                    <span className="font-bold">{rupees(s.amount)}</span>
                  </div>
                  <div className="mt-0.5 flex justify-between gap-2 text-muted">
                    <span className="truncate">→ {s.who}</span>
                    <span>{s.hash}</span>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
            {pos === 0 && <li className="text-muted">Waiting for the first hop…</li>}
          </ol>
        </Card>

        {/* milestones */}
        <Card className="p-6">
          <h3 className="text-lg font-extrabold">Milestones</h3>
          <ul className="mt-4 space-y-4">
            {project.milestones.map((m, i) => {
              const state = i < shownDone ? 'done' : i === shownDone ? 'active' : 'todo'
              return (
                <li key={m}>
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className={state === 'todo' ? 'text-muted' : 'font-bold'}>{m}</span>
                    <span className={clsx('rounded-full border-[1.5px] border-ink px-2 py-0.5 text-[10px] font-bold uppercase', state === 'done' ? 'bg-leaf text-white' : state === 'active' ? 'bg-marigold' : 'bg-white text-muted')}>
                      {state === 'done' ? 'Verified' : state === 'active' ? 'Underway' : 'Next'}
                    </span>
                  </div>
                  <Progress key={state} value={state === 'done' ? 1 : state === 'active' ? 0.45 : 0.02} color={state === 'done' ? '#17B26A' : '#FFC22E'} className="mt-2 h-3" />
                </li>
              )
            })}
          </ul>
        </Card>

        {/* proof */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-extrabold"><Camera className="h-5 w-5" /> Proof from the ground</h3>
            {photos > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-pink px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE
              </span>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => {
              const caption = i < shownDone ? project.milestones[i] : ['Site inspection', 'Material delivery', 'Progress check', 'Citizen audit'][i]
              return <ProofTile key={i} project={project} index={i} caption={caption} visible={i < photos} coords={COORDS[project.city ?? cityId]} />
            })}
          </div>
          <p className="mt-4 text-xs text-ink-soft">
            Geotagged by the agency and checked by {count(Math.round(project.backers * 0.04))} citizen auditors near{' '}
            {project.city ? CITIES[project.city].name : 'the site'}.
          </p>
        </Card>
      </div>

      {past && (
        <Card tone="mint" className="flex items-center gap-4 p-6">
          <Sticker tone="mint" rotate={-6}>Done!</Sticker>
          <p className="text-sm">
            <strong>Last year, you and {count(project.backers)} neighbours made this happen:</strong> {project.impact[0].value} {project.impact[0].label},
            delivered in {project.months} months.
          </p>
        </Card>
      )}
    </div>
  )
}

function Stat({ icon: Icon, label, value, tone }: { icon: typeof Sparkles; label: string; value: React.ReactNode; tone: string }) {
  return (
    <div className={`brut rounded-[22px] p-5 ${tone}`}>
      <Icon className="h-5 w-5" />
      <p className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{value}</p>
      <p className="text-xs font-semibold text-ink-soft">{label}</p>
    </div>
  )
}

function ProofTile({ project, index, caption, visible, coords }: { project: Project; index: number; caption: string; visible: boolean; coords: string }) {
  const days = [12, 34, 71, 128][index]
  const date = new Date(Date.now() + days * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  const cat = CATEGORIES[project.category]
  return (
    <div className={clsx('relative aspect-[4/3] overflow-hidden rounded-2xl border-2 border-ink', visible ? '' : 'border-dashed bg-paper')}>
      {visible ? (
        <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: `linear-gradient(${120 + index * 40}deg, ${cat.color}, #16130F 85%)` }} />
          <div className="bg-dots absolute inset-0 opacity-25" />
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
            <ProjectIcon project={project} size="lg" />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 p-2 text-white">
            <p className="truncate text-[11px] font-bold">{caption}</p>
            <p className="flex items-center gap-1 font-mono text-[8px] text-white/75">
              <MapPin className="h-2.5 w-2.5" /> {coords} · {date}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="flex h-full items-center justify-center text-[11px] font-semibold text-muted">Awaiting milestone</div>
      )}
    </div>
  )
}
