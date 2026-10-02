import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ArrowRight, BadgeCheck, ChartColumn, Eye, Flag, Handshake, HeartHandshake, Landmark, Megaphone, ScanSearch, Scale, Vote,
} from 'lucide-react'
import { Card, Counter, Eyebrow, InfoTip, Pill } from '../components/ui'
import { ProjectIcon } from '../components/ProjectIcon'
import { ERupeeTrail, buildTrail } from '../components/Trail'
import { CATEGORIES, PROJECTS, TIERS, type Tier } from '../data/projects'
import { INCOME_TAX_BE_CR, BUDGET_YEAR } from '../data/budget'
import { crore, compact } from '../lib/format'

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
}

const HERO_PICKS = [
  { id: 'blr-garbage', amt: 21_500 },
  { id: 'chip-studio', amt: 16_000 },
  { id: 'olympic-hubs', amt: 10_320 },
  { id: 'ka-lakes', amt: 6_000 },
]

export default function Landing() {
  const demoProject = PROJECTS.find((p) => p.id === 'blr-garbage')!
  return (
    <div className="space-y-24 sm:space-y-32">
      {/* HERO */}
      <section className="grid items-center gap-12 pt-2 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Pill soft="#FFF1E3" color="#C25E00">
              <Flag className="h-3.5 w-3.5" /> A citizen-budgeting concept for India
            </Pill>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-[3.4rem] font-extrabold leading-[0.95] sm:text-7xl lg:text-[5.5rem]"
          >
            Your tax.
            <br />
            <span className="text-saffron">Your say.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-6 max-w-lg text-lg text-muted sm:text-xl"
          >
            90% of your income tax keeps India running. <strong className="text-ink">Nirmaan</strong> lets you decide what the other{' '}
            <strong className="text-ink">10%</strong> builds, from your ward's garbage trucks to India's first chip studios. Then track every
            rupee to the last mile.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-saffron px-6 py-3.5 font-semibold text-white shadow-[0_10px_30px_-10px_rgba(255,138,31,.8)]">
              Log in with PAN <span className="rounded bg-white/25 px-1.5 text-[10px] font-bold uppercase">Demo</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how" className="inline-flex items-center gap-2 rounded-full px-5 py-3.5 font-semibold text-ink hover:bg-black/5">
              How it works
            </a>
          </motion.div>
        </div>

        <HeroVisual />
      </section>

      {/* STATS */}
      <motion.section {...fade} className="grid gap-4 sm:grid-cols-3">
        <Stat
          value={<Counter value={INCOME_TAX_BE_CR} format={(n) => crore(n)} />}
          label={`Income tax India expects to collect in ${BUDGET_YEAR} (BE)`}
        />
        <Stat
          value={<Counter value={INCOME_TAX_BE_CR * 0.1} format={(n) => crore(n)} />}
          label={
            <>
              Would be directed by taxpayers at 10%{' '}
              <InfoTip>
                We're starting the pilot at 10%, in discussion with the government and subject to feasibility. The percentage can change. For now
                it's for demonstration: 90% goes to essential government spending and 10% is where you have a say.
              </InfoTip>
            </>
          }
          accent
        />
        <Stat value="100%" label="Of your 10% tracked to the last mile on the e-Rupee rail" />
      </motion.section>

      {/* PROBLEM */}
      <motion.section {...fade} className="grid gap-10 lg:grid-cols-2">
        <div>
          <Eyebrow>The living-room debate</Eyebrow>
          <h2 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">You pay every month. You never see where it goes.</h2>
          <p className="mt-5 text-lg text-muted">
            The ultra-rich get a seat at the table. Welfare schemes reach the underserved. But India's salaried taxpayers, the ones who fund
            a fifth of every rupee the Centre spends, have no voice in what gets built and no way to see the result.
          </p>
        </div>
        <div className="grid gap-3">
          {[
            ['“I pay 30% tax and still buy my own water, security and healthcare.”', 'Every apartment WhatsApp group'],
            ['“The road outside my office has had the same pothole for three years.”', 'Every Monday commute'],
            ["“I'd happily pay if I could just see what it built.”", 'Every Diwali family dinner'],
          ].map(([q, who]) => (
            <Card key={q} className="p-5">
              <p className="font-display text-lg font-semibold leading-snug">{q}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wider text-muted">{who}</p>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* HOW IT WORKS */}
      <section id="how" className="scroll-mt-24">
        <motion.div {...fade} className="max-w-2xl">
          <Eyebrow>How Nirmaan works</Eyebrow>
          <h2 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">Four steps from taxpayer to nation-builder.</h2>
        </motion.div>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {[
            { icon: ScanSearch, t: 'Log in with PAN', d: 'Your income and tax are pre-filled. Nothing to calculate.' },
            { icon: ChartColumn, t: 'See your 90 / 10', d: 'See where your 90% goes, and how much of your 10% you control.' },
            { icon: Vote, t: 'Back what matters', d: 'Pick national missions, state projects or your own ward.' },
            { icon: Eye, t: 'Track to the last mile', d: 'Purpose-bound e-Rupee shows every hop, from your PAN to the pothole.' },
          ].map((s, i) => (
            <motion.div key={s.t} {...fade} transition={{ ...fade.transition, delay: i * 0.08 }}>
              <Card className="h-full p-6">
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
                <s.icon className="mt-4 h-7 w-7 text-saffron" />
                <h3 className="mt-4 text-xl font-bold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted">{s.d}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TIERS */}
      <section>
        <motion.div {...fade} className="max-w-2xl">
          <Eyebrow>Nation · State · Your street</Eyebrow>
          <h2 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">Fund the future, or fix your lane. Or both.</h2>
          <p className="mt-4 text-lg text-muted">
            The government lists projects it wants to build but hasn't prioritised. They only get built if taxpayers fund them. No
            quotas: split your 10% however you like.
          </p>
        </motion.div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {(['national', 'state', 'local'] as Tier[]).map((tier, i) => {
            const items = PROJECTS.filter((p) => p.tier === tier).slice(0, 3)
            return (
              <motion.div key={tier} {...fade} transition={{ ...fade.transition, delay: i * 0.08 }}>
                <Card className="h-full p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">{TIERS[tier].label}</h3>
                    <span className="text-xs text-muted">{TIERS[tier].blurb}</span>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {items.map((p) => (
                      <li key={p.id} className="flex items-center gap-3">
                        <ProjectIcon project={p} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{p.title}</p>
                          <p className="truncate text-xs text-muted">{CATEGORIES[p.category].label} · {p.where}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* TRAIL */}
      <motion.section {...fade}>
        <Card className="overflow-hidden p-6 sm:p-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <Eyebrow>Last-mile visibility</Eyebrow>
              <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">Follow your rupee from PAN to pothole.</h2>
              <p className="mt-3 text-muted">
                Your 10% moves as <strong className="text-ink">purpose-bound e-Rupee</strong>, RBI's digital rupee. It can only be spent on what the
                project allows, is released milestone by milestone, and every hop is on a public ledger.
              </p>
            </div>
            <Pill soft="#E5F6EC" color="#11804A">
              <BadgeCheck className="h-3.5 w-3.5" /> Live example · {demoProject.title}
            </Pill>
          </div>
          <div className="mt-10">
            <ERupeeTrail steps={buildTrail(demoProject, 21_500, 'ABCPR4821K', 7)} reached={5} autoplay />
          </div>
        </Card>
      </motion.section>

      {/* WIN-WIN */}
      <section>
        <motion.div {...fade} className="mx-auto max-w-2xl text-center">
          <Eyebrow>A win on both sides</Eyebrow>
          <h2 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">Citizens get a voice. Government earns trust.</h2>
        </motion.div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <motion.div {...fade}>
            <Card className="h-full bg-saffron-soft/60 p-7 sm:p-9">
              <HeartHandshake className="h-8 w-8 text-saffron" />
              <h3 className="mt-4 text-2xl font-bold">For you, the taxpayer</h3>
              <ul className="mt-5 space-y-4">
                {[
                  ['A real say', 'Choose what your 10% builds, from your ward to the nation.'],
                  ['See every rupee', 'Last-mile tracking replaces “where did my tax go?”'],
                  ['Pride you can share', "Your name on what got built. You're not just paying tax, you're building India."],
                ].map(([t, d]) => (
                  <li key={t}>
                    <p className="font-semibold">{t}</p>
                    <p className="text-sm text-muted">{d}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
          <motion.div {...fade} transition={{ ...fade.transition, delay: 0.08 }}>
            <Card className="h-full bg-chakra-soft/60 p-7 sm:p-9">
              <Landmark className="h-8 w-8 text-chakra" />
              <h3 className="mt-4 text-2xl font-bold">For the government</h3>
              <ul className="mt-5 space-y-4">
                {[
                  ['Goodwill with a vocal group', 'Turns a frustrated, online middle class into stakeholders.'],
                  ['A live demand signal', 'Know exactly what citizens want, ward by ward, before you build.'],
                  ['Transparency that scales', 'Programmable e₹ cuts leakage and drives real e-Rupee adoption.'],
                ].map(([t, d]) => (
                  <li key={t}>
                    <p className="font-semibold">{t}</p>
                    <p className="text-sm text-muted">{d}</p>
                  </li>
                ))}
              </ul>
              <Link to="/government" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-chakra">
                See the government dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAIRNESS TEASER */}
      <motion.section {...fade}>
        <Card className="grid gap-8 bg-ink p-7 text-white sm:p-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Scale className="h-8 w-8 text-saffron" />
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
              Someone pays ₹1 crore in tax. Someone pays ₹1 lakh. Who gets more say?
            </h2>
            <p className="mt-4 text-white/70">
              One-person-one-vote ignores what you contribute. One-rupee-one-vote lets wallets drown out people. Nirmaan uses{' '}
              <strong className="text-white">square-root voice</strong>: pay 100× more, get 10× the say.
            </p>
            <Link to="/fairness" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink">
              Explore the fairness model <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid content-center gap-3">
            {[
              { l: 'One person, one vote', v: '1×', w: 0.1, c: '#8A93B8' },
              { l: 'Nirmaan (square-root)', v: '10×', w: 0.32, c: '#FF8A1F' },
              { l: 'One rupee, one vote', v: '100×', w: 1, c: '#E4572E' },
            ].map((r) => (
              <div key={r.l}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-white/80">{r.l}</span>
                  <span className="font-bold">{r.v}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: r.c }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${r.w * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            ))}
            <p className="mt-1 text-xs text-white/50">Influence of a ₹1 Cr taxpayer relative to a ₹1 L taxpayer</p>
          </div>
        </Card>
      </motion.section>

      {/* CTA */}
      <motion.section {...fade} className="pb-8 text-center">
        <Megaphone className="mx-auto h-8 w-8 text-saffron" />
        <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
          Don't just pay for India. <span className="text-saffron">Build it.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Try the demo with a sample PAN. It takes 60 seconds. We're building this in public, so tell us what to change.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-semibold text-white">
            Start building <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/government" className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3.5 font-semibold">
            <Handshake className="h-4 w-4" /> I work in government
          </Link>
        </div>
      </motion.section>
    </div>
  )
}

function Stat({ value, label, accent }: { value: React.ReactNode; label: React.ReactNode; accent?: boolean }) {
  return (
    <Card className={accent ? 'border-transparent bg-saffron p-6 text-white' : 'p-6'}>
      <p className="font-display text-4xl font-extrabold sm:text-5xl">{value}</p>
      <p className={`mt-2 text-sm ${accent ? 'text-white/90' : 'text-muted'}`}>{label}</p>
    </Card>
  )
}

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-saffron/20 via-transparent to-leaf/20 blur-2xl" />
      <Card className="p-5 shadow-[0_30px_80px_-30px_rgba(14,19,48,.35)] sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted">Ananya · Bellandur, Bengaluru</p>
            <p className="font-display text-2xl font-bold">Income tax FY 26-27</p>
          </div>
          <p className="font-display text-2xl font-extrabold tabular">₹5,38,200</p>
        </div>

        <div className="mt-5 flex h-14 overflow-hidden rounded-2xl text-sm font-semibold">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '90%' }}
            transition={{ delay: 0.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center bg-ink px-4 text-white"
          >
            90% · Keeps India running
          </motion.div>
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '10%' }}
            transition={{ delay: 0.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center bg-saffron text-white"
          >
            10%
          </motion.div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm font-semibold">
            You decide <span className="text-saffron">₹53,820</span>
          </p>
          <span className="text-xs text-muted">4 projects backed</span>
        </div>
        <div className="mt-3 space-y-2.5">
          {HERO_PICKS.map((h, i) => {
            const p = PROJECTS.find((x) => x.id === h.id)!
            return (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 + i * 0.15, duration: 0.5 }}
                className="flex items-center gap-3 rounded-2xl border border-line p-3"
              >
                <ProjectIcon project={p} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.title}</p>
                  <p className="text-xs text-muted">{TIERS[p.tier].label}</p>
                </div>
                <span className="text-sm font-bold tabular">{compact(h.amt)}</span>
              </motion.div>
            )
          })}
        </div>
      </Card>
    </motion.div>
  )
}
