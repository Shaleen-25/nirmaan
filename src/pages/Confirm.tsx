import { useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { toPng } from 'html-to-image'
import { ArrowRight, Check, Download, Landmark, Loader2 } from 'lucide-react'
import { Button, Card, LinkedInIcon, Squiggle } from '../components/ui'
import { ProjectIcon } from '../components/ProjectIcon'
import { PROJECTS, TIERS } from '../data/projects'
import { useStore } from '../store'
import { compact, rupees, txHash } from '../lib/format'

const STEPS = [
  'Signing your allocation (Aadhaar OTP, simulated)',
  'Minting purpose-bound e₹ on the RBI rail',
  'Locking funds in project escrow wallets',
  'Printing your Nation Builder card',
]

export default function Confirm() {
  const { cityInfo, persona, allocations, allocated, confirm, confirmation } = useStore()
  const [step, setStep] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const done = step >= STEPS.length

  // Snapshot the allocation once, on arrival
  useEffect(() => {
    if (allocated > 0) confirm()
  }, [])

  useEffect(() => {
    if (done) return
    const t = setTimeout(() => setStep((s) => s + 1), 1100)
    return () => clearTimeout(t)
  }, [step, done])

  if (allocated === 0 && !confirmation) return <Navigate to="/build" replace />

  const picks = Object.entries(confirmation?.allocations ?? allocations)
    .map(([id, amt]) => ({ p: PROJECTS.find((x) => x.id === id)!, amt }))
    .filter((x) => x.p && x.amt > 0)
    .sort((a, b) => b.amt - a.amt)
  const total = picks.reduce((a, b) => a + b.amt, 0)
  const who = persona?.name ?? 'I'
  const firstName = persona ? persona.name.replace('Dr. ', '').split(' ')[0] : null

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
    <div className="mx-auto max-w-5xl">
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key="mint" exit={{ opacity: 0, scale: 0.98 }} className="grid items-center gap-12 py-6 md:grid-cols-2">
            <div className="relative mx-auto flex h-72 w-72 items-center justify-center">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="absolute inset-0 rounded-full border-[2.5px] border-ink"
                  animate={{ scale: [0.55, 1.15], opacity: [0.9, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.7 }}
                />
              ))}
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="flex h-40 w-40 items-center justify-center rounded-full border-[3px] border-ink bg-marigold font-display text-6xl font-extrabold shadow-[6px_6px_0_#16130F]"
              >
                e₹
              </motion.div>
            </div>
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-pink">Minting {rupees(total)}</p>
              <h1 className="mt-2 text-4xl font-extrabold leading-[0.95] sm:text-5xl">Turning your tax into tracked e-Rupee</h1>
              <ul className="mt-8 space-y-3.5">
                {STEPS.map((s, i) => (
                  <li key={s} className="flex items-center gap-3">
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink ${i < step ? 'bg-leaf text-white' : i === step ? 'bg-marigold' : 'bg-white text-muted'}`}>
                      {i < step ? <Check className="h-4 w-4" /> : i === step ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="text-xs font-bold">{i + 1}</span>}
                    </span>
                    <span className={i <= step ? 'font-semibold' : 'text-muted'}>{s}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 space-y-2">
                {picks.slice(0, Math.min(step + 1, picks.length)).map(({ p, amt }) => (
                  <motion.div key={p.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="brut-sm flex items-center justify-between rounded-xl bg-white px-3 py-2 text-xs">
                    <span className="truncate font-bold">{p.title}</span>
                    <span className="ml-3 shrink-0 font-mono text-leaf">{txHash(p.id + amt, 8)}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-2">
            <Confetti />
            <div className="text-center">
              <motion.span initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', delay: 0.1 }} className="inline-flex h-16 w-16 items-center justify-center rounded-full border-[2.5px] border-ink bg-leaf text-white shadow-[3px_3px_0_#16130F]">
                <Check className="h-8 w-8" />
              </motion.span>
              <h1 className="mt-5 text-5xl font-extrabold leading-[0.92] sm:text-7xl">
                You're{' '}
                <span className="relative inline-block">
                  building India
                  <Squiggle className="absolute -bottom-2 left-0 h-4 w-full" color="#FF4F8B" />
                </span>
                {firstName ? `, ${firstName}` : ''}.
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-ink-soft">
                {rupees(total)} is now purpose-bound e-Rupee across {picks.length} project{picks.length > 1 ? 's' : ''}. Hop on the Money Metro to watch it move.
              </p>
            </div>

            <div className="mt-12 grid items-start gap-8 md:grid-cols-[1fr_auto]">
              {/* Share card */}
              <motion.div initial={{ rotate: 0 }} animate={{ rotate: -2 }} transition={{ delay: 0.4, type: 'spring' }} className="mx-auto w-full max-w-md">
                <div ref={cardRef} className="relative overflow-hidden rounded-[28px] border-[3px] border-ink bg-pink p-7 text-white">
                  <div className="bg-dots absolute inset-0 opacity-20" />
                  <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border-[3px] border-ink bg-marigold" />
                  <div className="relative">
                    <p className="inline-block -rotate-2 rounded-full border-2 border-ink bg-ink px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-marigold">
                      Nation Builder · FY 26-27
                    </p>
                    <p className="mt-5 font-display text-[2rem] font-extrabold leading-[0.95]">
                      {who === 'I' ? "I'm" : `${who} is`} building India with {compact(total)}
                    </p>
                    {cityInfo && <p className="mt-2 font-hand text-lg text-white/90">from {cityInfo.name}, with love</p>}
                    <ul className="mt-5 space-y-2">
                      {picks.slice(0, 4).map(({ p, amt }) => (
                        <li key={p.id} className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-white p-2 text-ink">
                          <ProjectIcon project={p} size="sm" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-bold">{p.title}</span>
                            <span className="block text-[11px] text-muted">{TIERS[p.tier].label}</span>
                          </span>
                          <span className="font-display text-sm font-extrabold">{compact(amt)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="font-display text-xl font-extrabold">Nirmaan<span className="text-marigold">.</span></span>
                      <span className="font-mono text-xs font-bold">#MyTaxMySay</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <Card className="flex flex-col gap-3 p-5 md:w-64">
                <p className="font-display text-lg font-extrabold">Flex it a little</p>
                <Button variant="white" onClick={download}><Download className="h-4 w-4" /> Download card</Button>
                <a href={shareUrl} target="_blank" rel="noreferrer" className="brut-sm press inline-flex items-center justify-center gap-2 rounded-full bg-[#0A66C2] px-5 py-3 font-display text-[15px] font-bold text-white">
                  <LinkedInIcon className="h-4 w-4" /> Share on LinkedIn
                </a>
                <Link to="/track" className="brut-sm press mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-marigold px-5 py-3 font-display text-[15px] font-bold">
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
  const colors = ['#FF4F8B', '#FFC22E', '#3D5AFE', '#17B26A', '#9B6BFF']
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 80 }).map((_, i) => {
        const left = (i * 37) % 100
        const delay = (i % 10) * 0.05
        const round = i % 3 === 0
        return (
          <motion.span
            key={i}
            className={`absolute top-0 block border-[1.5px] border-ink ${round ? 'h-3 w-3 rounded-full' : 'h-4 w-2 rounded-sm'}`}
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
