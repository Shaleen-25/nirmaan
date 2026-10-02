import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Check, Loader2, ShieldCheck } from 'lucide-react'
import { Button, Card, Eyebrow } from '../components/ui'
import { CITIES, PAN_REGEX, PERSONAS } from '../data/personas'
import { useStore } from '../store'
import { compact } from '../lib/format'

type Step = 'pan' | 'otp' | 'fetching'

export default function Login() {
  const { login } = useStore()
  const navigate = useNavigate()
  const [pan, setPan] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<Step>('pan')
  const valid = PAN_REGEX.test(pan)

  useEffect(() => {
    if (step !== 'fetching') return
    const t = setTimeout(() => {
      login(pan)
      navigate('/promo/you')
    }, 2200)
    return () => clearTimeout(t)
  }, [step, pan, login, navigate])

  return (
    <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
      <div className="pt-2">
        <Eyebrow>Demo login</Eyebrow>
        <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">Log in with your PAN.</h1>
        <p className="mt-4 text-muted">
          In the real product, your income and tax would come from your e-filing profile with your consent. In this demo, pick a sample
          taxpayer below, or type any PAN-format ID.
        </p>
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-dashed border-saffron/50 bg-saffron-soft/50 p-4 text-sm">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-saffron" />
          <p>
            <strong>Please don't enter your real PAN.</strong> This is a concept demo. Nothing is sent anywhere, and everything stays in your
            browser.
          </p>
        </div>
      </div>

      <Card className="p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {step === 'pan' && (
            <motion.div key="pan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <label htmlFor="pan" className="text-sm font-semibold">PAN</label>
              <input
                id="pan"
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))}
                placeholder="ABCPR4821K"
                autoComplete="off"
                className="mt-2 w-full rounded-2xl border border-line bg-paper px-4 py-4 font-mono text-2xl tracking-[0.2em] outline-none transition focus:border-ink"
              />
              <p className="mt-2 h-4 text-xs text-muted">
                {pan.length === 10 && !valid ? 'Use an individual PAN format: 5 letters (4th is P), 4 digits, 1 letter.' : ''}
              </p>
              <Button className="mt-3 w-full py-4" disabled={!valid} onClick={() => setStep('otp')}>
                Send OTP <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Or pick a sample taxpayer</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {PERSONAS.map((p) => (
                    <button
                      key={p.pan}
                      onClick={() => setPan(p.pan)}
                      className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${pan === p.pan ? 'border-ink bg-paper' : 'border-line hover:border-ink/30'}`}
                    >
                      <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${p.avatar}`}>
                        {p.name.replace('Dr. ', '').split(' ').map((w) => w[0]).join('')}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{p.name}</span>
                        <span className="block truncate text-xs text-muted">
                          {p.locality}, {CITIES[p.city].name} · {compact(p.income)}/yr
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <p className="text-sm text-muted">OTP sent to the mobile linked with <span className="font-mono font-semibold text-ink">{pan}</span></p>
              <label htmlFor="otp" className="mt-5 block text-sm font-semibold">Enter OTP</label>
              <input
                id="otp"
                inputMode="numeric"
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="••••••"
                className="mt-2 w-full rounded-2xl border border-line bg-paper px-4 py-4 text-center font-mono text-3xl tracking-[0.6em] outline-none focus:border-ink"
              />
              <button onClick={() => setOtp('260427')} className="mt-2 text-xs font-semibold text-saffron">
                Demo: auto-fill OTP
              </button>
              <Button className="mt-5 w-full py-4" disabled={otp.length !== 6} onClick={() => setStep('fetching')}>
                Verify & continue <ArrowRight className="h-4 w-4" />
              </Button>
              <button onClick={() => setStep('pan')} className="mt-3 w-full text-center text-sm text-muted">
                Change PAN
              </button>
            </motion.div>
          )}

          {step === 'fetching' && (
            <motion.div key="fetch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6">
              <h2 className="text-2xl font-bold">Setting up your Nirmaan account</h2>
              <ul className="mt-6 space-y-4">
                {['Verifying PAN', 'Fetching income & tax profile (simulated)', 'Locating your ward & state', 'Reserving your 10% Nirmaan share'].map((t, i) => (
                  <FetchRow key={t} label={t} delay={i * 0.5} />
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}

function FetchRow({ label, delay }: { label: string; delay: number }) {
  const [done, setDone] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setDone(true), delay * 1000 + 450)
    return () => clearTimeout(t)
  }, [delay])
  return (
    <motion.li initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="flex items-center gap-3">
      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${done ? 'bg-leaf text-white' : 'bg-line text-muted'}`}>
        {done ? <Check className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />}
      </span>
      <span className={done ? 'font-medium' : 'text-muted'}>{label}</span>
    </motion.li>
  )
}
