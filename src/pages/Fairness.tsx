import { useState } from 'react'
import { motion } from 'motion/react'
import { FingerprintPattern, ShieldCheck, Sigma, Users, Wallet } from 'lucide-react'
import { Card, Eyebrow, PageHeader } from '../components/ui'
import { compact, pct } from '../lib/format'
import { qfShares } from '../lib/qf'

const BIG = 1_00_00_000 // ₹1 Cr tax
const SMALL = 1_00_000 // ₹1 L tax
const SHARE = 0.1
const POOL = 10 * 1e7 // ₹10 Cr illustrative matching pool

export default function Fairness() {
  const [nBig, setNBig] = useState(10)
  const [nSmall, setNSmall] = useState(100)

  const cBig = BIG * SHARE
  const cSmall = SMALL * SHARE
  const moneyA = nBig * cBig
  const moneyB = nSmall * cSmall

  const models = [
    { name: 'One person, one vote', note: 'Counts heads only', shares: [nBig / (nBig + nSmall), nSmall / (nBig + nSmall)], color: '#9B6BFF' },
    { name: 'One rupee, one vote', note: 'Counts wallets only', shares: [moneyA / (moneyA + moneyB), moneyB / (moneyA + moneyB)], color: '#FF4F8B' },
    { name: 'Nirmaan: square-root voice', note: 'Counts people and contribution', shares: qfShares([Array(nBig).fill(cBig), Array(nSmall).fill(cSmall)]), color: '#FFC22E', star: true },
  ]

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="The fairness model"
        title={<>₹1 crore in tax vs ₹1 lakh. <span className="text-pink">Who gets more say?</span></>}
        sub="It's the first question critics ask, and it's a fair one. Here's how Nirmaan answers it, in two layers."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-7">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-ink bg-pink text-white"><Wallet className="h-5 w-5" /></span>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted">Layer 1 · Your money</p>
          <h2 className="mt-1 text-2xl font-bold">Your 10% goes exactly where you say.</h2>
          <p className="mt-2 text-muted">
            Pay ₹1 crore in tax and you direct ₹10 lakh. Pay ₹1 lakh and you direct ₹10,000. Nobody's money is diluted or redistributed. This
            layer is fully proportional.
          </p>
        </Card>
        <Card className="rotate-[1deg] p-7" tone="marigold">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-ink bg-white"><Sigma className="h-5 w-5" /></span>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-ink">Layer 2 · Your voice</p>
          <h2 className="mt-1 text-2xl font-bold">The matching fund listens to people.</h2>
          <p className="mt-2 text-muted">
            A separate government matching fund is shared out by <strong className="text-ink">quadratic funding</strong>. Your voice grows with the{' '}
            <strong className="text-ink">square root</strong> of what you put in. Pay 100× more and you get 10× the voice: more say, but not
            enough to drown out everyone else.
          </p>
        </Card>
      </div>

      {/* voice per person */}
      <Card className="p-7 sm:p-9">
        <Eyebrow>Voice per person in the matching fund</Eyebrow>
        <div className="mt-6 grid items-end gap-8 sm:grid-cols-3">
          {[
            { who: '₹1 L taxpayer', directs: cSmall, voice: Math.sqrt(cSmall), color: '#17B26A' },
            { who: '₹10 L taxpayer', directs: 10_00_000 * SHARE, voice: Math.sqrt(10_00_000 * SHARE), color: '#3D5AFE' },
            { who: '₹1 Cr taxpayer', directs: cBig, voice: Math.sqrt(cBig), color: '#FF4F8B' },
          ].map((p) => (
            <div key={p.who} className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', bounce: 0.3 }}
                className="flex items-center justify-center rounded-full border-[2.5px] border-ink font-display text-sm font-extrabold text-white shadow-[3px_3px_0_#16130F]"
                style={{ background: p.color, width: 40 + p.voice / 6, height: 40 + p.voice / 6 }}
              >
                {Math.round(p.voice / Math.sqrt(cSmall))}×
              </motion.div>
              <p className="mt-4 font-bold">{p.who}</p>
              <p className="text-sm text-muted">directs {compact(p.directs)} · voice {Math.round(p.voice / Math.sqrt(cSmall))}×</p>
            </div>
          ))}
        </div>
      </Card>

      {/* simulator */}
      <Card className="p-7 sm:p-9">
        <Eyebrow>Try it yourself</Eyebrow>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">A stadium backed by a few big taxpayers vs. parks backed by many</h2>
        <p className="mt-2 text-muted">Drag the sliders. See how a {compact(POOL)} matching fund would be shared under each model.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Slider
            label="₹1 Cr taxpayers backing the Stadium"
            value={nBig}
            min={1}
            max={100}
            onChange={setNBig}
            sub={`They direct ${compact(moneyA)} between them`}
            color="#3D5AFE"
          />
          <Slider
            label="₹1 L taxpayers backing Neighbourhood Parks"
            value={nSmall}
            min={10}
            max={5000}
            step={10}
            onChange={setNSmall}
            sub={`They direct ${compact(moneyB)} between them`}
            color="#17B26A"
          />
        </div>

        <div className="mt-10 space-y-6">
          {models.map((m) => (
            <div key={m.name} className={m.star ? 'brut-sm rounded-2xl bg-marigold-soft p-4' : 'px-4'}>
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-bold">{m.name} <span className="ml-1 text-xs font-normal text-muted">{m.note}</span></p>
                <p className="text-xs text-muted">
                  Stadium <strong className="text-ink">{compact(m.shares[0] * POOL)}</strong> · Parks <strong className="text-ink">{compact(m.shares[1] * POOL)}</strong>
                </p>
              </div>
              <div className="flex h-10 overflow-hidden rounded-xl border-2 border-ink text-xs font-bold text-white">
                <motion.div animate={{ width: `${m.shares[0] * 100}%` }} transition={{ type: 'spring', bounce: 0, duration: 0.6 }} className="flex items-center overflow-hidden whitespace-nowrap border-r-2 border-ink bg-chakra px-3">
                  {m.shares[0] > 0.12 && `Stadium ${pct(m.shares[0])}`}
                </motion.div>
                <motion.div animate={{ width: `${m.shares[1] * 100}%` }} transition={{ type: 'spring', bounce: 0, duration: 0.6 }} className="flex items-center justify-end overflow-hidden whitespace-nowrap bg-leaf px-3">
                  {m.shares[1] > 0.12 && `Parks ${pct(m.shares[1])}`}
                </motion.div>
              </div>
            </div>
          ))}
        </div>
        <p className="brut-sm mt-6 rounded-2xl bg-ink p-4 text-sm text-white">
          Headcount gives the stadium <strong>{pct(models[0].shares[0])}</strong> of the matching fund. Wallets give it{' '}
          <strong>{pct(models[1].shares[0])}</strong>. Nirmaan lands in between at{' '}
          <strong className="text-marigold">{pct(models[2].shares[0])}</strong>: big taxpayers count for more, but not for everything.
        </p>
        <p className="mt-3 text-sm text-muted">
          Note: under every model, the stadium backers' own {compact(moneyA)} still goes to the stadium. Only the <em>matching</em> fund is shaped by
          breadth of support.
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: FingerprintPattern, t: 'One PAN, one voice', d: "PAN + Aadhaar verification stops anyone splitting money across fake accounts to game the square root." },
          { icon: ShieldCheck, t: 'Caps on influence', d: 'Any single backer’s matching weight is capped, and bulk “employer campaigns” are flagged for review.' },
          { icon: Users, t: 'Open formula', d: 'The matching formula and every allocation are public, in aggregate. Individual choices stay private.' },
        ].map((s) => (
          <Card key={s.t} className="p-6">
            <s.icon className="h-6 w-6 text-pink" />
            <h3 className="mt-3 text-lg font-bold">{s.t}</h3>
            <p className="mt-1 text-sm text-muted">{s.d}</p>
          </Card>
        ))}
      </div>

      <Card tone="ink" className="p-7 text-center sm:p-10">
        <h2 className="text-2xl font-bold sm:text-3xl">Is this fair? We genuinely want to know.</h2>
        <p className="mx-auto mt-2 max-w-xl text-white/70">
          Nirmaan is being built in public. Tell us whether the square-root model feels right, or what you'd change.
        </p>
      </Card>
    </div>
  )
}

function Slider({
  label, value, min, max, step = 1, onChange, sub, color,
}: { label: string; value: number; min: number; max: number; step?: number; onChange: (n: number) => void; sub: string; color: string }) {
  return (
    <div className="brut-sm rounded-2xl bg-paper p-5">
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm font-semibold">{label}</label>
        <span className="font-display text-2xl font-extrabold tabular" style={{ color }}>{value.toLocaleString('en-IN')}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-4 w-full" aria-label={label} />
      <p className="mt-2 text-xs text-muted">{sub}</p>
    </div>
  )
}
