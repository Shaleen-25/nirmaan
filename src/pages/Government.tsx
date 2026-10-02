import { motion } from 'motion/react'
import { Activity, ArrowUpRight, Banknote, CheckCircle2, Landmark, MapPinned, MessageSquareQuote, ShieldCheck, TrendingUp, Users } from 'lucide-react'
import { Card, Counter, Eyebrow, PageHeader, Pill, Progress } from '../components/ui'
import { ProjectIcon } from '../components/ProjectIcon'
import { CATEGORIES, PROJECTS, TIERS, type Category } from '../data/projects'
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
const ASKS = [
  { t: 'Stray dog sterilisation & shelters', n: 48_200 },
  { t: 'Bus every 10 minutes on major routes', n: 41_900 },
  { t: 'Clean, staffed public toilets', n: 37_300 },
  { t: 'Shaded footpaths in IT corridors', n: 29_800 },
  { t: 'Public creche near metro stations', n: 22_100 },
]

export default function Government() {
  const byCat = (Object.keys(CATEGORIES) as Category[])
    .map((c) => ({ c, raised: PROJECTS.filter((p) => p.category === c).reduce((a, p) => a + p.raisedCr, 0) }))
    .sort((a, b) => b.raised - a.raised)
  const maxCat = byCat[0].raised
  const directed = PROJECTS.reduce((a, p) => a + p.raisedCr, 0)
  const top = [...PROJECTS].sort((a, b) => b.backers - a.backers).slice(0, 6)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="For Government"
        title={<>A live demand signal from <span className="text-chakra">3 crore taxpayers.</span></>}
        sub="What citizens want, ward by ward, before a single tender is floated. And a transparent way to earn back their trust."
        right={<Pill soft="#E8ECFB" color="#2B4ACB"><Activity className="h-3.5 w-3.5" /> Simulated pilot data</Pill>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi icon={Users} label="Taxpayers participating" value={<Counter value={PARTICIPANTS} format={(n) => count(n)} />} sub={`${pct(PARTICIPANTS / ELIGIBLE)} of income-tax payers`} />
        <Kpi icon={Banknote} label="Directed so far" value={<Counter value={directed} format={(n) => crore(n)} />} sub={`+ ${crore(MATCHING_POOL_TOTAL_CR)} matching fund`} />
        <Kpi icon={CheckCircle2} label="Projects greenlit by citizens" value={<Counter value={214} format={(n) => Math.round(n).toString()} />} sub="38 delivered with proof" />
        <Kpi icon={TrendingUp} label="Trust in govt spending" value={<Counter value={18} format={(n) => '+' + Math.round(n) + ' pts'} />} sub="among participants vs. baseline" tone="leaf" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card className="p-6">
          <h2 className="text-lg font-bold">What taxpayers are funding</h2>
          <p className="text-sm text-muted">₹ directed by category, all tiers</p>
          <ul className="mt-6 space-y-4">
            {byCat.map(({ c, raised }, i) => (
              <li key={c}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-semibold">{CATEGORIES[c].label}</span>
                  <span className="tabular text-muted">{crore(raised)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-paper">
                  <motion.div
                    className="h-full rounded-full"
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
          <h2 className="flex items-center gap-2 text-lg font-bold"><MapPinned className="h-5 w-5 text-saffron" /> Participation by city</h2>
          <p className="text-sm text-muted">Share of taxpayers who directed their 10%</p>
          <ul className="mt-6 space-y-3">
            {CITY_PARTICIPATION.map((c) => (
              <li key={c.city} className="grid grid-cols-[90px_1fr_44px] items-center gap-3 text-sm">
                <span className="font-medium">{c.city}</span>
                <Progress value={c.rate / 0.6} color="#FF8A1F" />
                <span className="text-right tabular text-muted">{pct(c.rate)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-6">
          <h2 className="text-lg font-bold">Most-backed projects</h2>
          <ul className="mt-4 divide-y divide-line">
            {top.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-3">
                <ProjectIcon project={p} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.title}</p>
                  <p className="text-xs text-muted">{TIERS[p.tier].label} · {p.agency}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{count(p.backers)}</p>
                  <p className="text-[11px] text-muted">{pct(p.raisedCr / p.goalCr)} funded</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold"><MessageSquareQuote className="h-5 w-5 text-chakra" /> What citizens are asking for next</h2>
          <p className="text-sm text-muted">Top citizen proposals, not yet listed</p>
          <ol className="mt-4 space-y-3">
            {ASKS.map((a, i) => (
              <li key={a.t} className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
                <span className="flex-1 text-sm font-medium">{a.t}</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-chakra"><ArrowUpRight className="h-3.5 w-3.5" />{count(a.n)}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <Card className="grid gap-6 bg-chakra p-7 text-white sm:p-10 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Landmark className="h-8 w-8 text-white/80" />
          <Eyebrow className="mt-4 !text-white/70">Why government should pilot this</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold leading-tight">Transparency is the cheapest way to earn trust.</h2>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {[
            ['Goodwill with taxpayers', 'Turn the loudest critics of public spending into stakeholders who can see results.'],
            ['Better planning data', 'Know real demand per ward before committing capex. Fewer white elephants.'],
            ['Less leakage', 'Purpose-bound e₹ can only reach whitelisted vendors after milestones are verified.'],
            ['e-Rupee at scale', 'A real use case that puts the digital rupee into crores of hands, not a pilot wallet.'],
          ].map(([t, d]) => (
            <li key={t} className="rounded-2xl bg-white/10 p-5">
              <p className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4" /> {t}</p>
              <p className="mt-1 text-sm text-white/75">{d}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function Kpi({ icon: Icon, label, value, sub, tone }: { icon: typeof Users; label: string; value: React.ReactNode; sub: string; tone?: 'leaf' }) {
  return (
    <Card className="p-5">
      <Icon className={tone === 'leaf' ? 'h-5 w-5 text-leaf' : 'h-5 w-5 text-chakra'} />
      <p className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">{value}</p>
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-0.5 text-xs text-muted">{sub}</p>
    </Card>
  )
}
