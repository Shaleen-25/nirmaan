import { useMemo, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import clsx from 'clsx'
import { Globe, MapPin } from 'lucide-react'
import { InfoTip, PageHeader } from '../components/ui'
import { ProjectCard } from '../components/ProjectCard'
import { CATEGORIES, PROJECTS, TIERS, type Category, type Tier } from '../data/projects'
import { useStore } from '../store'
import { CITIES } from '../data/personas'
import { rupees } from '../lib/format'
import { TEN_PERCENT_NOTE } from '../lib/tax'

type TierFilter = 'all' | Tier | 'hometown'

export default function Build() {
  const { cityInfo: city, hometown, budget, allocated, remaining } = useStore()
  const home = hometown ? CITIES[hometown] : null
  const [tier, setTier] = useState<TierFilter>('all')
  const [cat, setCat] = useState<Category | 'all'>('all')
  const [scope, setScope] = useState<'near' | 'india'>('near')

  const list = useMemo(() => {
    return PROJECTS.filter((p) => {
      if (tier === 'hometown') return p.tier === 'local' && p.city === hometown && (cat === 'all' || p.category === cat)
      if (tier !== 'all' && p.tier !== tier) return false
      if (cat !== 'all' && p.category !== cat) return false
      if (scope === 'near' && city) {
        if (p.tier === 'state' && p.stateId !== city.stateId) return false
        if (p.tier === 'local' && p.city !== city.id && p.city !== hometown) return false
      }
      return true
    }).sort((a, b) => ['local', 'national', 'state'].indexOf(a.tier) - ['local', 'national', 'state'].indexOf(b.tier))
  }, [tier, cat, scope, city, hometown])

  if (!city) return null

  return (
    <div>
      <PageHeader
        eyebrow="Step 2 of 3 · Back projects"
        dot="#FF7A1A"
        title={<>What should your <span className="relative inline-block text-pink">{rupees(budget)}</span> build?</>}
        sub={
          <span className="inline-flex flex-wrap items-center gap-1">
            These projects are approved but unfunded. They get built only if taxpayers back them. No quotas, so split it however you like.
            <InfoTip>{TEN_PERCENT_NOTE}</InfoTip>
          </span>
        }
        right={
          <div className="brut-sm rounded-2xl bg-white px-5 py-3 text-right">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted">Allocated · Left</p>
            <p className="font-display text-xl font-extrabold tabular">
              {rupees(allocated)} <span className="text-muted">·</span> <span className="text-pink">{rupees(remaining)}</span>
            </p>
          </div>
        }
      />

      <div className="sticky top-[68px] z-30 -mx-4 mb-6 space-y-3 border-b-2 border-ink bg-paper/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="brut-sm no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-white p-1">
            {(['all', 'local', ...(home ? ['hometown'] : []), 'state', 'national'] as TierFilter[]).map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={clsx('whitespace-nowrap rounded-full px-4 py-2 font-display text-sm font-bold transition', tier === t ? 'bg-ink text-white' : 'text-ink-soft hover:text-ink')}
              >
                {t === 'all' ? 'All' : t === 'local' ? `My City · ${city.name}` : t === 'hometown' ? `Hometown · ${home?.name}` : t === 'state' ? `State · ${city.state}` : TIERS[t].label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setScope((s) => (s === 'near' ? 'india' : 'near'))}
            className="brut-sm inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-display text-sm font-bold"
          >
            {scope === 'near' ? <MapPin className="h-4 w-4 text-pink" /> : <Globe className="h-4 w-4 text-chakra" />}
            {scope === 'near' ? 'Near me' : 'All of India'}
            <span className="text-xs font-normal text-muted">switch</span>
          </button>
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <Chip on={cat === 'all'} onClick={() => setCat('all')}>Everything</Chip>
          {(Object.keys(CATEGORIES) as Category[]).map((c) => (
            <Chip key={c} on={cat === c} onClick={() => setCat(c)} color={CATEGORIES[c].color}>
              {CATEGORIES[c].label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </AnimatePresence>
      </div>
      {list.length === 0 && (
        <p className="py-16 text-center text-ink-soft">
          No projects here yet.{' '}
          <button className="font-semibold text-ink underline" onClick={() => setScope('india')}>Explore all of India</button>
        </p>
      )}
    </div>
  )
}

function Chip({ on, onClick, color, children }: { on: boolean; onClick: () => void; color?: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={clsx('whitespace-nowrap rounded-full border-2 border-ink px-3.5 py-1.5 text-xs font-bold transition', on ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-marigold-soft')}
    >
      {color && <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full border border-ink" style={{ background: color }} />}
      {children}
    </button>
  )
}
