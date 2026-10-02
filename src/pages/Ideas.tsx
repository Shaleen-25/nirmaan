import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import clsx from 'clsx'
import { ArrowRight, Flame, Heart, MapPin, Plus, Trophy } from 'lucide-react'
import { Card, PageHeader, Pill, Scribble } from '../components/ui'
import { CATEGORIES } from '../data/projects'
import { CITIES } from '../data/personas'
import { IDEAS, STAGES, THRESHOLDS, type Idea } from '../data/ideas'
import { useStore } from '../store'
import { count } from '../lib/format'

type Filter = 'all' | 'city' | 'hot'
const MEDALS = ['#FFC22E', '#D9DDE8', '#F4A26B']

export default function Ideas() {
  const { city, vouched, vouch } = useStore()
  const [filter, setFilter] = useState<Filter>('all')
  const cityName = city ? CITIES[city].name : null

  const list = useMemo(() => {
    const withMine = IDEAS.map((i) => ({ ...i, vouches: i.vouches + (vouched.includes(i.id) ? 1 : 0) }))
    const filtered = withMine.filter((i) => (filter === 'city' ? i.city === city || i.city === 'india' : true))
    return filtered.sort((a, b) => (filter === 'hot' ? b.thisWeek - a.thisWeek : b.vouches - a.vouches))
  }, [filter, city, vouched])

  return (
    <div>
      <PageHeader
        eyebrow="The idea board"
        dot="#9B6BFF"
        title={<>Ideas from people like you, <span className="text-lilac">ranked by vouches.</span></>}
        sub="When the government picks the next round of Nirmaan projects, it starts here: a list ranked by how many real taxpayers backed each idea."
      />

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Link to="/ideas/new" className="group block">
          <Card tone="pink" size="lg" className="relative h-full overflow-hidden p-7 text-white transition group-hover:-translate-y-1">
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border-[2.5px] border-ink bg-marigold" />
            <Plus className="relative h-10 w-10 rounded-full border-2 border-ink bg-white p-1.5 text-ink" />
            <h2 className="relative mt-5 text-4xl font-extrabold leading-[0.95]">Got a better idea? Pitch it.</h2>
            <p className="relative mt-3 max-w-md text-white/90">
              Post it, turn it into a campaign, and share it with everyone who has the same problem. Enough vouches and it lands on the government's desk.
            </p>
            <span className="relative mt-6 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-5 py-2.5 font-display font-extrabold text-ink">
              Add new idea <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Card>
        </Link>

        <Card className="p-6">
          <p className="font-display text-xl font-extrabold">Vouches unlock official attention</p>
          <p className="mt-1 text-sm text-ink-soft">One PAN, one vouch. No bots, no bulk buying.</p>
          <ol className="mt-5 space-y-3">
            {THRESHOLDS.map((t, i) => (
              <li key={t.at} className="flex items-center gap-3">
                <span
                  className="inline-flex h-10 w-[72px] shrink-0 items-center justify-center rounded-xl border-2 border-ink font-display text-sm font-extrabold"
                  style={{ background: ['#FFF1C7', '#FFC22E', '#FF4F8B'][i], color: i === 2 ? '#fff' : '#16130F' }}
                >
                  {count(t.at)}
                </span>
                <span className="text-sm font-semibold">{t.label}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <div className="brut-sm flex gap-1 rounded-full bg-white p-1">
          {(
            [
              ['all', 'All of India'],
              ['city', cityName ? `Near me · ${cityName}` : 'Near me'],
              ['hot', 'Hot this week'],
            ] as [Filter, string][]
          ).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={clsx('whitespace-nowrap rounded-full px-4 py-2 font-display text-sm font-bold transition', filter === k ? 'bg-ink text-white' : 'text-ink-soft hover:text-ink')}
            >
              {l}
            </button>
          ))}
        </div>
        <Scribble arrow="none" className="rotate-[-3deg] text-base">tap ♥ to vouch</Scribble>
      </div>

      <ol className="mt-6 space-y-3">
        <AnimatePresence initial={false}>
          {list.map((idea, i) => (
            <IdeaRow key={idea.id} idea={idea} rank={i + 1} vouched={vouched.includes(idea.id)} onVouch={() => vouch(idea.id)} />
          ))}
        </AnimatePresence>
      </ol>

      <Card tone="ink" className="mt-10 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Trophy className="h-7 w-7 text-marigold" />
          <p className="text-sm text-white/80">
            <strong className="text-white">This list goes straight to the government's planning table.</strong> The top ideas get a feasibility study,
            and the ones that pass are listed on Nirmaan for funding.
          </p>
        </div>
        <Link to="/government" className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-white px-5 py-2.5 font-display text-sm font-bold text-white hover:bg-white hover:text-ink">
          See the govt side <ArrowRight className="h-4 w-4" />
        </Link>
      </Card>
    </div>
  )
}

function IdeaRow({ idea, rank, vouched, onVouch }: { idea: Idea; rank: number; vouched: boolean; onVouch: () => void }) {
  const cat = CATEGORIES[idea.category]
  const stage = STAGES[idea.stage]
  const next = THRESHOLDS.find((t) => t.at > idea.vouches) ?? THRESHOLDS[THRESHOLDS.length - 1]
  const prev = [...THRESHOLDS].reverse().find((t) => t.at <= idea.vouches)
  const progress = Math.min(1, (idea.vouches - (prev?.at ?? 0)) / (next.at - (prev?.at ?? 0)))

  return (
    <motion.li layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
      <div className="brut flex items-stretch gap-3 rounded-[22px] bg-white p-3 sm:gap-4 sm:p-4">
        <div
          className="flex w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-ink font-display text-2xl font-extrabold sm:w-16 sm:text-3xl"
          style={{ background: rank <= 3 ? MEDALS[rank - 1] : cat.soft }}
        >
          {rank}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full border-[1.5px] border-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ background: stage.bg, color: stage.fg }}>
              {stage.label}
            </span>
            <Pill soft={cat.soft}>{cat.label}</Pill>
            {idea.thisWeek > 1000 && (
              <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-pink">
                <Flame className="h-3.5 w-3.5" /> +{count(idea.thisWeek)} this week
              </span>
            )}
          </div>
          <h3 className="mt-1.5 text-lg font-extrabold leading-tight sm:text-xl">{idea.title}</h3>
          <p className="mt-0.5 line-clamp-1 text-sm text-ink-soft">{idea.pitch}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {idea.where}</span>
            <span>by {idea.by}</span>
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <div className="h-2.5 flex-1 overflow-hidden rounded-full border-[1.5px] border-ink bg-paper">
              <div className="h-full rounded-full bg-lilac" style={{ width: `${Math.max(4, progress * 100)}%` }} />
            </div>
            <span className="shrink-0 font-mono text-[10px] text-muted">{idea.vouches >= 25_000 ? 'Budget-ready' : `next: ${count(next.at)}`}</span>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onVouch}
          aria-pressed={vouched}
          className={clsx(
            'brut-sm flex w-16 shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl transition sm:w-20',
            vouched ? 'bg-pink text-white' : 'bg-white hover:bg-pink-soft',
          )}
        >
          <motion.span key={String(vouched)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 12 }}>
            <Heart className={clsx('h-6 w-6', vouched && 'fill-white')} />
          </motion.span>
          <span className="font-display text-sm font-extrabold tabular">{idea.vouches.toLocaleString('en-IN')}</span>
          <span className="text-[9px] font-bold uppercase">{vouched ? 'Vouched' : 'Vouch'}</span>
        </motion.button>
      </div>
    </motion.li>
  )
}

