import { useMemo, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import clsx from 'clsx'
import { Globe, MapPin } from 'lucide-react'
import { InfoTip, PageHeader } from '../components/ui'
import { ProjectCard } from '../components/ProjectCard'
import { CATEGORIES, PROJECTS, TIERS, type Category, type Tier } from '../data/projects'
import { CITIES } from '../data/personas'
import { useStore } from '../store'
import { rupees } from '../lib/format'
import { TEN_PERCENT_NOTE } from '../lib/tax'

type TierFilter = 'all' | Tier

export default function Build() {
  const { persona, tax, allocated, remaining } = useStore()
  const [tier, setTier] = useState<TierFilter>('all')
  const [cat, setCat] = useState<Category | 'all'>('all')
  const [scope, setScope] = useState<'near' | 'india'>('near')
  const city = persona ? CITIES[persona.city] : null

  const list = useMemo(() => {
    return PROJECTS.filter((p) => {
      if (tier !== 'all' && p.tier !== tier) return false
      if (cat !== 'all' && p.category !== cat) return false
      if (scope === 'near' && city) {
        if (p.tier === 'state' && p.stateId !== city.stateId) return false
        if (p.tier === 'local' && p.city !== city.id) return false
      }
      return true
    }).sort((a, b) => ['local', 'national', 'state'].indexOf(a.tier) - ['local', 'national', 'state'].indexOf(b.tier))
  }, [tier, cat, scope, city])

  if (!tax || !city) return null

  return (
    <div>
      <PageHeader
        eyebrow="The 10% · You decide"
        title={<>Build with <span className="text-saffron">{rupees(tax.nirmaan)}</span></>}
        sub={
          <span className="inline-flex flex-wrap items-center gap-1">
            These projects are approved but unfunded. They get built only if taxpayers back them. No quotas, so split it however you like.
            <InfoTip>{TEN_PERCENT_NOTE}</InfoTip>
          </span>
        }
        right={
          <div className="rounded-2xl border border-line bg-white px-5 py-3 text-right">
            <p className="text-xs text-muted">Allocated · Remaining</p>
            <p className="font-display text-xl font-bold tabular">
              {rupees(allocated)} <span className="text-muted">·</span> <span className="text-saffron">{rupees(remaining)}</span>
            </p>
          </div>
        }
      />

      <div className="sticky top-16 z-30 -mx-4 mb-6 space-y-3 border-b border-line/60 bg-paper/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-white p-1 ring-1 ring-line">
            {(['all', 'local', 'state', 'national'] as TierFilter[]).map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={clsx('whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition', tier === t ? 'bg-ink text-white' : 'text-muted hover:text-ink')}
              >
                {t === 'all' ? 'All' : t === 'local' ? `My City · ${city.name}` : t === 'state' ? `State · ${city.state}` : TIERS[t].label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setScope((s) => (s === 'near' ? 'india' : 'near'))}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold ring-1 ring-line"
          >
            {scope === 'near' ? <MapPin className="h-4 w-4 text-saffron" /> : <Globe className="h-4 w-4 text-chakra" />}
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </AnimatePresence>
      </div>
      {list.length === 0 && (
        <p className="py-16 text-center text-muted">
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
      className={clsx('whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition', on ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink-soft')}
    >
      {color && <span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ background: on ? '#fff' : color }} />}
      {children}
    </button>
  )
}
