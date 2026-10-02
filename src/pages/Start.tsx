import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import clsx from 'clsx'
import { ArrowRight, Calculator, MapPin, PieChart, PlugZap } from 'lucide-react'
import { Button, Card, Eyebrow, InfoTip, Mark, Scribble } from '../components/ui'
import { TaxReceipt } from '../components/Receipt'
import { CITIES, type CityId } from '../data/personas'
import { useStore } from '../store'
import { compact, rupees } from '../lib/format'
import { computeTax, TEN_PERCENT_NOTE } from '../lib/tax'

const MIN = 5_000
const MAX = 50_00_000
const toTax = (p: number) => niceRound(MIN * Math.pow(MAX / MIN, p / 1000))
const toPos = (t: number) => Math.round((1000 * Math.log(Math.max(t, MIN) / MIN)) / Math.log(MAX / MIN))

function niceRound(n: number) {
  const step = n < 1_00_000 ? 1_000 : n < 10_00_000 ? 5_000 : 25_000
  return Math.round(n / step) * step
}

const PRESETS = [50_000, 1_50_000, 5_00_000, 8_00_000, 25_00_000]

export default function Start() {
  const store = useStore()
  const navigate = useNavigate()
  const [tax, setTax] = useState(store.taxPaid ?? 1_50_000)
  const [city, setCity] = useState<CityId>(store.city ?? 'bengaluru')
  const [hometown, setHometown] = useState<CityId | null>(store.hometown)
  const [estimate, setEstimate] = useState(false)
  const [salary, setSalary] = useState(25_00_000)

  const go = () => {
    store.setup(tax, city, hometown)
    navigate('/build')
  }

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_1fr]">
      <div>
        <Eyebrow dot="#FFC22E">Step 1 of 3 · Your share</Eyebrow>
        <h1 className="mt-3 text-[2.7rem] font-extrabold leading-[0.95] sm:text-6xl">
          How much income tax do you pay a year<span className="text-pink">?</span>
        </h1>

        <Card className="mt-8 p-6 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <label htmlFor="tax" className="text-sm font-semibold text-ink-soft">Annual income tax</label>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-display text-5xl font-extrabold tabular tracking-tight sm:text-6xl">{rupees(tax)}</span>
              </div>
            </div>
            <Scribble arrow="none" className="hidden rotate-[-6deg] sm:inline-flex">drag me!</Scribble>
          </div>
          <input
            id="tax"
            type="range"
            min={0}
            max={1000}
            value={toPos(tax)}
            onChange={(e) => setTax(toTax(Number(e.target.value)))}
            className="mt-5 w-full"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => setTax(p)}
                className={clsx('brut-sm rounded-full px-3.5 py-1.5 font-display text-sm font-bold transition', tax === p ? 'bg-ink text-white' : 'bg-white hover:bg-marigold-soft')}
              >
                {compact(p)}
              </button>
            ))}
            <button onClick={() => setEstimate((e) => !e)} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-chakra underline-offset-4 hover:underline">
              <Calculator className="h-4 w-4" /> Not sure? Estimate from salary
            </button>
          </div>

          {estimate && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 overflow-hidden rounded-2xl border-2 border-dashed border-ink/40 bg-paper p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold">Annual salary</span>
                <span className="font-display text-xl font-extrabold tabular">{rupees(salary)}</span>
              </div>
              <input
                type="range"
                min={500000}
                max={20000000}
                step={50000}
                value={salary}
                onChange={(e) => {
                  const s = Number(e.target.value)
                  setSalary(s)
                  setTax(computeTax(s).total)
                }}
                className="mt-3 w-full"
                aria-label="Annual salary"
              />
              <p className="mt-2 text-xs text-muted">New regime, FY 2026-27, salaried. Income up to ₹12.75 L pays zero tax.</p>
            </motion.div>
          )}

          <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-chakra-soft p-3.5 text-sm">
            <PlugZap className="mt-0.5 h-4 w-4 shrink-0 text-chakra" />
            <p className="text-ink-soft">
              <strong className="text-ink">Coming soon:</strong> this will be pulled automatically from your income tax filing once Nirmaan is
              connected to the official portals. For now, just slide.
            </p>
          </div>
        </Card>

        <div className="mt-8">
          <p className="flex items-center gap-2 font-display text-lg font-extrabold">
            <MapPin className="h-5 w-5 text-pink" /> Where do you live?
          </p>
          <p className="text-sm text-muted">So we can show projects on your streets, not just the nation's.</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {(Object.keys(CITIES) as CityId[]).map((c, i) => (
              <motion.button
                key={c}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCity(c)}
                className={clsx('brut-sm rounded-2xl px-4 py-2.5 text-left transition', city === c ? 'bg-pink text-white' : 'bg-white hover:bg-pink-soft')}
                style={{ rotate: city === c ? (i % 2 ? 2 : -2) : 0 }}
              >
                <span className="block font-display text-base font-extrabold leading-tight">{CITIES[c].name}</span>
                <span className={clsx('block text-[11px]', city === c ? 'text-white/80' : 'text-muted')}>{CITIES[c].state}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <p className="font-display text-lg font-extrabold">Hometown somewhere else? <span className="font-sans text-sm font-medium text-muted">(optional)</span></p>
          <p className="text-sm text-muted">Back projects in your native town too, not just where you work.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(Object.keys(CITIES) as CityId[]).filter((c) => c !== city).map((c) => (
              <button
                key={c}
                onClick={() => setHometown(hometown === c ? null : c)}
                className={clsx('brut-sm rounded-full px-4 py-2 font-display text-sm font-bold transition', hometown === c ? 'bg-lilac text-white' : 'bg-white hover:bg-lilac-soft')}
              >
                {CITIES[c].name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:sticky lg:top-28">
        <div className="relative">
          <TaxReceipt tax={tax} delay={0.4} onStub={go} />
        </div>
        <p className="mt-14 text-center text-sm text-ink-soft">
          <Mark>Not a rupee extra.</Mark> 10% of tax you already pay <InfoTip>{TEN_PERCENT_NOTE}</InfoTip>
        </p>
        <div className="mt-6 grid gap-3">
          <Button variant="marigold" className="w-full py-4 text-base" onClick={go} disabled={tax <= 0}>
            Pick projects for my {rupees(Math.round(tax * 0.1))} <ArrowRight className="h-5 w-5" />
          </Button>
          <Link
            to="/essentials"
            onClick={() => store.setup(tax, city, hometown)}
            className="inline-flex items-center justify-center gap-2 rounded-full py-2 text-sm font-semibold text-ink-soft hover:text-ink"
          >
            <PieChart className="h-4 w-4" /> Peek at where the other 90% goes
          </Link>
        </div>
      </div>
    </div>
  )
}
