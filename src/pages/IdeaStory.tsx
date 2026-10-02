import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import clsx from 'clsx'
import { ArrowLeft, ArrowRight, Camera, Check, Footprints, Heart, Landmark, Link2, MapPin, Pause, Play, Stamp } from 'lucide-react'
import { Card, Eyebrow, InstagramIcon, LinkedInIcon, Sticker, WhatsAppIcon, XIcon } from '../components/ui'

const SCENE_MS = 6500

const SCENES: { tag: string; title: string; body: string; color: string; Visual: () => ReactNode }[] = [
  {
    tag: 'Pitch it',
    title: 'Got a problem on your street? Pitch the fix in 60 seconds.',
    body: 'Say what you want built, where, and why. Add a photo. That’s it: no forms in triplicate, no office visits.',
    color: '#9B6BFF',
    Visual: PitchScene,
  },
  {
    tag: 'Make it a campaign',
    title: 'Your idea becomes a campaign page.',
    body: 'Like a fundraiser, but for votes instead of money. Share it on WhatsApp, Instagram, LinkedIn: wherever your people are.',
    color: '#FF4F8B',
    Visual: CampaignScene,
  },
  {
    tag: 'Rally your people',
    title: 'Neighbours with the same problem vouch for it.',
    body: 'Every vouch is a verified Nirmaan taxpayer: one PAN, one vouch. Your RWA group, your running club, your office floor.',
    color: '#FFC22E',
    Visual: RallyScene,
  },
  {
    tag: 'Climb the board',
    title: 'Vouches push your idea up the national leaderboard.',
    body: 'Ideas are ranked by verified vouches, city by city and across India. 1,000 vouches gets a ward response; 25,000 reaches the Union Budget table.',
    color: '#3D5AFE',
    Visual: LeaderboardScene,
  },
  {
    tag: 'Land on the govt’s desk',
    title: 'When the next Budget is planned, your idea is already on the list.',
    body: 'Government teams start from a ranked inventory of what citizens want. Shortlisted ideas get a feasibility study, then go live on Nirmaan for funding.',
    color: '#17B26A',
    Visual: GovScene,
  },
]

export default function IdeaStory() {
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(true)
  const scene = SCENES[i]

  useEffect(() => {
    if (!playing) return
    const t = setTimeout(() => setI((x) => (x + 1) % SCENES.length), SCENE_MS)
    return () => clearTimeout(t)
  }, [i, playing])

  const go = (n: number) => setI((n + SCENES.length) % SCENES.length)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link to="/ideas" className="inline-flex items-center gap-1.5 font-display text-sm font-bold text-ink-soft hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Idea board
        </Link>
        <Sticker tone="marigold" rotate={2}>Preview · pitching opens soon</Sticker>
      </div>

      {/* story progress bars */}
      <div className="mb-6 flex gap-1.5">
        {SCENES.map((s, n) => (
          <button key={s.tag} onClick={() => go(n)} className="h-3 flex-1 overflow-hidden rounded-full border-2 border-ink bg-white" aria-label={`Go to step ${n + 1}: ${s.tag}`}>
            <motion.div
              key={`${n}-${i}-${playing}`}
              className="h-full"
              style={{ background: s.color }}
              initial={{ width: n < i ? '100%' : '0%' }}
              animate={{ width: n <= i ? '100%' : '0%' }}
              transition={{ duration: n === i && playing ? SCENE_MS / 1000 : 0.2, ease: 'linear' }}
            />
          </button>
        ))}
      </div>

      <Card size="lg" className="overflow-hidden">
        <div className="grid min-h-[560px] lg:grid-cols-[1fr_1.15fr]">
          <div className="flex flex-col p-7 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.35 }}>
                <Eyebrow dot={scene.color}>Step {i + 1} of {SCENES.length} · {scene.tag}</Eyebrow>
                <h1 className="mt-4 text-4xl font-extrabold leading-[0.95] sm:text-5xl">{scene.title}</h1>
                <p className="mt-4 text-lg text-ink-soft">{scene.body}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-auto flex items-center gap-2 pt-8">
              <button onClick={() => go(i - 1)} className="brut-sm press inline-flex h-11 w-11 items-center justify-center rounded-full bg-white" aria-label="Previous step">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button onClick={() => setPlaying((p) => !p)} className="brut-sm press inline-flex h-11 w-11 items-center justify-center rounded-full bg-white" aria-label={playing ? 'Pause' : 'Play'}>
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              <button onClick={() => go(i + 1)} className="brut-sm press inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-display font-bold text-white">
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center overflow-hidden border-t-2 border-ink p-6 sm:p-10 lg:border-l-2 lg:border-t-0" style={{ background: scene.color }}>
            <div className="bg-dots absolute inset-0 opacity-30" />
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                className="relative w-full max-w-md"
              >
                <scene.Visual />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Card>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link to="/ideas" className="brut press flex items-center justify-between rounded-[22px] bg-white p-5">
          <span>
            <span className="block font-display text-lg font-extrabold">Vouch for ideas already live</span>
            <span className="text-sm text-ink-soft">14 ideas are collecting vouches right now</span>
          </span>
          <ArrowRight className="h-5 w-5" />
        </Link>
        <Link to="/build" className="brut press flex items-center justify-between rounded-[22px] bg-marigold p-5">
          <span>
            <span className="block font-display text-lg font-extrabold">Back a listed project today</span>
            <span className="text-sm text-ink-soft">Put your 10% to work while ideas brew</span>
          </span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  )
}

