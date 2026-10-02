import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { Camera, Check, Footprints, Heart, Landmark, Lightbulb, ListOrdered, MapPin, Rocket, Users, type LucideIcon } from 'lucide-react'
import { Bg, BrandIcon, C, Coin, Eyebrow, INK, Sfx, Squiggle, outro, pop, ramp, rise, sp } from '../kit'
import { lineOf, wordAt, type PlacedScene } from '../timeline'

/* ───────────────────────── 11 · Pitch an idea, make it a campaign, rally vouches ───────────────────────── */

const PHONE = { x: 1150, y: 64, w: 580, h: 890 }

function typed(text: string, frame: number, start: number, perChar = 1.3) {
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - start) / perChar)))
  return text.slice(0, n)
}

export function PitchScene({ scene }: { scene: PlacedScene }) {
  const f = useCurrentFrame()
  const line = lineOf(scene, 'pitch')
  const pitchAt = wordAt(scene, 'pitch', 'pitch it')
  const campaignAt = wordAt(scene, 'pitch', 'campaign')
  const societyAt = wordAt(scene, 'pitch', 'society')
  const runningAt = wordAt(scene, 'pitch', 'running')
  const rallyAt = wordAt(scene, 'pitch', 'rally')
  const screen = f < campaignAt ? 0 : f < rallyAt ? 1 : 2
  const vouches = Math.round(ramp(f, [rallyAt + 4, rallyAt + 56], [0, 3812]))

  const steps = [
    { t: 'Post it in 60 seconds', at: pitchAt, n: '1' },
    { t: 'Turn it into a campaign', at: campaignAt, n: '2' },
    { t: 'Rally verified vouches', at: rallyAt, n: '3' },
  ]

  return (
    <Bg color={C.lilac} pattern="dots">
      <AbsoluteFill style={{ opacity: outro(f, scene.duration) }}>
        <div className="absolute" style={{ left: 120, top: 130, width: 940 }}>
          <div style={rise(f, line.from - 6)}>
            <Eyebrow dot={C.marigold} color="#fff">Not on the list?</Eyebrow>
          </div>
          <h2 className="font-display font-extrabold" style={{ fontSize: 150, lineHeight: 0.92, letterSpacing: '-0.045em', color: '#fff', marginTop: 18, ...pop(f, pitchAt - 4, -2, 0.6) }}>
            Pitch your idea.
          </h2>
          <div className="flex flex-col" style={{ gap: 26, marginTop: 56 }}>
            {steps.map((s, i) => (
              <div key={s.t} style={pop(f, s.at, i % 2 ? 1.5 : -1.5)}>
                <span className="inline-flex items-center gap-4 font-display font-extrabold" style={{ fontSize: 46, background: '#fff', color: INK, border: `5px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, borderRadius: 26, padding: '14px 30px' }}>
                  <span className="flex items-center justify-center rounded-full" style={{ width: 54, height: 54, background: C.marigold, border: `4px solid ${INK}`, fontSize: 30 }}>{s.n}</span>
                  {s.t}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* phone */}
        <div className="absolute" style={{ left: PHONE.x, top: PHONE.y, width: PHONE.w, height: PHONE.h, background: INK, borderRadius: 66, border: `6px solid ${INK}`, boxShadow: `18px 18px 0 ${INK}`, padding: 14, ...rise(f, -10, 60) }}>
          <div className="relative h-full overflow-hidden" style={{ borderRadius: 52, background: C.paper }}>
            <div className="mx-auto" style={{ marginTop: 14, width: 150, height: 34, borderRadius: 99, background: INK }} />
            <div className="absolute inset-x-0" style={{ top: 70, bottom: 0, padding: '10px 30px' }}>
              {screen === 0 && <FormScreen f={f} start={line.from} />}
              {screen === 1 && <CampaignScreen f={f} start={campaignAt} society={societyAt} running={runningAt} />}
              {screen === 2 && <VouchScreen f={f} start={rallyAt} vouches={vouches} />}
            </div>
          </div>
        </div>

        {/* floating hearts while vouches pour in */}
        {screen === 2 &&
          Array.from({ length: 9 }).map((_, k) => {
            const t0 = rallyAt + k * 6
            const t = interpolate(f - t0, [0, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            if (t <= 0 || t >= 1) return null
            return (
              <div key={k} className="absolute" style={{ left: PHONE.x + PHONE.w - 30 + Math.sin(k * 2.1) * 60, top: 760 - t * 520, opacity: 1 - t, transform: `scale(${0.7 + (k % 3) * 0.25})` }}>
                <Heart size={56} fill={C.pink} color={INK} strokeWidth={2.2} />
              </div>
            )
          })}
      </AbsoluteFill>
      {steps.map((s) => (
        <Sfx key={s.t} at={s.at} name="pop" volume={0.35} />
      ))}
      {[0, 8, 16, 24, 34, 44].map((d) => (
        <Sfx key={d} at={line.from + 4 + d} name="tick" volume={0.2} />
      ))}
      <Sfx at={societyAt} name="ding" volume={0.25} />
      <Sfx at={runningAt} name="ding" volume={0.25} />
      {[10, 26, 42].map((d) => (
        <Sfx key={d} at={rallyAt + d} name="ding" volume={0.2} />
      ))}
    </Bg>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 16 }}>
      <p className="font-bold uppercase" style={{ fontSize: 15, letterSpacing: '0.08em', color: '#6B645B' }}>{label}</p>
      <div className="font-semibold" style={{ marginTop: 6, minHeight: 58, background: '#fff', border: `4px solid ${INK}`, borderRadius: 16, padding: '12px 16px', fontSize: 23, lineHeight: 1.25, color: INK }}>
        {children}
      </div>
    </div>
  )
}

function FormScreen({ f, start }: { f: number; start: number }) {
  return (
    <div>
      <p className="font-display font-extrabold" style={{ fontSize: 40, color: INK }}>New idea</p>
      <Field label="What should we build?">{typed('Joggers Park for Gachibowli', f, start + 2, 1.1)}</Field>
      <Field label="Where?">
        <span className="flex items-center gap-2"><MapPin size={22} color={C.pink} /> {typed('Gachibowli, Hyderabad', f, start + 34, 1.1)}</span>
      </Field>
      <Field label="Why does it matter?">{typed('Thousands of us run on the road at 6am. We need a safe, lit 3 km track.', f, start + 60, 0.7)}</Field>
      <div className="flex gap-2" style={{ marginTop: 18, ...rise(f, start + 100) }}>
        {['Sports & Play', 'Health', 'Local'].map((c, i) => (
          <span key={c} className="font-bold" style={{ fontSize: 18, border: `3px solid ${INK}`, borderRadius: 99, padding: '4px 14px', background: i === 0 ? C.marigold : '#fff', color: INK }}>{c}</span>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 font-semibold" style={{ marginTop: 18, height: 90, border: '4px dashed rgba(22,19,15,.35)', borderRadius: 16, fontSize: 20, color: '#6B645B', ...rise(f, start + 110) }}>
        <Camera size={24} /> photo_of_the_road.jpg ✓
      </div>
      <div className="flex items-center justify-center font-display font-bold" style={{ marginTop: 20, height: 64, borderRadius: 99, background: INK, color: '#fff', fontSize: 26, ...pop(f, start + 122, 0, 0.8) }}>
        Post idea →
      </div>
    </div>
  )
}

function CampaignScreen({ f, start, society, running }: { f: number; start: number; society: number; running: number }) {
  const shares: { n: 'whatsapp' | 'instagram' | 'linkedin' | 'x'; bg: string }[] = [
    { n: 'whatsapp', bg: '#25D366' },
    { n: 'instagram', bg: '#E1306C' },
    { n: 'linkedin', bg: '#0A66C2' },
    { n: 'x', bg: INK },
  ]
  return (
    <div style={pop(f, start, 0, 0.85)}>
      <div className="overflow-hidden" style={{ background: '#fff', border: `5px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, borderRadius: 30 }}>
        <div className="relative" style={{ height: 170, background: C.saffron, borderBottom: `5px solid ${INK}` }}>
          <div className="bg-dots absolute inset-0" style={{ opacity: 0.35 }} />
          <Footprints size={190} color="rgba(255,255,255,.4)" style={{ position: 'absolute', right: 10, bottom: -40, transform: 'rotate(-12deg)' }} />
          <span className="absolute font-bold uppercase" style={{ left: 18, top: 18, fontSize: 15, background: '#fff', border: `3px solid ${INK}`, borderRadius: 99, padding: '3px 12px' }}>Campaign</span>
        </div>
        <div style={{ padding: '20px 24px' }}>
          <p className="font-display font-extrabold" style={{ fontSize: 34, lineHeight: 1.05, color: INK }}>Joggers Park for Gachibowli</p>
          <p style={{ fontSize: 18, color: '#6B645B', marginTop: 6 }}>by Sneha · Kondapur · Sports & Play</p>
          <div className="flex items-baseline justify-between" style={{ marginTop: 14 }}>
            <span className="font-display font-extrabold" style={{ fontSize: 28, color: INK }}>0 vouches</span>
            <span className="font-mono" style={{ fontSize: 16, color: '#6B645B' }}>goal 5,000</span>
          </div>
          <div style={{ marginTop: 8, height: 20, border: `4px solid ${INK}`, borderRadius: 99, background: C.paper }} />
          <p className="font-bold uppercase" style={{ fontSize: 15, letterSpacing: '0.08em', color: '#6B645B', marginTop: 18 }}>Share your campaign</p>
          <div className="flex gap-3" style={{ marginTop: 10 }}>
            {shares.map((s, i) => (
              <span key={s.n} className="flex items-center justify-center rounded-full" style={{ width: 62, height: 62, background: s.bg, color: '#fff', border: `4px solid ${INK}`, ...pop(f, start + 8 + i * 5, 0, 0) }}>
                <BrandIcon name={s.n} size={30} />
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start" style={{ gap: 14, marginTop: 24 }}>
        {[
          { t: 'Sent to Society WhatsApp group', at: society },
          { t: 'Sent to Morning Runners club', at: running },
        ].map((c, i) => (
          <span key={c.t} className="inline-flex items-center gap-2 font-bold" style={{ fontSize: 22, background: '#fff', border: `4px solid ${INK}`, boxShadow: `4px 4px 0 ${INK}`, borderRadius: 99, padding: '8px 18px', color: INK, ...pop(f, c.at, i % 2 ? 2 : -2, 0.5) }}>
            <Check size={22} color={C.mint} strokeWidth={3} /> {c.t}
          </span>
        ))}
      </div>
    </div>
  )
}

function VouchScreen({ f, start, vouches }: { f: number; start: number; vouches: number }) {
  const notes = ['Priya from Kondapur vouched', 'Morning Runners shared it with 2.4K members', '86 vouches from Lakeview Towers RWA']
  return (
    <div style={pop(f, start, 0, 0.85)}>
      <div className="text-center" style={{ background: '#fff', border: `5px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, borderRadius: 30, padding: '26px 22px' }}>
        <p className="font-bold uppercase" style={{ fontSize: 17, letterSpacing: '0.1em', color: '#6B645B' }}>Verified vouches</p>
        <p className="font-display font-extrabold" style={{ fontSize: 112, lineHeight: 1, letterSpacing: '-0.04em', color: INK }}>{vouches.toLocaleString('en-IN')}</p>
        <div style={{ marginTop: 12, height: 26, border: `4px solid ${INK}`, borderRadius: 99, background: C.paper, overflow: 'hidden' }}>
          <div style={{ width: `${(vouches / 5000) * 100}%`, height: '100%', background: C.pink }} />
        </div>
        <div className="flex justify-center" style={{ marginTop: 16 }}>
          {[C.pink, C.blue, C.mint, C.lilac, C.saffron, C.teal].map((c, i) => (
            <span key={c} className="flex items-center justify-center rounded-full font-bold" style={{ width: 54, height: 54, marginLeft: i ? -12 : 0, background: c, border: `4px solid ${INK}`, color: '#fff', fontSize: 20, ...pop(f, start + 6 + i * 4, 0, 0) }}>
              {'PRASNK'[i]}
            </span>
          ))}
          <span className="flex items-center rounded-full font-bold" style={{ height: 54, marginLeft: -12, background: C.marigold, border: `4px solid ${INK}`, padding: '0 14px', fontSize: 20, color: INK }}>+3.8K</span>
        </div>
      </div>
      <div className="flex flex-col" style={{ gap: 12, marginTop: 20 }}>
        {notes.map((n, i) => (
          <div key={n} className="flex items-center gap-3 font-semibold" style={{ fontSize: 21, background: '#fff', border: `4px solid ${INK}`, boxShadow: `4px 4px 0 ${INK}`, borderRadius: 20, padding: '12px 16px', color: INK, ...rise(f, start + 10 + i * 16, 30) }}>
            <Heart size={24} fill={C.pink} color={C.pink} /> {n}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ───────────────────────── 12 · Ranked list → govt shortlist → the loop ───────────────────────── */

const ROWS = [
  { id: 'dogs', t: 'Humane stray-dog shelters', v: '48,210', s: 'Shortlisted' },
  { id: 'bus', t: 'A bus every 10 minutes', v: '41,870', s: 'Shortlisted' },
  { id: 'creche', t: 'Crèches at metro stations', v: '13,240', s: 'In review' },
  { id: 'isl', t: 'Sign Language in schools', v: '12,760', s: 'In review' },
  { id: 'skate', t: 'Skate parks under flyovers', v: '9,640', s: 'In review' },
]

const NODES: { t: string; icon: LucideIcon; bg: string; fg: string }[] = [
  { t: 'Pitch', icon: Lightbulb, bg: C.lilac, fg: '#fff' },
  { t: 'Vouch', icon: Users, bg: C.pink, fg: '#fff' },
  { t: 'Rank', icon: ListOrdered, bg: C.marigold, fg: INK },
  { t: 'Shortlist', icon: Landmark, bg: C.blue, fg: '#fff' },
  { t: 'Fund & go live', icon: Rocket, bg: C.mint, fg: '#fff' },
]

export function LoopScene({ scene }: { scene: PlacedScene }) {
  const f = useCurrentFrame()
  const line = lineOf(scene, 'loop')
  const rankedAt = wordAt(scene, 'loop', 'ranked')
  const loopAt = wordAt(scene, 'loop', 'feedback')
  const climb = ramp(f, [line.from, rankedAt])
  const ourPos = 6 - 3 * climb // 1-based rank, from 6 to 3
  const ourVotes = Math.round(2140 + (13900 - 2140) * climb)
  const stampAt = rankedAt + 10
  const stamp = sp(f, stampAt, { damping: 11, stiffness: 260 })
  const ROW_H = 96
  const TOP = 260

  const cx = 1450
  const cy = 560
  const R = 250

  return (
    <Bg>
      <AbsoluteFill style={{ opacity: outro(f, scene.duration, 10) }}>
        {/* govt idea inventory */}
        <div className="absolute overflow-hidden" style={{ left: 110, top: 150, width: 900, height: 720, background: '#fff', border: `6px solid ${INK}`, boxShadow: `14px 14px 0 ${INK}`, borderRadius: 34, ...rise(f, -8) }}>
          <div className="flex items-center justify-between" style={{ height: 96, background: C.blue, borderBottom: `6px solid ${INK}`, padding: '0 30px', color: '#fff' }}>
            <span className="flex items-center gap-3 font-display font-extrabold" style={{ fontSize: 34 }}>
              <Landmark size={38} /> Idea inventory · Budget 2027-28
            </span>
            <span className="font-mono" style={{ fontSize: 20, opacity: 0.85 }}>1,284 ideas</span>
          </div>
        </div>
        {ROWS.map((r, i) => {
          const rank = i + 1
          const shifted = rank >= 3 ? rank + Math.max(0, Math.min(1, rank + 1 - ourPos)) : rank
          return <InventoryRow key={r.id} y={TOP + (shifted - 1) * ROW_H} rank={Math.round(shifted)} title={r.t} votes={r.v} status={r.s} />
        })}
        <InventoryRow y={TOP + (ourPos - 1) * ROW_H} rank={Math.round(ourPos)} title="Joggers Park for Gachibowli" votes={ourVotes.toLocaleString('en-IN')} status={f >= stampAt ? 'Shortlisted' : 'Climbing ↑'} mine />
        {f >= stampAt && (
          <div
            className="absolute flex items-center gap-3 font-display font-extrabold uppercase"
            style={{
              left: 650,
              top: TOP + 2 * ROW_H + 4,
              fontSize: 44,
              color: '#E4002B',
              border: '9px solid #E4002B',
              borderRadius: 18,
              padding: '4px 22px',
              background: 'rgba(255,255,255,.88)',
              transform: `scale(${2.6 - 1.6 * stamp}) rotate(${-12 * stamp}deg)`,
              opacity: Math.min(1, stamp * 3),
              zIndex: 20,
            }}
          >
            Shortlisted
          </div>
        )}

        {/* the loop */}
        <div className="absolute text-center" style={{ left: cx - 380, top: 150, width: 760 }}>
          <p className="font-display font-extrabold" style={{ fontSize: 64, letterSpacing: '-0.035em', color: INK, ...pop(f, loopAt - 4, -2, 0.6) }}>
            The feedback loop
          </p>
          <div className="flex justify-center" style={{ marginTop: -4 }}>
            <Squiggle progress={ramp(f, [loopAt + 4, loopAt + 22])} color={C.pink} width={460} height={34} strokeWidth={14} />
          </div>
        </div>
        <svg className="absolute" style={{ left: cx - R - 10, top: cy - R - 10 }} width={2 * R + 20} height={2 * R + 20}>
          <circle cx={R + 10} cy={R + 10} r={R} fill="none" stroke={INK} strokeWidth={5} strokeDasharray="18 16" transform={`rotate(${f * 0.6} ${R + 10} ${R + 10})`} />
        </svg>
        <div className="absolute" style={{ left: cx - R - 10, top: cy - R - 10, width: 2 * R + 20, height: 2 * R + 20, transform: `rotate(${f * 3.2}deg)` }}>
          <div className="absolute" style={{ left: R + 10 - 30, top: -20 }}>
            <Coin size={60} />
          </div>
        </div>
        <div className="absolute flex flex-col items-center justify-center rounded-full text-center" style={{ left: cx - 140, top: cy - 140, width: 280, height: 280, background: '#fff', border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}` }}>
          <p className="font-display font-extrabold" style={{ fontSize: 66, lineHeight: 1, color: INK }}>1,284</p>
          <p className="font-semibold" style={{ fontSize: 22, lineHeight: 1.2, color: '#2E2A25', padding: '0 30px', marginTop: 6 }}>citizen ideas ready for the next Budget</p>
        </div>
        {NODES.map((n, i) => {
          const a = (i / NODES.length) * Math.PI * 2 - Math.PI / 2
          const x = cx + Math.cos(a) * R
          const y = cy + Math.sin(a) * R
          const Icon = n.icon
          return (
            <div key={n.t} className="absolute" style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}>
              <div style={pop(f, line.from + 6 + i * 9, i % 2 ? 4 : -4, 0)}>
                <span className="flex items-center gap-3 font-display font-extrabold" style={{ fontSize: 30, background: n.bg, color: n.fg, border: `5px solid ${INK}`, boxShadow: `6px 6px 0 ${INK}`, borderRadius: 22, padding: '10px 20px', whiteSpace: 'nowrap' }}>
                  <span className="flex items-center justify-center rounded-full bg-white" style={{ width: 46, height: 46, border: `4px solid ${INK}`, color: INK }}>
                    <Icon size={24} strokeWidth={2.6} />
                  </span>
                  {n.t}
                </span>
              </div>
            </div>
          )
        })}
      </AbsoluteFill>
      <Sfx at={stampAt} name="stamp" volume={0.7} />
      <Sfx at={loopAt - 4} name="pop" volume={0.4} />
      {NODES.map((n, i) => (
        <Sfx key={n.t} at={line.from + 6 + i * 9} name="tick" volume={0.25} />
      ))}
    </Bg>
  )
}

function InventoryRow({ y, rank, title, votes, status, mine }: { y: number; rank: number; title: string; votes: string; status: string; mine?: boolean }) {
  const green = status === 'Shortlisted'
  return (
    <div
      className="absolute flex items-center"
      style={{
        left: 116,
        top: y,
        width: 888,
        height: 90,
        padding: '0 26px',
        gap: 20,
        background: mine ? '#FFF1C7' : '#fff',
        borderTop: '3px solid rgba(22,19,15,.1)',
        boxShadow: mine ? `0 0 0 5px ${INK}, 8px 8px 0 5px ${INK}` : 'none',
        borderRadius: mine ? 14 : 0,
        zIndex: mine ? 10 : 1,
      }}
    >
      <span className="font-display font-extrabold" style={{ width: 40, fontSize: 40, color: INK }}>{rank}</span>
      <span className="font-bold" style={{ flex: 1, fontSize: 28, color: INK }}>{title}</span>
      <span className="font-mono font-bold" style={{ fontSize: 22, color: '#2E2A25' }}>{votes}</span>
      <span className="font-bold uppercase" style={{ width: 170, textAlign: 'center', fontSize: 16, border: `3px solid ${INK}`, borderRadius: 99, padding: '4px 0', background: green ? C.mint : mine ? '#fff' : '#E2E7FF', color: green ? '#fff' : INK }}>
        {status}
      </span>
    </div>
  )
}

