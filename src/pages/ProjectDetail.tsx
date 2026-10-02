import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Building, CalendarClock, Check, HardHat, Lock, Plus, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { Card, Pill, Progress } from '../components/ui'
import { ProjectCover } from '../components/ProjectIcon'
import { CATEGORIES, TIERS, projectById } from '../data/projects'
import { useStore } from '../store'
import { count, crore, pct } from '../lib/format'
import { projectMatch } from '../lib/qf'

export default function ProjectDetail() {
  const { id } = useParams()
  const { allocations, toggle, ready } = useStore()
  const navigate = useNavigate()
  const p = id ? projectById(id) : undefined
  if (!p) return <p className="py-20 text-center text-muted">Project not found.</p>

  const cat = CATEGORIES[p.category]
  const funded = p.raisedCr / p.goalCr
  const backed = p.id in allocations

  return (
    <div>
      <Link to="/build" className="mb-6 inline-flex items-center gap-1.5 font-display text-sm font-bold text-ink-soft hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>

      <Card size="lg" className="overflow-hidden">
        <ProjectCover project={p} className="h-40 sm:h-52" />
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex flex-wrap gap-1.5">
              <Pill soft="#16130F" color="#FFFFFF">{TIERS[p.tier].label}</Pill>
              <Pill soft={cat.soft}>{cat.label}</Pill>
              <Pill>{p.where}</Pill>
            </div>
            <h1 className="mt-4 text-4xl font-extrabold leading-[0.95] sm:text-6xl">{p.title}</h1>
            <p className="mt-3 text-lg text-ink-soft">{p.tagline}</p>
            <p className="mt-4 text-muted">{p.description}</p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {p.impact.map((i) => (
                <div key={i.label} className="brut-sm rounded-2xl p-4" style={{ background: cat.soft }}>
                  <p className="font-display text-2xl font-extrabold">{i.value}</p>
                  <p className="mt-1 text-xs text-muted">{i.label}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-10 text-xl font-bold">Milestones: money is released only as these are verified</h2>
            <ol className="mt-4 grid gap-2 sm:grid-cols-2">
              {p.milestones.map((m, i) => (
                <li key={m} className="brut-sm flex items-center gap-3 rounded-2xl bg-white p-3">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-marigold font-mono text-xs font-bold">{i + 1}</span>
                  <span className="text-sm font-medium">{m}</span>
                  <span className="ml-auto text-xs text-muted">{25}%</span>
                </li>
              ))}
            </ol>

            <h2 className="mt-10 flex items-center gap-2 text-xl font-bold">
              <Lock className="h-5 w-5 text-leaf" /> Programmable e₹ spend rules
            </h2>
            <p className="mt-1 text-sm text-muted">Money tagged to this project can only be spent on:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.spendRules.map((r) => (
                <span key={r} className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-ink bg-leaf-soft px-3 py-1.5 text-xs font-bold">
                  <Check className="h-3.5 w-3.5" /> {r}
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-dashed border-ink/40 bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft">
                <ShieldCheck className="h-3.5 w-3.5" /> Auto-refund to you if a milestone slips 90+ days
              </span>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card className="p-6">
              <p className="font-display text-4xl font-extrabold">{crore(p.raisedCr)}</p>
              <p className="text-sm text-muted">raised of {crore(p.goalCr)} goal</p>
              <Progress value={funded} color={cat.color} className="mt-4 h-3" />
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-bold">{pct(funded)}</p>
                  <p className="text-xs text-muted">funded</p>
                </div>
                <div>
                  <p className="flex items-center gap-1 font-bold"><Users className="h-4 w-4" /> {count(p.backers)}</p>
                  <p className="text-xs text-muted">taxpayers backing</p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border-2 border-ink bg-leaf-soft p-4">
                <p className="flex items-center gap-1.5 text-sm font-bold">
                  <Sparkles className="h-4 w-4" /> +{crore(projectMatch(p) / 1e7)} from the matching fund
                </p>
                <p className="mt-1 text-xs text-ink-soft">Because so many people back it. <Link to="/fairness" className="underline">How matching works</Link></p>
              </div>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-start gap-2"><Building className="mt-0.5 h-4 w-4 text-muted" /><div><dt className="text-xs text-muted">Implementing agency</dt><dd className="font-medium">{p.agency}</dd></div></div>
                <div className="flex items-start gap-2"><HardHat className="mt-0.5 h-4 w-4 text-muted" /><div><dt className="text-xs text-muted">Contracted vendor</dt><dd className="font-medium">{p.vendor}</dd></div></div>
                <div className="flex items-start gap-2"><CalendarClock className="mt-0.5 h-4 w-4 text-muted" /><div><dt className="text-xs text-muted">Timeline once funded</dt><dd className="font-medium">{p.months} months</dd></div></div>
              </dl>
              {!p.delivered && (
                <button
                  onClick={() => (ready ? toggle(p.id) : navigate('/start'))}
                  className={`brut-sm press mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-display font-bold ${backed ? 'bg-marigold text-ink' : 'bg-ink text-white'}`}
                >
                  {backed ? <><Check className="h-4 w-4" /> Backing this</> : <><Plus className="h-4 w-4" /> Back this project</>}
                </button>
              )}
            </Card>
          </aside>
        </div>
      </Card>
    </div>
  )
}
