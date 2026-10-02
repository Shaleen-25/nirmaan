import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Copy, Loader2, Mail, Send } from 'lucide-react'
import { Card, GithubIcon, LinkedInIcon, Sticker } from './ui'
import { OWNER, WEB3FORMS_KEY } from '../config'

const PROMPTS = ['What stops fraud or bribery?', 'Who decides which projects get listed?', 'Is 10% even legal?', 'What if a project fails halfway?']

type Status = 'idle' | 'sending' | 'sent' | 'mailto' | 'error'

/** "Building in public" card with a feedback box that lands in the owner's inbox (no database needed). */
export function BuildInPublic() {
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [copied, setCopied] = useState(false)

  const mailto = () => {
    const body = `${message}\n\n— ${name || 'A Nirmaan visitor'}${email ? ` (${email})` : ''}`
    window.location.href = `mailto:${OWNER.email}?subject=${encodeURIComponent('Nirmaan feedback')}&body=${encodeURIComponent(body)}`
    setStatus('mailto')
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!message.trim()) return
    const honeypot = new FormData(e.currentTarget).get('botcheck')
    if (honeypot) return
    if (!WEB3FORMS_KEY) return mailto()
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: 'Nirmaan feedback',
          from_name: 'Nirmaan site',
          name: name || 'Anonymous visitor',
          email: email || undefined,
          message,
        }),
      })
      const json = await res.json()
      setStatus(json.success ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(OWNER.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked: the address is visible anyway */
    }
  }

  const initials = OWNER.name.split(' ').map((w) => w[0]).join('')

  return (
    <Card size="lg" className="overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_1.15fr]">
        {/* who's building this */}
        <div className="relative border-b-2 border-ink bg-ink p-7 text-white sm:p-10 lg:border-b-0 lg:border-r-2">
          <Sticker tone="marigold" rotate={-4}>Building in public</Sticker>
          <div className="mt-7 flex items-center gap-4">
            <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[2.5px] border-white bg-pink font-display text-2xl font-extrabold">
              {initials}
            </span>
            <div>
              <p className="font-display text-2xl font-extrabold leading-tight">{OWNER.name}</p>
              <p className="text-sm text-white/65">{OWNER.role}</p>
            </div>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-white/85">
            I know this is a far-fetched idea, and edge cases are probably popping up in your head already.{' '}
            <span className="font-hand text-2xl text-marigold">Good. Shoot them my way.</span> I'll fold the best ones into Nirmaan over the coming
            weeks.
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <a href={OWNER.linkedin} target="_blank" rel="noreferrer" className="brut-sm inline-flex items-center gap-2 rounded-full bg-[#0A66C2] px-4 py-2.5 font-display text-sm font-bold text-white">
              <LinkedInIcon className="h-4 w-4" /> Connect on LinkedIn
            </a>
            <a href={`mailto:${OWNER.email}?subject=${encodeURIComponent('Nirmaan')}`} className="brut-sm inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 font-display text-sm font-bold text-ink">
              <Mail className="h-4 w-4" /> Email me
            </a>
            <a href={OWNER.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-4 py-2.5 font-display text-sm font-bold text-white hover:border-white">
              <GithubIcon className="h-4 w-4" /> Code
            </a>
          </div>
          <button onClick={copyEmail} className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-white/60 hover:text-white">
            {copied ? <Check className="h-3.5 w-3.5 text-leaf" /> : <Copy className="h-3.5 w-3.5" />} {OWNER.email}
          </button>
        </div>

        {/* feedback box */}
        <div className="p-7 sm:p-10">
          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <motion.div key="sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex h-full flex-col items-start justify-center">
                <Sticker tone="mint" rotate={-5}><Check className="h-4 w-4" /> Landed in my inbox</Sticker>
                <h3 className="mt-5 text-4xl font-extrabold leading-[0.95]">Thank you. Seriously.</h3>
                <p className="mt-3 text-ink-soft">I read every one of these. If you left your email, I'll write back.</p>
                <button onClick={() => { setMessage(''); setStatus('idle') }} className="mt-6 font-display font-bold text-pink underline-offset-4 hover:underline">
                  Send another
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h3 className="text-3xl font-extrabold leading-[0.95] sm:text-4xl">Poke holes in it. Or pitch something better.</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {PROMPTS.map((p, i) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setMessage(p + ' ')}
                      className="rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-bold transition hover:bg-marigold-soft"
                      style={{ rotate: `${i % 2 ? 1.5 : -1.5}deg` }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <label htmlFor="fb-message" className="sr-only">Your feedback</label>
                <textarea
                  id="fb-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your edge case, idea or hot take…"
                  className="brut-sm mt-5 w-full resize-y rounded-2xl bg-paper p-4 text-base outline-none placeholder:text-muted focus:bg-white"
                />
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    aria-label="Your name"
                    className="rounded-2xl border-2 border-ink bg-white px-4 py-3 text-sm outline-none focus:bg-marigold-soft"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email, if you want a reply"
                    aria-label="Your email"
                    className="rounded-2xl border-2 border-ink bg-white px-4 py-3 text-sm outline-none focus:bg-marigold-soft"
                  />
                </div>
                <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={!message.trim() || status === 'sending'}
                    className="brut-sm press inline-flex items-center gap-2 rounded-full bg-marigold px-6 py-3 font-display font-extrabold disabled:pointer-events-none disabled:opacity-40"
                  >
                    {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Send to {OWNER.name.split(' ')[0]}
                  </button>
                  <p className="text-xs text-muted">
                    {WEB3FORMS_KEY ? 'Goes straight to my inbox. No database, no tracking.' : 'Opens your mail app with your note ready to send.'}
                  </p>
                </div>
                {status === 'mailto' && (
                  <p className="mt-4 rounded-2xl border-2 border-dashed border-ink/30 p-3 text-sm text-ink-soft">
                    Mail app didn't open? Email me at <strong className="text-ink">{OWNER.email}</strong> or DM me on LinkedIn.
                  </p>
                )}
                {status === 'error' && (
                  <p className="mt-4 rounded-2xl border-2 border-pink bg-pink-soft p-3 text-sm">
                    That didn't go through.{' '}
                    <button type="button" onClick={mailto} className="font-bold underline">Send it by email instead</button>
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  )
}