/* ───────────────────────── Scenes ───────────────────────── */

function Typed({ text, delay = 0, speed = 32 }: { text: string; delay?: number; speed?: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined
    const start = setTimeout(() => {
      id = setInterval(() => setN((x) => (x >= text.length ? x : x + 1)), speed)
    }, delay)
    return () => {
      clearTimeout(start)
      if (id) clearInterval(id)
    }
  }, [text, delay, speed])
  return (
    <>
      {text.slice(0, n)}
      {n < text.length && n > 0 && <span className="ml-px inline-block h-4 w-0.5 animate-pulse bg-ink align-middle" />}
    </>
  )
}

function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="brut-lg mx-auto w-full max-w-[330px] rounded-[38px] bg-ink p-2.5">
      <div className="relative overflow-hidden rounded-[30px] bg-paper">
        <div className="mx-auto mt-2 h-5 w-24 rounded-full bg-ink" />
        <div className="p-4 pt-3">{children}</div>
      </div>
    </div>
  )
}

function Field({ label, children, delay }: { label: string; children: ReactNode; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delay / 1000 }} className="mb-2.5">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-muted">{label}</p>
      <div className="min-h-9 rounded-xl border-2 border-ink bg-white px-3 py-2 text-sm font-semibold">{children}</div>
    </motion.div>
  )
}

function PitchScene() {
  return (
    <Phone>
      <p className="font-display text-lg font-extrabold">New idea</p>
      <Field label="What should we build?" delay={200}>
        <Typed text="Joggers Park for Gachibowli" delay={300} />
      </Field>
      <Field label="Where?" delay={1300}>
        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-pink" /><Typed text="Gachibowli, Greater Hyderabad" delay={1400} /></span>
      </Field>
      <Field label="Why does it matter?" delay={2500}>
        <span className="text-xs font-medium leading-snug">
          <Typed text="Thousands of us run on the road at 6am. We need a safe, lit 3 km track." delay={2600} speed={22} />
        </span>
      </Field>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.3 }} className="flex flex-wrap gap-1.5">
        {['Sports & Play', 'Health', 'Local'].map((c, n) => (
          <span key={c} className={clsx('rounded-full border-2 border-ink px-2.5 py-0.5 text-[11px] font-bold', n === 0 ? 'bg-marigold' : 'bg-white')}>{c}</span>
        ))}
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 4.8 }} className="mt-3 flex h-16 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/50 bg-white text-xs font-semibold text-muted">
        <Camera className="h-4 w-4" /> photo_of_the_road.jpg ✓
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 5.3 }} className="mt-3 rounded-full border-2 border-ink bg-ink py-2.5 text-center font-display text-sm font-bold text-white">
        Post idea →
      </motion.div>
    </Phone>
  )
}

