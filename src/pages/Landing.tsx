import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'motion/react'
import {
  ArrowRight, Eye, HeartHandshake, Landmark, Lightbulb, Megaphone, Scale, SlidersHorizontal, Sparkles, Vote,
} from 'lucide-react'
import { Card, Counter, Eyebrow, InfoTip, Marquee, Sticker, Squiggle } from '../components/ui'
import { ProjectIcon } from '../components/ProjectIcon'
import { TaxReceipt } from '../components/Receipt'
import { MoneyMetro, buildStations, useMetroPlayer } from '../components/MoneyMetro'
import { IdeaLoop } from '../components/IdeaLoop'
import { PROJECTS, TIERS, type Tier } from '../data/projects'
import { INCOME_TAX_BE_CR, BUDGET_YEAR } from '../data/budget'
import { crore } from '../lib/format'
import { TEN_PERCENT_NOTE } from '../lib/tax'

const fade = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
}

const STEPS = [
  { icon: SlidersHorizontal, t: 'Slide in your tax', d: 'Tell us what you pay. 10% of it becomes yours to direct.', bg: 'bg-marigold', rot: -2 },
  { icon: Vote, t: 'Back what matters', d: 'Chip studios for India, a jogging loop for your ward, or both.', bg: 'bg-pink text-white', rot: 1.5 },
  { icon: Eye, t: 'Ride the Money Metro', d: 'Watch your e₹ travel, stop by stop, until the project goes live.', bg: 'bg-chakra text-white', rot: -1 },
  { icon: Lightbulb, t: 'Pitch the next one', d: 'Missing something? Post an idea, rally vouches, reach the next Budget.', bg: 'bg-leaf text-white', rot: 2 },
]

const TIER_TONES: Record<Tier, string> = { local: 'bg-pink-soft', state: 'bg-chakra-soft', national: 'bg-marigold-soft' }

