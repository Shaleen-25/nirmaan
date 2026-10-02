import { motion } from 'motion/react'
import { Activity, Banknote, CheckCircle2, Download, Flame, Landmark, Lightbulb, MapPinned, ShieldCheck, TrendingUp, Users } from 'lucide-react'
import { Card, Counter, Eyebrow, PageHeader, Pill, Progress } from '../components/ui'
import { ProjectIcon } from '../components/ProjectIcon'
import { CATEGORIES, PROJECTS, TIERS, type Category } from '../data/projects'
import { IDEAS, PIPELINE, STAGES } from '../data/ideas'
import { count, crore, pct } from '../lib/format'
import { MATCHING_POOL_TOTAL_CR } from '../lib/qf'

/** Simulated pilot metrics: illustrative only */
const PARTICIPANTS = 1_18_40_000
const ELIGIBLE = 3_10_00_000
const CITY_PARTICIPATION = [
  { city: 'Bengaluru', rate: 0.52 },
  { city: 'Pune', rate: 0.47 },
  { city: 'Hyderabad', rate: 0.44 },
  { city: 'Gurugram', rate: 0.41 },
  { city: 'Mumbai', rate: 0.39 },
  { city: 'Chennai', rate: 0.36 },
  { city: 'New Delhi', rate: 0.34 },
  { city: 'Kolkata', rate: 0.27 },
]
const FUNNEL_COLORS = ['#9B6BFF', '#FF4F8B', '#FFC22E', '#17B26A']