function CampaignScene() {
  const shares = [
    { Icon: WhatsAppIcon, bg: '#25D366', label: 'WhatsApp' },
    { Icon: InstagramIcon, bg: '#E1306C', label: 'Instagram' },
    { Icon: LinkedInIcon, bg: '#0A66C2', label: 'LinkedIn' },
    { Icon: XIcon, bg: '#16130F', label: 'X' },
  ]
  return (
    <div className="relative">
      <div className="brut-lg overflow-hidden rounded-[26px] bg-white">
        <div className="relative h-32 border-b-2 border-ink bg-saffron">
          <div className="bg-dots absolute inset-0 opacity-30" />
          <Footprints className="absolute -bottom-6 right-4 h-36 w-36 rotate-[-12deg] text-white/35" />
          <span className="absolute left-4 top-4 rounded-full border-2 border-ink bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase">Campaign</span>
        </div>
        <div className="p-5">
          <h3 className="text-2xl font-extrabold leading-tight">Joggers Park for Gachibowli</h3>
          <p className="mt-1 text-xs text-muted">by Sneha · Kondapur · Sports & Play</p>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-display text-xl font-extrabold">0 vouches</span>
            <span className="font-mono text-[11px] text-muted">goal 5,000</span>
          </div>
          <div className="mt-1.5 h-3 rounded-full border-2 border-ink bg-paper" />
          <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-muted">Share your campaign</p>
          <div className="mt-2 flex gap-2">
            {shares.map(({ Icon, bg, label }, n) => (
              <motion.span
                key={label}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.15, 1] }}
                transition={{ delay: 0.5 + n * 0.25 }}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink text-white"
                style={{ background: bg }}
                title={label}
              >
                <Icon className="h-5 w-5" />
              </motion.span>
            ))}
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }} className="inline-flex h-11 items-center gap-1 rounded-full border-2 border-ink bg-white px-3 text-xs font-bold">
              <Link2 className="h-4 w-4" /> Copy
            </motion.span>
          </div>
        </div>
      </div>
      {/* where it got shared */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {['RWA WhatsApp group', 'Morning Runners', 'Office floor', '@sneha.runs story'].map((t, n) => (
          <motion.span
            key={t}
            initial={{ opacity: 0, y: 12, scale: 0.8, rotate: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: n % 2 ? 2 : -2 }}
            transition={{ delay: 2.2 + n * 0.55, type: 'spring', stiffness: 300, damping: 16 }}
            className="brut-sm inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-bold"
          >
            <Check className="h-3.5 w-3.5 text-leaf" /> Sent to {t}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

function RallyScene() {
  const [v, setV] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setV((x) => Math.min(3812, x + Math.ceil((3812 - x) / 14) + 7)), 70)
    return () => clearInterval(id)
  }, [])
  const toasts = [
    'Priya from Kondapur vouched',
    'Gachibowli Morning Runners shared it with 2.4K members',
    '86 vouches from Lakeview Towers RWA',
    'Ravi from Madhapur vouched',
  ]
  const avatars = ['#FF4F8B', '#3D5AFE', '#17B26A', '#9B6BFF', '#FF7A1A', '#00A6A6', '#16130F']
  return (
    <div className="space-y-4">
      <div className="brut-lg rounded-[26px] bg-white p-6 text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-muted">Verified vouches</p>
        <p className="font-display text-7xl font-extrabold tabular tracking-tight">{v.toLocaleString('en-IN')}</p>
        <div className="mt-3 h-4 overflow-hidden rounded-full border-2 border-ink bg-paper">
          <motion.div className="h-full bg-pink" animate={{ width: `${(v / 5000) * 100}%` }} />
        </div>
        <div className="mt-4 flex justify-center -space-x-2">
          {avatars.map((c, n) => (
            <motion.span
              key={c}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + n * 0.25, type: 'spring' }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink text-xs font-bold text-white"
              style={{ background: c }}
            >
              {'PRASNKV'[n]}
            </motion.span>
          ))}
          <span className="inline-flex h-9 items-center rounded-full border-2 border-ink bg-marigold px-2.5 text-xs font-bold">+3.8K</span>
        </div>
      </div>
      <div className="space-y-2">
        {toasts.map((t, n) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + n * 1.1, type: 'spring' }}
            className="brut-sm flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-semibold"
          >
            <Heart className="h-4 w-4 shrink-0 fill-pink text-pink" /> {t}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const BOARD = [
  { id: 'dogs', t: 'Humane stray-dog shelters', v: '48,210' },
  { id: 'bus', t: 'A bus every 10 minutes', v: '41,870' },
  { id: 'creche', t: 'Crèches at metro stations', v: '22,140' },
  { id: 'isl', t: 'Sign Language in schools', v: '12,760' },
  { id: 'skate', t: 'Skate parks under flyovers', v: '9,640' },
  { id: 'cinema', t: 'Open-air cinema nights', v: '6,930' },
]

function LeaderboardScene() {
  const [climbed, setClimbed] = useState(0)
  useEffect(() => {
    const ts = [900, 1900, 2900].map((ms, n) => setTimeout(() => setClimbed(n + 1), ms))
    return () => ts.forEach(clearTimeout)
  }, [])
  // "yours" starts at the bottom and climbs three places, within Hyderabad's board
  const rows = [...BOARD.slice(2)]
  const mine = { id: 'mine', t: 'Joggers Park for Gachibowli', v: ['2,140', '7,020', '10,480', '13,900'][climbed] }
  const pos = rows.length - climbed
  const order = [...rows.slice(0, pos), mine, ...rows.slice(pos)]
  return (
    <div className="brut-lg rounded-[26px] bg-white p-4">
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="font-display text-lg font-extrabold">Leaderboard · All India</p>
        <span className="font-mono text-[10px] text-muted">live</span>
      </div>
      <ol className="space-y-2">
        {order.map((r, n) => (
          <motion.li
            layout
            key={r.id}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className={clsx('flex items-center gap-3 rounded-xl border-2 border-ink px-3 py-2', r.id === 'mine' ? 'z-10 bg-marigold shadow-[3px_3px_0_#16130F]' : 'bg-paper')}
          >
            <span className="w-6 font-display text-lg font-extrabold">{n + 3}</span>
            <span className="flex-1 truncate text-sm font-bold">{r.t}</span>
            <span className="font-mono text-xs">{r.v}</span>
          </motion.li>
        ))}
      </ol>
      <AnimatePresence>
        {climbed === 3 && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-center font-hand text-lg text-pink">
            ↑ 3 places this week!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function GovScene() {
  const [stamped, setStamped] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setStamped(true), 2000)
    return () => clearTimeout(t)
  }, [])
  const rows = [
    { t: 'Humane stray-dog shelters', v: '48,210', s: 'Shortlisted' },
    { t: 'A bus every 10 minutes', v: '41,870', s: 'Shortlisted' },
    { t: 'Crèches at metro stations', v: '22,140', s: 'Feasibility' },
    { t: 'Joggers Park for Gachibowli', v: '13,900', s: 'mine' },
  ]
  return (
    <div className="relative">
      <div className="brut-lg overflow-hidden rounded-[22px] bg-white">
        <div className="flex items-center justify-between border-b-2 border-ink bg-chakra px-4 py-3 text-white">
          <span className="flex items-center gap-2 font-display text-sm font-extrabold"><Landmark className="h-4 w-4" /> Idea inventory · Budget 2027-28</span>
          <span className="font-mono text-[10px] text-white/80">1,284 ideas</span>
        </div>
        <div className="divide-y-2 divide-ink/10">
          {rows.map((r, n) => (
            <motion.div
              key={r.t}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + n * 0.2 }}
              className={clsx('flex items-center gap-3 px-4 py-3', r.s === 'mine' && 'bg-marigold-soft')}
            >
              <span className="flex-1 text-sm font-bold">{r.t}</span>
              <span className="font-mono text-xs text-muted">{r.v}</span>
              <span
                className={clsx(
                  'w-24 rounded-full border-[1.5px] border-ink px-2 py-0.5 text-center text-[10px] font-bold uppercase transition-colors',
                  r.s === 'mine' ? (stamped ? 'bg-leaf text-white' : 'bg-white') : r.s === 'Shortlisted' ? 'bg-leaf text-white' : 'bg-chakra-soft',
                )}
              >
                {r.s === 'mine' ? (stamped ? 'Shortlisted' : 'Reviewing…') : r.s}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 2.4, rotate: -30 }}
        animate={{ opacity: 1, scale: 1, rotate: -12 }}
        transition={{ delay: 1.8, type: 'spring', stiffness: 300, damping: 16 }}
        className="pointer-events-none absolute -right-4 top-[192px] flex items-center gap-2 rounded-xl border-[3px] border-[#E4002B] bg-white/90 px-4 py-2 font-display text-2xl font-extrabold uppercase tracking-wide text-[#E4002B]"
      >
        <Stamp className="h-6 w-6" /> Shortlisted
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3 }}
        className="brut-sm mt-6 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold"
      >
        <Check className="h-5 w-5 shrink-0 rounded-full bg-leaf p-0.5 text-white" />
        Next: feasibility study → listed on Nirmaan for funding
      </motion.div>
    </div>
  )
}