export default function Landing() {
  const demo = PROJECTS.find((p) => p.id === 'blr-garbage')!
  const stations = buildStations(demo, 21_500, 7)
  const metroRef = useRef<HTMLDivElement>(null)
  const metroInView = useInView(metroRef, { once: true, margin: '-120px' })
  const { pos, replay } = useMetroPlayer(stations.length, { active: metroInView })

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* HERO */}
      <section className="relative grid items-center gap-14 pt-2 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}>
            <Sticker tone="ink" rotate={-3}>
              <Sparkles className="h-4 w-4" /> Citizen budgeting for India
            </Sticker>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-[4.1rem] font-extrabold leading-[0.88] sm:text-[6.5rem] lg:text-[7.2rem]"
          >
            Your tax.
            <br />
            <span className="relative inline-block">
              Your <span className="text-pink">say.</span>
              <Squiggle className="absolute -bottom-3 left-0 h-5 w-full" color="#FFC22E" />
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-8 max-w-lg text-lg text-ink-soft sm:text-xl"
          >
            90% of your income tax keeps India running. With <strong className="text-ink">Nirmaan</strong>, you decide what the other{' '}
            <strong className="text-ink">10%</strong> builds, and you watch every rupee get there.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-9 flex flex-wrap items-center gap-3">
            <Link to="/start" className="brut press inline-flex items-center gap-2 rounded-full bg-marigold px-7 py-4 font-display text-lg font-extrabold">
              Start building <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/ideas/new" className="brut-sm press inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 font-display text-base font-bold">
              <Lightbulb className="h-5 w-5 text-pink" /> Pitch an idea
            </Link>
          </motion.div>
        </div>

        <div className="relative mx-auto w-full max-w-md py-6">
          <motion.div initial={{ opacity: 0, y: 30, rotate: 3 }} animate={{ opacity: 1, y: 0, rotate: -2 }} transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <TaxReceipt tax={5_38_200} name="Ananya · Bellandur, Bengaluru" delay={1.2} />
          </motion.div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.6, type: 'spring' }} className="absolute -left-4 -top-6 z-30 sm:-left-14">
            <TruckArtSticker />
          </motion.div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.9, type: 'spring' }} className="absolute -right-2 bottom-24 z-30 sm:-right-10">
            <Sticker tone="blue" rotate={8}>e₹ tracked</Sticker>
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2.1, type: 'spring' }}
            className="absolute -right-3 -top-4 z-30 flex h-16 w-16 animate-floaty items-center justify-center rounded-full border-[2.5px] border-ink bg-marigold font-display text-xl font-extrabold shadow-[3px_3px_0_#16130F]"
          >
            e₹
          </motion.div>
        </div>
      </section>

      {/* TICKER */}
      <div className="-mx-4 sm:-mx-6">
        <Marquee
          className="-rotate-1 bg-ink text-marigold"
          items={[
            'Your tax, your say',
            `${crore(INCOME_TAX_BE_CR)} income tax in ${BUDGET_YEAR}`,
            `10% = ${crore(INCOME_TAX_BE_CR * 0.1)} in citizens' hands`,
            'Every rupee tracked on e₹',
            'Pitch ideas · rally vouches',
            'Nation · State · Your street',
          ]}
        />
      </div>

      {/* STATS */}
      <motion.section {...fade} className="grid gap-5 sm:grid-cols-3">
        <Card className="p-6" tone="white">
          <p className="font-display text-5xl font-extrabold tracking-tight"><Counter value={INCOME_TAX_BE_CR} format={(n) => crore(n)} /></p>
          <p className="mt-2 text-sm text-ink-soft">Income tax India expects in {BUDGET_YEAR} (BE)</p>
        </Card>
        <Card className="rotate-[-1.5deg] p-6" tone="pink">
          <p className="font-display text-5xl font-extrabold tracking-tight text-white"><Counter value={INCOME_TAX_BE_CR * 0.1} format={(n) => crore(n)} /></p>
          <p className="mt-2 text-sm font-medium text-white/90">
            Directed by taxpayers at 10% <InfoTip>{TEN_PERCENT_NOTE}</InfoTip>
          </p>
        </Card>
        <Card className="p-6" tone="marigold">
          <p className="font-display text-5xl font-extrabold tracking-tight">100%</p>
          <p className="mt-2 text-sm font-medium text-ink-soft">Of your 10% tracked to the last mile on e₹</p>
        </Card>
      </motion.section>

      {/* HOW IT WORKS */}
      <section>
        <motion.div {...fade} className="max-w-2xl">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-3 text-5xl font-extrabold leading-[0.95] sm:text-6xl">From taxpayer to nation-builder in four moves.</h2>
        </motion.div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div key={s.t} {...fade} transition={{ ...fade.transition, delay: i * 0.08 }} whileHover={{ rotate: 0, y: -4 }} style={{ rotate: s.rot }}>
              <div className={`brut h-full rounded-[26px] p-6 ${s.bg}`}>
                <div className="flex items-center justify-between">
                  <span className="font-display text-6xl font-extrabold leading-none opacity-90">{i + 1}</span>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-white text-ink">
                    <s.icon className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-6 text-2xl font-extrabold leading-tight">{s.t}</h3>
                <p className="mt-2 text-sm opacity-90">{s.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MONEY METRO */}
      <motion.section {...fade}>
        <Card size="lg" className="overflow-hidden p-6 sm:p-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <Eyebrow dot="#3D5AFE">Last-mile visibility</Eyebrow>
              <h2 className="mt-3 text-4xl font-extrabold leading-[0.95] sm:text-5xl">Ride the Money Metro.</h2>
              <p className="mt-3 text-ink-soft">
                Your 10% travels as <strong className="text-ink">purpose-bound e-Rupee</strong>, RBI's digital rupee. It can only be spent on what the
                project allows, gets released stop by stop as milestones are verified, and every hop leaves a ticket on a public ledger.
              </p>
            </div>
            <Sticker tone="mint" rotate={3}>Live example · {demo.title}</Sticker>
          </div>
          <div ref={metroRef} className="mt-10">
            <MoneyMetro project={demo} stations={stations} pos={pos} onReplay={replay} />
          </div>
        </Card>
      </motion.section>

      {/* TIERS */}
      <section>
        <motion.div {...fade} className="max-w-2xl">
          <Eyebrow dot="#17B26A">Nation · State · Your street</Eyebrow>
          <h2 className="mt-3 text-5xl font-extrabold leading-[0.95] sm:text-6xl">Fix your lane. Fund the future. Or both.</h2>
          <p className="mt-4 text-lg text-ink-soft">
            The government lists projects it wants to build but hasn't prioritised. They get built only when taxpayers back them. No quotas: split your
            10% however you like.
          </p>
        </motion.div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {(['local', 'state', 'national'] as Tier[]).map((tier, i) => (
            <motion.div key={tier} {...fade} transition={{ ...fade.transition, delay: i * 0.08 }}>
              <Card className={`h-full p-6 ${TIER_TONES[tier]}`}>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-3xl font-extrabold">{TIERS[tier].label}</h3>
                  <span className="font-hand text-base text-ink-soft">{TIERS[tier].blurb}</span>
                </div>
                <ul className="mt-5 space-y-2.5">
                  {PROJECTS.filter((p) => p.tier === tier)
                    .slice(0, 3)
                    .map((p) => (
                      <li key={p.id} className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-white p-2.5">
                        <ProjectIcon project={p} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold">{p.title}</p>
                          <p className="truncate text-xs text-muted">{p.where}</p>
                        </div>
                      </li>
                    ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* IDEA LOOP */}
      <motion.section {...fade} className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Eyebrow dot="#9B6BFF">The feedback loop</Eyebrow>
          <h2 className="mt-3 text-5xl font-extrabold leading-[0.95] sm:text-6xl">Don't see your project? Pitch it.</h2>
          <p className="mt-4 text-lg text-ink-soft">
            Post an idea, turn it into a campaign, and get people with the same problem to vouch for it. When the government sits down to pick the next
            round of Nirmaan projects, it starts from a list ranked by real citizens, not from a blank page.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/ideas/new" className="brut press inline-flex items-center gap-2 rounded-full bg-lilac px-6 py-3.5 font-display font-extrabold text-white">
              See how pitching works <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/ideas" className="brut-sm press inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-display font-bold">
              Browse ideas
            </Link>
          </div>
        </div>
        <IdeaLoop />
      </motion.section>

      {/* WIN-WIN */}
      <section>
        <motion.div {...fade} className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">Everybody wins</Eyebrow>
          <h2 className="mt-3 text-5xl font-extrabold leading-[0.95] sm:text-6xl">Citizens get a voice. Government earns trust.</h2>
        </motion.div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <motion.div {...fade} style={{ rotate: -1 }}>
            <Card className="h-full p-7 sm:p-9" tone="pink">
              <HeartHandshake className="h-9 w-9 text-white" />
              <h3 className="mt-4 text-3xl font-extrabold text-white">For you</h3>
              <ul className="mt-5 space-y-4 text-white">
                {[
                  ['A real say', 'Choose what your 10% builds, from your ward to the nation.'],
                  ['See every rupee', '“Where did my tax go?” gets an answer, with receipts.'],
                  ['Pride you can share', "Your name on what got built. You're building India, not just paying for it."],
                ].map(([t, d]) => (
                  <li key={t} className="rounded-2xl border-2 border-ink bg-white/15 p-4">
                    <p className="font-display text-lg font-extrabold">{t}</p>
                    <p className="text-sm text-white/90">{d}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
          <motion.div {...fade} transition={{ ...fade.transition, delay: 0.08 }} style={{ rotate: 1 }}>
            <Card className="h-full p-7 sm:p-9" tone="blue">
              <Landmark className="h-9 w-9" />
              <h3 className="mt-4 text-3xl font-extrabold">For the government</h3>
              <ul className="mt-5 space-y-4">
                {[
                  ['Goodwill', 'Turns a frustrated, very online middle class into stakeholders.'],
                  ['A live demand signal', "Ranked citizen ideas, ward by ward, before the next Budget's drafted."],
                  ['Transparency that scales', 'Programmable e₹ cuts leakage and puts the digital rupee in crores of hands.'],
                ].map(([t, d]) => (
                  <li key={t} className="rounded-2xl border-2 border-ink bg-white/15 p-4">
                    <p className="font-display text-lg font-extrabold">{t}</p>
                    <p className="text-sm text-white/90">{d}</p>
                  </li>
                ))}
              </ul>
              <Link to="/government" className="mt-6 inline-flex items-center gap-1.5 font-display font-bold text-marigold">
                See the government view <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAIRNESS TEASER */}
      <motion.section {...fade}>
        <Card size="lg" tone="ink" className="grid gap-10 p-7 sm:p-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Scale className="h-9 w-9 text-marigold" />
            <h2 className="mt-4 text-4xl font-extrabold leading-[0.95] sm:text-5xl">
              ₹1 crore in tax vs ₹1 lakh. <span className="text-marigold">Who gets more say?</span>
            </h2>
            <p className="mt-4 text-white/75">
              One-person-one-vote ignores what you contribute. One-rupee-one-vote lets wallets drown out people. Nirmaan uses{' '}
              <strong className="text-white">square-root voice</strong>: pay 100× more, get 10× the say.
            </p>
            <Link to="/fairness" className="brut-sm press mt-7 inline-flex items-center gap-2 rounded-full bg-marigold px-5 py-3 font-display font-bold text-ink">
              Play with the fairness model <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid content-center gap-4">
            {[
              { l: 'One person, one vote', v: '1×', w: 0.1, c: '#9B6BFF' },
              { l: 'Nirmaan · square-root', v: '10×', w: 0.32, c: '#FFC22E' },
              { l: 'One rupee, one vote', v: '100×', w: 1, c: '#FF4F8B' },
            ].map((r) => (
              <div key={r.l}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-white/80">{r.l}</span>
                  <span className="font-display font-extrabold">{r.v}</span>
                </div>
                <div className="h-5 overflow-hidden rounded-full border-2 border-white/80 bg-white/10">
                  <motion.div className="h-full rounded-full" style={{ background: r.c }} initial={{ width: 0 }} whileInView={{ width: `${r.w * 100}%` }} viewport={{ once: true }} transition={{ duration: 1 }} />
                </div>
              </div>
            ))}
            <p className="font-hand text-base text-white/60">influence of a ₹1 Cr taxpayer vs a ₹1 L taxpayer</p>
          </div>
        </Card>
      </motion.section>

      {/* CTA */}
      <motion.section {...fade} className="pb-6 text-center">
        <Megaphone className="mx-auto h-10 w-10 -rotate-12 text-pink" />
        <h2 className="mx-auto mt-4 max-w-3xl text-5xl font-extrabold leading-[0.92] sm:text-7xl">
          Don't just pay for India.{' '}
          <span className="relative inline-block">
            Build it.
            <Squiggle className="absolute -bottom-2 left-0 h-4 w-full" color="#FF4F8B" />
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-ink-soft">It takes 60 seconds. We're building this in public, so tell us what to change.</p>
        <Link to="/start" className="brut press mt-9 inline-flex items-center gap-2 rounded-full bg-marigold px-8 py-4 font-display text-lg font-extrabold">
          Start building <ArrowRight className="h-5 w-5" />
        </Link>
      </motion.section>
    </div>
  )
}

/** A wink at India's truck art: "Horn OK Please" becomes "Tax OK Please" */
function TruckArtSticker() {
  return (
    <div className="animate-wiggle">
      <div className="rotate-[-10deg] rounded-xl border-[2.5px] border-ink bg-[#FFE14D] p-1 shadow-[3px_3px_0_#16130F]">
        <div className="rounded-lg border-2 border-dashed border-[#E4002B] px-3 py-1.5 text-center">
          <p className="font-display text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#0A7E3E]">Tax</p>
          <p className="font-display text-lg font-extrabold uppercase leading-none text-[#E4002B]">OK Please</p>
          <p className="mt-0.5 flex justify-center gap-1 text-[8px] text-[#3D5AFE]">★ ✿ ★</p>
        </div>
      </div>
    </div>
  )
}
