import { useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { toPng } from 'html-to-image'
import { ArrowRight, Check, Download, Landmark, Loader2 } from 'lucide-react'
import { Button, Card, LinkedInIcon } from '../components/ui'
import { ProjectIcon } from '../components/ProjectIcon'
import { PROJECTS, TIERS } from '../data/projects'
import { CITIES } from '../data/personas'
import { useStore } from '../store'
import { compact, rupees, txHash } from '../lib/format'

const STEPS = [
  'Signing your allocation (Aadhaar OTP, simulated)',
  'Minting purpose-bound e₹ on the RBI rail',
  'Locking funds in project escrow wallets',
  'Issuing your Nation Builder certificate',
]

export default function Confirm() {
  const { persona, allocations, allocated, confirm, confirmation } = useStore()
  const [step, setStep] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const done = step >= STEPS.length

  useEffect(() => {
    if (allocated > 0) confirm()
  }, [])

  useEffect(() => {
    if (done) return
    const t = setTimeout(() => setStep((s) => s + 1), 1100)
    return () => clearTimeout(t)
  }, [step, done])

  if (!persona) return null
  if (allocated === 0 && !confirmation) return <Navigate to="/build" replace />

  const picks = Object.entries(confirmation?.allocations ?? allocations)
    .map(([id, amt]) => ({ p: PROJECTS.find((x) => x.id === id)!, amt }))
    .filter((x) => x.p && x.amt > 0)
    .sort((a, b) => b.amt - a.amt)
  const total = picks.reduce((a, b) => a + b.amt, 0)
  const firstName = persona.name.replace('Dr. ', '').split(' ')[0]
  const city = CITIES[persona.city]

  const download = async () => {
    if (!cardRef.current) return
    const url = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true })
    const a = document.createElement('a')
    a.href = url
    a.download = 'nirmaan-nation-builder.png'
    a.click()
  }
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`

  return (
    <div className="mx-auto max-w-4xl">
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key="mint" exit={{ opacity: 0, scale: 0.98 }} className="grid items-center gap-10 py-6 md:grid-cols-2">
            <div className="relative mx-auto flex h-72 w-72 items-center justify-center">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-saffron/40"
                  animate={{ scale: [0.6, 1.15], opacity: [0.8, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.7 }}
                />
              ))}
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-saffron to-[#E86A00] font-display text-5xl font-extrabold text-white shadow-[0_20px_60px_-15px_rgba(255,138,31,.8)]"
              >
                e₹
              </motion.div>
            </div>
            <div>
              <p className="text-sm font-semibold text-saffron">Minting {rupees(total)}</p>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Turning your tax into tracked e-Rupee</h1>
              <ul className="mt-8 space-y-4">
                {STEPS.map((s, i) => (
                  <li key={s} className="flex items-center gap-3">
                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${i < step ? 'bg-leaf text-white' : i === step ? 'bg-saffron-soft text-saffron' : 'bg-line text-muted'}`}>
                      {i < step ? <Check className="h-4 w-4" /> : i === step ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="text-xs">{i + 1}</span>}
                    </span>
                    <span className={i <= step ? 'font-medium' : 'text-muted'}>{s}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 space-y-2">
                {picks.slice(0, Math.min(step + 1, picks.length)).map(({ p, amt }) => (
                  <motion.div key={p.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-xs ring-1 ring-line">
                    <span className="truncate font-medium">{p.title}</span>
                    <span className="ml-3 shrink-0 font-mono text-leaf">{txHash(p.id + amt, 8)}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-4">
            <Confetti />
            <div className="text-center">
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }} className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-leaf text-white">
                <Check className="h-8 w-8" />
              </motion.span>
              <h1 className="mt-5 text-4xl font-extrabold sm:text-6xl">You're building India, {firstName}.</h1>
              <p className="mx-auto mt-3 max-w-xl text-muted">
                {rupees(total)} is now purpose-bound e-Rupee across {picks.length} project{picks.length > 1 ? 's' : ''}. Every hop will show up in My Impact.
              </p>
            </div>

            <div className="mt-10 grid items-start gap-6 md:grid-cols-[1fr_auto]">
              {/* Share card */}
              <div ref={cardRef} className="relative mx-auto w-full max-w-md overflow-hidden rounded-[28px] bg-ink p-7 text-white">
                <div className="tricolor absolute inset-x-0 top-0 h-1.5" />
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-saffron/25 blur-3xl" />
                <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-leaf/25 blur-3xl" />
                <div className="relative">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-saffron">Nation Builder · FY 2026-27</p>
                  <p className="mt-4 font-display text-3xl font-extrabold leading-tight">
                    {persona.name} is building India with {compact(total)}
                  </p>
                  <p className="mt-1 text-sm text-white/60">{persona.locality}, {city.name}</p>
                  <ul className="mt-6 space-y-2.5">
                    {picks.slice(0, 4).map(({ p, amt }) => (
                      <li key={p.id} className="flex items-center gap-3 rounded-2xl bg-white/[0.07] p-2.5">
                        <ProjectIcon project={p} size="sm" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{p.title}</span>
                          <span className="block text-[11px] text-white/50">{TIERS[p.tier].label}</span>
                        </span>
                        <span className="text-sm font-bold">{compact(amt)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center justify-between text-xs text-white/60">
                    <span className="font-display text-base font-extrabold text-white">Nirmaan</span>
                    <span>#MyTaxMySay</span>
                  </div>
                </div>
              </div>

              <Card className="flex flex-col gap-3 p-5 md:w-64">
                <p className="text-sm font-semibold">Share your pride</p>
                <Button variant="outline" onClick={download}><Download className="h-4 w-4" /> Download card</Button>
                <a href={shareUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0A66C2] px-5 py-3 text-sm font-semibold text-white">
                  <LinkedInIcon className="h-4 w-4" /> Share on LinkedIn
                </a>
                <Link to="/impact" className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
                  Track my rupees <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="mt-1 flex items-start gap-2 text-[11px] text-muted">
                  <Landmark className="h-3.5 w-3.5 shrink-0" /> Simulated e₹ transactions. No real money moved.
                </p>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Confetti() {
  const colors = ['#FF8A1F', '#19A35B', '#2B4ACB', '#0E1330']
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 70 }).map((_, i) => {
        const left = (i * 37) % 100
        const delay = (i % 10) * 0.05
        return (
          <motion.span
            key={i}
            className="absolute top-0 block h-3 w-1.5 rounded-sm"
            style={{ left: `${left}%`, background: colors[i % colors.length] }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{ y: '105vh', opacity: [1, 1, 0], rotate: 360 + i * 20, x: ((i % 7) - 3) * 30 }}
            transition={{ duration: 2.4 + (i % 5) * 0.3, delay, ease: 'easeIn' }}
          />
        )
      })}
    </div>
  )
}
