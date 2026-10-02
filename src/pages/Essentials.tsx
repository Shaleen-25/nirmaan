import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Database, PlugZap } from 'lucide-react'
import { Card, Donut, PageHeader, Pill } from '../components/ui'
import { BUDGET_YEAR, CAPEX_CR, RUPEE_COMES_FROM, RUPEE_GOES_TO, TOTAL_EXPENDITURE_CR } from '../data/budget'
import { useStore } from '../store'
import { compact, crore, rupees } from '../lib/format'

export default function Essentials() {
  const { taxPaid, budget } = useStore()
  const [active, setActive] = useState<string | null>('states')
  if (!taxPaid) return null
  const base = taxPaid - budget
  const sel = RUPEE_GOES_TO.find((h) => h.id === active) ?? RUPEE_GOES_TO[0]

  return (
    <div>
      <PageHeader
        eyebrow="The other 90% · Essentials"
        dot="#3D5AFE"
        title={<>Where your <span className="text-chakra">90%</span> goes</>}
        sub={
          <>
            Your <strong className="text-ink">{rupees(base)}</strong> mapped onto the Union Budget {BUDGET_YEAR}: how every rupee of central spending
            is divided. Nirmaan never touches these essentials: your say is only over the discretionary 10%.
          </>
        }
        right={
          <Pill soft="#E2E7FF">
            <Database className="h-3.5 w-3.5" /> Union Budget {BUDGET_YEAR} · BE
          </Pill>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <Card className="flex flex-col items-center p-6 sm:p-8" tone="sky">
          <Donut
            size={280}
            thickness={34}
            active={active}
            onHover={(id) => id && setActive(id)}
            segments={RUPEE_GOES_TO.map((h) => ({ id: h.id, value: h.paise, color: h.color }))}
          >
            <AnimatePresence mode="wait">
              <motion.div key={sel.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="px-10">
                <p className="font-display text-3xl font-extrabold tabular">{compact((base * sel.paise) / 100)}</p>
                <p className="mt-1 text-xs leading-tight text-muted">{sel.label}</p>
              </motion.div>
            </AnimatePresence>
          </Donut>

          <AnimatePresence mode="wait">
            <motion.div
              key={sel.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="brut-sm mt-8 w-full rounded-2xl bg-white p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold">{sel.label}</h3>
                <span className="rounded-full border-[1.5px] border-ink px-2 py-0.5 font-mono text-xs font-bold" style={{ background: sel.color, color: sel.color === '#16130F' ? '#fff' : '#16130F' }}>
                  {sel.paise} paise / ₹1
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">{sel.blurb}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {sel.examples.map((e) => (
                  <span key={e} className="rounded-full border-[1.5px] border-ink bg-paper px-2.5 py-1 text-xs font-semibold">{e}</span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </Card>

        <Card className="p-3 sm:p-4">
          <ul>
            {RUPEE_GOES_TO.map((h) => {
              const amt = (base * h.paise) / 100
              const on = active === h.id
              return (
                <li key={h.id}>
                  <button
                    onMouseEnter={() => setActive(h.id)}
                    onClick={() => setActive(h.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl border-2 px-3 py-3 text-left transition ${on ? 'border-ink bg-marigold-soft' : 'border-transparent'}`}
                  >
                    <span className="h-3.5 w-3.5 shrink-0 rounded-full border-[1.5px] border-ink" style={{ background: h.color }} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{h.label}</span>
                      <span className="mt-1.5 block h-2.5 overflow-hidden rounded-full border-[1.5px] border-ink bg-white">
                        <motion.span
                          className="block h-full rounded-full"
                          style={{ background: h.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(h.paise / 22) * 100}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </span>
                    </span>
                    <span className="w-24 text-right">
                      <span className="block text-sm font-bold tabular">{rupees(amt)}</span>
                      <span className="block text-[11px] text-muted">{h.paise}%</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-bold">Where the rupee comes from</h3>
          <p className="mt-1 text-sm text-muted">Income tax payers fund 21 paise of every rupee the Centre raises. That's you.</p>
          <div className="mt-5 flex h-11 overflow-hidden rounded-xl border-2 border-ink">
            {RUPEE_COMES_FROM.map((r, i) => (
              <motion.div
                key={r.label}
                title={`${r.label}: ${r.paise}p`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-center border-r-2 border-ink text-[11px] font-bold last:border-r-0"
                style={{
                  width: `${r.paise}%`,
                  background: r.highlight ? '#FF4F8B' : i % 2 ? '#FFFFFF' : '#FFF1C7',
                  color: r.highlight ? '#fff' : '#16130F',
                }}
              >
                {r.paise >= 6 ? `${r.paise}p` : ''}
              </motion.div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            {RUPEE_COMES_FROM.map((r) => (
              <span key={r.label} className={r.highlight ? 'font-bold text-pink' : ''}>
                {r.label} {r.paise}p
              </span>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-bold">The big picture</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Total spending</dt><dd className="font-bold">{crore(TOTAL_EXPENDITURE_CR)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Capital expenditure</dt><dd className="font-bold">{crore(CAPEX_CR)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Your 90%, per day</dt><dd className="font-bold">{rupees(base / 365)}</dd></div>
          </dl>
        </Card>
      </div>

      <Card className="mt-4 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <PlugZap className="mt-0.5 h-5 w-5 shrink-0 text-chakra" />
          <p className="text-sm text-muted">
            <strong className="text-ink">Data:</strong> Union Budget {BUDGET_YEAR}, Budget at a Glance (Budget Estimates). Your share is applied
            proportionally for illustration. <strong className="text-ink">Roadmap:</strong> live feeds from PFMS and Open Budgets India so this
            updates as money is actually spent.
          </p>
        </div>
        <Link to="/build" className="brut-sm press inline-flex shrink-0 items-center gap-2 rounded-full bg-marigold px-5 py-3 font-display text-sm font-bold">
          Now, build with your 10% <ArrowRight className="h-4 w-4" />
        </Link>
      </Card>
    </div>
  )
}
