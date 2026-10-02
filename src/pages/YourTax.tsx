import { Link, Navigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, Hammer, MapPin, PieChart, Sparkles } from 'lucide-react'
import { Card, Counter, Eyebrow, InfoTip, Pill } from '../components/ui'
import { CITIES, maskPan } from '../data/personas'
import { useStore } from '../store'
import { compact, pct, rupees } from '../lib/format'
import { STANDARD_DEDUCTION, TEN_PERCENT_NOTE } from '../lib/tax'

export default function YourTax() {
  const { persona, tax, income, setIncome } = useStore()
  if (!persona || !tax) return <Navigate to="/promo/login" replace />
  const city = CITIES[persona.city]
  const value = income ?? persona.income
  const firstName = persona.name.replace('Dr. ', '').split(' ')[0]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow>Your tax profile · FY 2026-27</Eyebrow>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Namaste, {firstName}.</h1>
          <p className="mt-2 flex items-center gap-1.5 text-muted">
            <MapPin className="h-4 w-4" /> {persona.locality}, {city.name} · {city.state}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill>PAN {maskPan(persona.pan)}</Pill>
          <Pill>{persona.role}</Pill>
          <Pill>New tax regime</Pill>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        {/* income + breakdown */}
        <Card className="p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <label htmlFor="income" className="text-sm font-semibold">Annual income</label>
            <span className="text-xs text-muted">Pre-filled · drag to try others</span>
          </div>
          <p className="mt-2 font-display text-4xl font-extrabold tabular">{rupees(value)}</p>
          <input
            id="income"
            type="range"
            min={500000}
            max={20000000}
            step={50000}
            value={value}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="mt-4 w-full"
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted">
            <span>₹5 L</span>
            <span>₹2 Cr</span>
          </div>

          <dl className="mt-6 space-y-2.5 text-sm">
            <Row k="Standard deduction" v={`− ${rupees(Math.min(STANDARD_DEDUCTION, value))}`} />
            <Row k="Taxable income" v={rupees(tax.taxable)} />
            <Row k="Tax as per slabs" v={rupees(tax.slabTax)} />
            {tax.rebate > 0 && <Row k="Rebate u/s 87A" v={`− ${rupees(tax.rebate)}`} />}
            {tax.surcharge > 0 && <Row k="Surcharge" v={rupees(tax.surcharge)} />}
            <Row k="Health & education cess (4%)" v={rupees(tax.cess)} />
            <div className="border-t border-line pt-3">
              <Row k={<strong>Total income tax</strong>} v={<strong className="text-base">{rupees(tax.total)}</strong>} />
              <p className="mt-1 text-right text-xs text-muted">Effective rate {pct(tax.effectiveRate, 1)}</p>
            </div>
          </dl>
        </Card>

        {/* 90 / 10 */}
        <Card className="flex flex-col p-6 sm:p-7">
          <h2 className="text-2xl font-bold">Here's how your tax splits</h2>
          {tax.total === 0 ? (
            <div className="mt-6 rounded-2xl bg-leaf-soft p-5 text-sm">
              <p className="font-semibold">You pay zero income tax under the new regime.</p>
              <p className="mt-1 text-muted">You can still explore projects and add your voice. Drag the income slider to see a taxpayer's view.</p>
            </div>
          ) : (
            <>
              <div className="mt-6 flex h-20 overflow-hidden rounded-2xl">
                <motion.div
                  key={tax.total}
                  initial={{ width: '100%' }}
                  animate={{ width: '90%' }}
                  transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col justify-center bg-ink px-4 text-white"
                >
                  <span className="text-xs text-white/70">90% · Essentials</span>
                  <span className="font-display text-xl font-bold tabular">{compact(tax.essential)}</span>
                </motion.div>
                <motion.div
                  key={'n' + tax.total}
                  initial={{ width: '0%' }}
                  animate={{ width: '10%' }}
                  transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center justify-center bg-saffron font-bold text-white"
                >
                  10%
                </motion.div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-paper p-5">
                  <p className="text-sm text-muted">Keeps India running</p>
                  <p className="mt-1 font-display text-3xl font-extrabold">
                    <Counter value={tax.essential} format={rupees} />
                  </p>
                  <p className="mt-1 text-xs text-muted">Defence, interest, states' share, subsidies…</p>
                </div>
                <div className="rounded-2xl bg-saffron-soft p-5 ring-2 ring-saffron/40">
                  <p className="flex items-center gap-1 text-sm font-semibold text-[#C25E00]">
                    Your Nirmaan share <InfoTip>{TEN_PERCENT_NOTE}</InfoTip>
                  </p>
                  <p className="mt-1 font-display text-3xl font-extrabold text-ink">
                    <Counter value={tax.nirmaan} format={rupees} />
                  </p>
                  <p className="mt-1 text-xs text-muted">You decide what this builds</p>
                </div>
              </div>
            </>
          )}

          <div className="mt-auto grid gap-3 pt-6 sm:grid-cols-2">
            <Link to="/essentials" className="group flex items-center justify-between rounded-2xl border border-line p-4 transition hover:border-ink/30">
              <span className="flex items-center gap-3">
                <PieChart className="h-5 w-5 text-chakra" />
                <span className="text-sm font-semibold">Where your 90% goes</span>
              </span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link to="/build" className="group flex items-center justify-between rounded-2xl bg-ink p-4 text-white">
              <span className="flex items-center gap-3">
                <Hammer className="h-5 w-5 text-saffron" />
                <span className="text-sm font-semibold">Build with {compact(tax.nirmaan)}</span>
              </span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </Card>
      </div>

      <Card className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center">
        <Sparkles className="h-5 w-5 shrink-0 text-saffron" />
        <p className="text-sm text-muted">
          <strong className="text-ink">Why does this matter?</strong> Income tax is 21 paise of every rupee the Union government raises. Taxpayers
          like you fund it, and with Nirmaan you finally get a say in part of it.
        </p>
      </Card>
    </div>
  )
}

function Row({ k, v }: { k: React.ReactNode; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted">{k}</dt>
      <dd className="tabular">{v}</dd>
    </div>
  )
}
