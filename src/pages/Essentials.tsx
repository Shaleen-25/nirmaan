import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Database, PlugZap } from 'lucide-react'
import { Card, Donut, PageHeader, Pill } from '../components/ui'
import { BUDGET_YEAR, CAPEX_CR, RUPEE_COMES_FROM, RUPEE_GOES_TO, TOTAL_EXPENDITURE_CR } from '../data/budget'
import { useStore } from '../store'
import { compact, crore, rupees } from '../lib/format'

export default function Essentials() {
  const { tax } = useStore()
  const [active, setActive] = useState<string | null>('states')
  if (!tax) return null
  const base = tax.essential
  const sel = RUPEE_GOES_TO.find((h) => h.id === active) ?? RUPEE_GOES_TO[0]

  return (
    <div>
      <PageHeader
        eyebrow="The 90% · Essentials"
        title="Where your 90% goes"
        sub={
          <>
            Your <strong className="text-ink">{rupees(base)}</strong> mapped onto the Union Budget {BUDGET_YEAR}: how every rupee of central spending
            is divided.
          </>
        }
        right={
          <Pill soft="#E8ECFB" color="#2B4ACB">
            <Database className="h-3.5 w-3.5" /> Union Budget {BUDGET_YEAR} · BE
          </Pill>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <Card className="flex flex-col items-center p-6 sm:p-8">
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
              className="mt-8 w-full rounded-2xl bg-paper p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold">{sel.label}</h3>
                <span className="text-sm font-semibold" style={{ color: sel.color === '#0E1330' ? '#0E1330' : sel.color }}>
                  {sel.paise} paise / ₹1
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">{sel.blurb}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {sel.examples.map((e) => (
                  <span key={e} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium">{e}</span>
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
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${on ? 'bg-paper' : ''}`}
                  >
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: h.color }} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{h.label}</span>
                      <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-line">
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
          <div className="mt-5 flex h-10 overflow-hidden rounded-xl">
            {RUPEE_COMES_FROM.map((r, i) => (
              <motion.div
                key={r.label}
                title={`${r.label}: ${r.paise}p`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-center border-r-2 border-white text-[11px] font-bold last:border-r-0"
                style={{
                  width: `${r.paise}%`,
                  background: r.highlight ? '#FF8A1F' : i % 2 ? '#E6E8F0' : '#D3D7E6',
                  color: r.highlight ? '#fff' : '#2A3052',
                }}
              >
                {r.paise >= 6 ? `${r.paise}p` : ''}
              </motion.div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            {RUPEE_COMES_FROM.map((r) => (
              <span key={r.label} className={r.highlight ? 'font-bold text-saffron' : ''}>
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
        <Link to="/build" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-saffron px-5 py-3 text-sm font-semibold text-white">
          Now, build with your 10% <ArrowRight className="h-4 w-4" />
        </Link>
      </Card>
    </div>
  )
}