export default function Government() {
  const byCat = (Object.keys(CATEGORIES) as Category[])
    .map((c) => ({ c, raised: PROJECTS.filter((p) => p.category === c).reduce((a, p) => a + p.raisedCr, 0) }))
    .sort((a, b) => b.raised - a.raised)
  const maxCat = byCat[0].raised
  const directed = PROJECTS.reduce((a, p) => a + p.raisedCr, 0)
  const top = [...PROJECTS].sort((a, b) => b.backers - a.backers).slice(0, 6)
  const ideas = [...IDEAS].sort((a, b) => b.vouches - a.vouches).slice(0, 8)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="For Government"
        dot="#3D5AFE"
        title={<>A live demand signal from <span className="text-chakra">3 crore taxpayers.</span></>}
        sub="What citizens want, ward by ward, before a single tender is floated. And a transparent way to earn back their trust."
        right={<Pill soft="#FFC22E"><Activity className="h-3 w-3" /> Simulated pilot data</Pill>}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi icon={Users} label="Taxpayers participating" value={<Counter value={PARTICIPANTS} format={(n) => count(n)} />} sub={`${pct(PARTICIPANTS / ELIGIBLE)} of income-tax payers`} tone="bg-marigold" />
        <Kpi icon={Banknote} label="Directed so far" value={<Counter value={directed} format={(n) => crore(n)} />} sub={`+ ${crore(MATCHING_POOL_TOTAL_CR)} matching fund`} tone="bg-white" />
        <Kpi icon={CheckCircle2} label="Projects greenlit by citizens" value={<Counter value={214} format={(n) => Math.round(n).toString()} />} sub="38 delivered with proof" tone="bg-leaf-soft" />
        <Kpi icon={TrendingUp} label="Trust in govt spending" value={<Counter value={18} format={(n) => '+' + Math.round(n) + ' pts'} />} sub="participants vs. baseline" tone="bg-pink-soft" />
      </div>

      {/* IDEA INVENTORY */}
      <Card size="lg" className="overflow-hidden">
        <div className="flex flex-col justify-between gap-4 border-b-2 border-ink bg-lilac p-6 text-white sm:flex-row sm:items-end sm:p-8">
          <div>
            <Eyebrow className="!text-white" dot="#FFC22E">Idea inventory · Budget 2027-28</Eyebrow>
            <h2 className="mt-3 text-4xl font-extrabold leading-[0.95] sm:text-5xl">Start the next Budget from what people already asked for.</h2>
          </div>
          <button className="brut-sm press inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-4 py-2.5 font-display text-sm font-bold text-ink">
            <Download className="h-4 w-4" /> Export ranked list
          </button>
        </div>
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="font-display text-lg font-extrabold">From 1,284 ideas to 11 funded projects</p>
            <div className="mt-5 space-y-3">
              {PIPELINE.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${100 - i * 17}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="brut-sm flex items-center justify-between overflow-hidden whitespace-nowrap rounded-2xl px-4 py-3"
                  style={{ background: FUNNEL_COLORS[i], color: i === 2 ? '#16130F' : '#fff' }}
                >
                  <span className="text-sm font-bold">{s.label}</span>
                  <span className="font-display text-xl font-extrabold">{s.value.toLocaleString('en-IN')}</span>
                </motion.div>
              ))}
            </div>
            <p className="mt-5 flex items-start gap-2 text-sm text-ink-soft">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-lilac" />
              Every vouch is a verified taxpayer (one PAN, one vouch), so the ranking reflects real demand, not bots.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="text-left font-mono text-[10px] uppercase tracking-wider text-muted">
                  <th className="pb-2 pr-2">#</th>
                  <th className="pb-2 pr-2">Citizen idea</th>
                  <th className="pb-2 pr-2 text-right">Vouches</th>
                  <th className="pb-2 pr-2 text-right">7-day</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink/10">
                {ideas.map((idea, i) => (
                  <tr key={idea.id} className={idea.id === 'gachibowli-joggers' ? 'bg-marigold-soft' : ''}>
                    <td className="py-2.5 pr-2 font-display text-lg font-extrabold">{i + 1}</td>
                    <td className="py-2.5 pr-2">
                      <p className="font-bold leading-tight">{idea.title}</p>
                      <p className="text-xs text-muted">{idea.where}</p>
                    </td>
                    <td className="py-2.5 pr-2 text-right font-mono font-bold">{idea.vouches.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 pr-2 text-right">
                      <span className="inline-flex items-center gap-0.5 font-mono text-xs font-bold text-pink">
                        <Flame className="h-3 w-3" />+{count(idea.thisWeek)}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="inline-block whitespace-nowrap rounded-full border-[1.5px] border-ink px-2 py-0.5 text-[10px] font-bold uppercase" style={{ background: STAGES[idea.stage].bg, color: STAGES[idea.stage].fg }}>
                        {STAGES[idea.stage].label.replace(' · Budget 27-28', '')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <Card className="p-6">
          <h2 className="text-xl font-extrabold">What taxpayers are funding</h2>
          <p className="text-sm text-ink-soft">₹ directed by category, all tiers</p>
          <ul className="mt-6 space-y-4">
            {byCat.map(({ c, raised }, i) => (
              <li key={c}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-bold">{CATEGORIES[c].label}</span>
                  <span className="font-mono text-xs tabular text-ink-soft">{crore(raised)}</span>
                </div>
                <div className="h-4 overflow-hidden rounded-full border-2 border-ink bg-white">
                  <motion.div
                    className="h-full rounded-full border-r-2 border-ink"
                    style={{ background: CATEGORIES[c].color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(raised / maxCat) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.06 }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-xl font-extrabold"><MapPinned className="h-5 w-5 text-pink" /> Participation by city</h2>
          <p className="text-sm text-ink-soft">Share of taxpayers who directed their 10%</p>
          <ul className="mt-6 space-y-3">
            {CITY_PARTICIPATION.map((c) => (
              <li key={c.city} className="grid grid-cols-[90px_1fr_44px] items-center gap-3 text-sm">
                <span className="font-semibold">{c.city}</span>
                <Progress value={c.rate / 0.6} color="#FF4F8B" />
                <span className="text-right font-mono text-xs tabular">{pct(c.rate)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-extrabold">Most-backed listed projects</h2>
        <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
          {top.map((p) => (
            <li key={p.id} className="flex items-center gap-3 border-b-2 border-ink/10 py-3">
              <ProjectIcon project={p} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{p.title}</p>
                <p className="truncate text-xs text-muted">{TIERS[p.tier].label} · {p.agency}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-sm font-extrabold">{count(p.backers)}</p>
                <p className="text-[11px] text-muted">{pct(p.raisedCr / p.goalCr)} funded</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card size="lg" tone="blue" className="grid gap-6 p-7 sm:p-10 lg:grid-cols-3">
        <div>
          <Landmark className="h-9 w-9" />
          <Eyebrow className="mt-4 !text-white" dot="#FFC22E">Why pilot this</Eyebrow>
          <h2 className="mt-3 text-4xl font-extrabold leading-[0.95]">Transparency is the cheapest way to earn trust.</h2>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {[
            ['Goodwill with taxpayers', 'Turn the loudest critics of public spending into stakeholders who can see results.'],
            ['Better planning data', 'Ranked citizen ideas and real demand per ward before capex is committed.'],
            ['Less leakage', 'Purpose-bound e₹ only reaches whitelisted vendors after milestones are verified.'],
            ['e-Rupee at scale', 'A real use case that puts the digital rupee into crores of hands.'],
          ].map(([t, d]) => (
            <li key={t} className="rounded-2xl border-2 border-ink bg-white p-5 text-ink">
              <p className="flex items-center gap-2 font-display font-extrabold"><ShieldCheck className="h-4 w-4 text-chakra" /> {t}</p>
              <p className="mt-1 text-sm text-ink-soft">{d}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function Kpi({ icon: Icon, label, value, sub, tone }: { icon: typeof Users; label: string; value: React.ReactNode; sub: string; tone: string }) {
  return (
    <div className={`brut rounded-[22px] p-5 ${tone}`}>
      <Icon className="h-5 w-5" />
      <p className="mt-3 font-display text-3xl font-extrabold tracking-tight">{value}</p>
      <p className="text-sm font-bold">{label}</p>
      <p className="mt-0.5 text-xs text-ink-soft">{sub}</p>
    </div>
  )
}
