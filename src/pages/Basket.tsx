import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Divide, Plus, Sparkles, X } from 'lucide-react'
import { Button, Card, Donut, InfoTip, PageHeader, Pill } from '../components/ui'
import { ProjectIcon } from '../components/ProjectIcon'
import { PROJECTS, TIERS, type Tier } from '../data/projects'
import { useStore } from '../store'
import { compact, pct, rupees } from '../lib/format'
import { yourMatch } from '../lib/qf'
import { TEN_PERCENT_NOTE } from '../lib/tax'

const TIER_COLORS: Record<Tier, string> = { national: '#FFC22E', state: '#3D5AFE', local: '#FF4F8B' }

export default function Basket() {
  const { budget, allocations, setAmount, toggle, splitEvenly, allocated, remaining } = useStore()
  const navigate = useNavigate()
  const picks = Object.keys(allocations)
    .map((id) => PROJECTS.find((p) => p.id === id)!)
    .filter(Boolean)
  const matches = yourMatch(allocations)
  const totalMatch = Object.values(matches).reduce((a, b) => a + b, 0)
  const byTier = (['national', 'state', 'local'] as Tier[]).map((t) => ({
    tier: t,
    value: picks.filter((p) => p.tier === t).reduce((a, p) => a + (allocations[p.id] ?? 0), 0),
  }))

  if (!picks.length) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="text-3xl font-bold">Nothing backed yet</h1>
        <p className="mt-3 text-muted">Pick the projects you want your {rupees(budget)} to build.</p>
        <Link to="/build" className="brut-sm press mt-6 inline-flex items-center gap-2 rounded-full bg-marigold px-6 py-3 font-display font-bold">
          Browse projects <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        eyebrow="Step 3 of 3 · Split it"
        dot="#17B26A"
        title={<>Your <span className="text-leaf">Nirmaan</span> portfolio</>}
        sub={
          <span className="inline-flex flex-wrap items-center gap-1">
            Slide to decide how your {rupees(budget)} is split. <InfoTip>{TEN_PERCENT_NOTE}</InfoTip>
          </span>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {picks.map((p) => {
              const amt = allocations[p.id] ?? 0
              return (
                <motion.div key={p.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <Card className="p-5">
                    <div className="flex items-start gap-3">
                      <ProjectIcon project={p} />
                      <div className="min-w-0 flex-1">
                        <Pill soft={TIER_COLORS[p.tier]} color={p.tier === 'national' ? '#16130F' : '#fff'}>{TIERS[p.tier].label}</Pill>
                        <Link to={`/project/${p.id}`} className="mt-1 block truncate font-display text-lg font-extrabold hover:underline">{p.title}</Link>
                        <p className="truncate text-xs text-muted">{p.where}</p>
                      </div>
                      <button onClick={() => toggle(p.id)} aria-label={`Remove ${p.title}`} className="rounded-full p-1.5 text-muted hover:bg-black/5 hover:text-ink">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                      <input
                        type="range"
                        min={0}
                        max={budget}
                        step={100}
                        value={amt}
                        onChange={(e) => setAmount(p.id, Number(e.target.value))}
                        className="flex-1"
                        aria-label={`Amount for ${p.title}`}
                      />
                      <div className="w-28 text-right">
                        <p className="font-display text-xl font-extrabold tabular">{rupees(amt)}</p>
                        <p className="text-[11px] text-muted">{pct(budget ? amt / budget : 0)} of your 10%</p>
                      </div>
                    </div>
                    {matches[p.id] > 0 && (
                      <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-ink bg-leaf-soft px-3 py-1 text-xs font-bold">
                        <Sparkles className="h-3.5 w-3.5" /> Your backing unlocks ~{rupees(matches[p.id])} in matching
                      </p>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
          <div className="flex flex-wrap gap-2">
            <Button variant="white" onClick={splitEvenly}><Divide className="h-4 w-4" /> Split evenly</Button>
            <Button variant="white" onClick={() => navigate('/build')}><Plus className="h-4 w-4" /> Add projects</Button>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="p-6">
            <div className="flex items-center gap-5">
              <Donut
                size={120}
                thickness={16}
                segments={[
                  ...byTier.filter((t) => t.value > 0).map((t) => ({ id: t.tier, value: t.value, color: TIER_COLORS[t.tier] })),
                  ...(remaining > 0 ? [{ id: 'rest', value: remaining, color: '#FFFFFF' }] : []),
                ]}
              >
                <p className="font-display text-xl font-extrabold">{pct(budget ? allocated / budget : 0)}</p>
              </Donut>
              <div className="space-y-1.5 text-sm">
                {byTier.map((t) => (
                  <p key={t.tier} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: TIER_COLORS[t.tier] }} />
                    <span className="text-muted">{TIERS[t.tier].label}</span>
                    <span className="font-semibold tabular">{compact(t.value)}</span>
                  </p>
                ))}
              </div>
            </div>

            <dl className="mt-6 space-y-2 border-t-2 border-dashed border-ink/30 pt-5 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Your 10% share</dt><dd className="font-semibold tabular">{rupees(budget)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Allocated</dt><dd className="font-semibold tabular">{rupees(allocated)}</dd></div>
              <div className="flex justify-between font-bold text-leaf"><dt>Matching you unlock</dt><dd className="font-semibold tabular">+{rupees(totalMatch)}</dd></div>
            </dl>
            {remaining > 0 && (
              <p className="mt-4 rounded-2xl border-2 border-dashed border-ink/30 bg-paper p-3 text-xs text-ink-soft">
                {rupees(remaining)} unallocated will go to the government's default priorities.
              </p>
            )}
            <Button variant="marigold" className="mt-5 w-full py-4 text-base" disabled={allocated === 0} onClick={() => navigate('/confirm')}>
              Confirm & mint e₹ <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="mt-3 text-center text-[11px] text-muted">You can change your picks until 31 March 2027</p>
          </Card>
        </aside>
      </div>
    </div>
  )
}
