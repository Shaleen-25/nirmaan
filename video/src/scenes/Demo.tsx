import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion'
import { ArrowRight, Check, Lock, MapPin, Plus, Scissors, ShoppingBasket } from 'lucide-react'
import {
  Bar, Bg, C, Coin, Cursor, Eyebrow, INK, Pill, ProjectGlyph, Sfx, Sticker, clickPulse, cursorAt, outro, pop, projectIcon, ramp, rise,
  rupees, sp,
} from '../kit'
import { CATEGORIES, PROJECTS, TIERS, type Project } from '../../../src/data/projects'
import { crore } from '../../../src/lib/format'
import { DEMO } from '../config'
import { lineOf, wordAt, type PlacedScene } from '../timeline'

const byId = (id: string) => PROJECTS.find((p) => p.id === id) as Project
const SHORT: Record<string, string> = {
  'blr-lake-park': 'Bellandur jogging loop',
  'charge-bharat': 'EV fast-chargers',
  'blr-garbage': 'Zero-garbage ward',
  'chip-studio': 'Bharat Chip Studios',
}

/* ───────────────────────── 6 · Slide in your tax, tear off 10% ───────────────────────── */

const CARD = { x: 110, y: 110, w: 900, h: 820, pad: 56 }
const TRACK = { x: CARD.x + CARD.pad, y: CARD.y + 486, w: 788 }
const PRESETS = [50_000, 1_50_000, 5_00_000, 8_00_000, 25_00_000]
const presetLabel = (n: number) => (n >= 1e5 ? `₹${n / 1e5} L` : `₹${n / 1e3}K`)

export function StartScene({ scene }: { scene: PlacedScene }) {
  const f = useCurrentFrame()
  const line = lineOf(scene, 'start')
  const lakh = wordAt(scene, 'start', 'lakh')
  const dragStart = Math.max(8, line.from - 2)
  const dragEnd = lakh + 6
  const t = ramp(f, [dragStart, dragEnd], [0, 1], Easing.bezier(0.45, 0, 0.2, 1))
  const tax = Math.round((1_50_000 + (DEMO.tax - 1_50_000) * t) / 5_000) * 5_000
  const share = Math.round(tax * 0.1)
  const thumbP = 0.42 + 0.32 * t
  const thumbX = TRACK.x + thumbP * TRACK.w
  const tearAt = wordAt(scene, 'start', 'tears')
  const tear = sp(f, tearAt, { damping: 12, stiffness: 130 })

  const STUB = { x: 1150, y: 640 }
  const cursor = cursorAt(f, [
    { f: 0, x: 760, y: 980 },
    { f: dragStart, x: TRACK.x + 0.42 * TRACK.w - 6, y: TRACK.y + 8 },
    { f: dragEnd, x: thumbX - 6, y: TRACK.y + 8 },
    { f: tearAt - 8, x: STUB.x + 470, y: STUB.y + 120 },
    { f: tearAt + 20, x: STUB.x + 520, y: STUB.y + 190 },
  ])
  const dragging = f >= dragStart && f <= dragEnd ? 0.55 : 0
  const pressed = Math.max(dragging, clickPulse(f, [tearAt]))

  return (
    <Bg>
      <AbsoluteFill style={{ opacity: outro(f, scene.duration) }}>
        {/* left: the input card */}
        <div className="absolute" style={{ left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, background: '#fff', border: `6px solid ${INK}`, boxShadow: `14px 14px 0 ${INK}`, borderRadius: 40, ...rise(f, -12, 30) }}>
          <div className="absolute" style={{ left: CARD.pad, top: 50 }}>
            <Eyebrow dot={C.marigold}>Step 1 · Your share</Eyebrow>
          </div>
          <div className="absolute" style={{ right: 40, top: 34, ...pop(f, 12, 6) }}>
            <Sticker tone="blue" size={22}>🔌 Auto-fetched from ITR soon</Sticker>
          </div>
          <h2 className="absolute font-display font-extrabold" style={{ left: CARD.pad, top: 100, width: 780, fontSize: 66, lineHeight: 1.0, letterSpacing: '-0.035em', color: INK }}>
            How much income tax do you pay a year?
          </h2>
          <p className="absolute font-semibold" style={{ left: CARD.pad, top: 272, fontSize: 28, color: '#6B645B' }}>Annual income tax</p>
          <p className="absolute font-display font-extrabold" style={{ left: CARD.pad, top: 306, fontSize: 136, lineHeight: 1, letterSpacing: '-0.04em', color: INK }}>
            {rupees(tax)}
          </p>
          {/* slider */}
          <div className="absolute" style={{ left: CARD.pad, top: 486, width: TRACK.w, height: 28, borderRadius: 99, border: `5px solid ${INK}`, background: '#fff' }}>
            <div style={{ width: `${thumbP * 100}%`, height: '100%', background: C.marigold, borderRadius: 99 }} />
          </div>
          <div
            className="absolute rounded-full"
            style={{ left: CARD.pad + thumbP * TRACK.w - 30, top: 470, width: 60, height: 60, background: C.marigold, border: `6px solid ${INK}`, boxShadow: `4px 4px 0 ${INK}` }}
          />
          <div className="absolute flex" style={{ left: CARD.pad, top: 560, gap: 14 }}>
            {PRESETS.map((p) => {
              const on = p === DEMO.tax && tax >= DEMO.tax
              return (
                <span key={p} className="font-display font-bold" style={{ fontSize: 26, padding: '8px 18px', borderRadius: 99, border: `4px solid ${INK}`, background: on ? INK : '#fff', color: on ? '#fff' : INK }}>
                  {presetLabel(p)}
                </span>
              )
            })}
          </div>
          <p className="absolute flex items-center gap-2 font-display font-extrabold" style={{ left: CARD.pad, top: 652, fontSize: 32, color: INK }}>
            <MapPin size={34} color={C.pink} strokeWidth={2.6} /> Where do you live?
          </p>
          <div className="absolute flex" style={{ left: CARD.pad, top: 706, gap: 14 }}>
            {['Bengaluru', 'Hyderabad', 'Pune', 'Mumbai'].map((c, i) => (
              <span
                key={c}
                className="font-display font-extrabold"
                style={{ fontSize: 28, padding: '12px 22px', borderRadius: 20, border: `4px solid ${INK}`, boxShadow: `4px 4px 0 ${INK}`, background: i === 0 ? C.pink : '#fff', color: i === 0 ? '#fff' : INK, transform: `rotate(${i === 0 ? -2 : 0}deg)` }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* right: the receipt */}
        <div className="absolute font-mono" style={{ left: 1150, top: 150, width: 660, ...rise(f, -6, 40) }}>
          <div style={{ background: '#fff', border: `6px solid ${INK}`, boxShadow: `14px 14px 0 ${INK}`, borderRadius: '34px 34px 0 0', padding: '36px 44px 30px' }}>
            <div className="flex justify-between font-bold uppercase" style={{ fontSize: 20, letterSpacing: '0.2em', color: '#6B645B' }}>
              <span>Tax receipt</span>
              <span>FY 2026-27</span>
            </div>
            <div style={{ borderTop: `4px dashed rgba(22,19,15,.25)`, margin: '24px 0' }} />
            {[
              ['Income tax paid', rupees(tax), true, false],
              ['↳ Keeps India running (90%)', rupees(tax - share), false, false],
              ['↳ You decide (10%)', rupees(share), false, true],
            ].map(([k, v, bold, hl]) => (
              <div key={k as string} className="flex justify-between" style={{ fontSize: 25, padding: '8px 0', fontWeight: bold ? 700 : 400, color: INK }}>
                <span style={hl ? { background: C.marigold, padding: '0 8px', borderRadius: 8 } : { color: bold ? INK : '#2E2A25' }}>{k as string}</span>
                <span>{v as string}</span>
              </div>
            ))}
          </div>
          <div className="relative flex items-center" style={{ height: 30, padding: '0 16px', zIndex: 3 }}>
            <Scissors size={30} color={INK} style={{ transform: 'rotate(-90deg)' }} />
            <div style={{ flex: 1, borderTop: `5px dashed ${INK}`, marginLeft: 8 }} />
          </div>
          <div
            style={{
              background: C.marigold,
              border: `6px solid ${INK}`,
              boxShadow: `14px 14px 0 ${INK}`,
              borderRadius: '0 0 34px 34px',
              padding: '26px 44px 32px',
              transformOrigin: 'top left',
              transform: `translate(${tear * 34}px, ${tear * 56}px) rotate(${tear * 7}deg)`,
            }}
          >
            <p className="font-bold uppercase" style={{ fontSize: 20, letterSpacing: '0.2em', color: INK }}>Your 10% · torn off for you</p>
            <div className="flex items-center justify-between" style={{ marginTop: 8 }}>
              <span className="font-display font-extrabold" style={{ fontSize: 86, letterSpacing: '-0.04em', color: INK }}>{rupees(share)}</span>
              <span className="flex items-center gap-2 whitespace-nowrap font-display font-bold" style={{ fontSize: 24, background: '#fff', border: `4px solid ${INK}`, borderRadius: 99, padding: '10px 18px', color: INK }}>
                You decide <ArrowRight size={26} />
              </span>
            </div>
          </div>
        </div>
        <div className="absolute" style={{ left: 1520, top: 548, zIndex: 6, ...pop(f, tearAt + 14, 7) }}>
          <Sticker tone="pink" size={36}>Yours to direct!</Sticker>
        </div>

        <Cursor x={cursor.x} y={cursor.y} pressed={pressed} />
      </AbsoluteFill>
      <Sfx at={dragStart} name="click" volume={0.3} />
      {[0.25, 0.5, 0.75, 1].map((p) => (
        <Sfx key={p} at={dragStart + (dragEnd - dragStart) * p} name="tick" volume={0.25} />
      ))}
      <Sfx at={tearAt} name="rip" volume={0.6} />
      <Sfx at={tearAt + 14} name="pop" volume={0.35} />
    </Bg>
  )
}

/* ───────────────────────── 7 · Browse and back projects ───────────────────────── */

const GRID = { x: 110, y: 322, w: 540, h: 276, gx: 40, gy: 30 }

function cardPos(i: number) {
  return { x: GRID.x + (i % 3) * (GRID.w + GRID.gx), y: GRID.y + Math.floor(i / 3) * (GRID.h + GRID.gy) }
}

export function BrowseScene({ scene }: { scene: PlacedScene }) {
  const f = useCurrentFrame()
  const cards = [...DEMO.picks.map((p) => p.id), ...DEMO.extra].map(byId)
  const clicks = DEMO.picks.map((p) => wordAt(scene, 'browse', p.word))
  const keys = [{ f: 0, x: 1650, y: 1010 }]
  clicks.forEach((c, i) => {
    const { x, y } = cardPos(i)
    keys.push({ f: c - 9, x: x + 260, y: y + 236 }, { f: c + 4, x: x + 262, y: y + 238 })
  })
  keys.push({ f: clicks[3] + 30, x: 1500, y: 1000 })
  const cursor = cursorAt(f, keys)
  const backed = clicks.filter((c) => f >= c).length

  return (
    <Bg>
      <AbsoluteFill style={{ opacity: outro(f, scene.duration) }}>
        <div className="absolute" style={{ left: 110, top: 62, ...rise(f, -8) }}>
          <Eyebrow dot={C.saffron}>Step 2 · Back projects</Eyebrow>
          <h2 className="font-display font-extrabold" style={{ fontSize: 78, letterSpacing: '-0.04em', color: INK, marginTop: 10 }}>
            What should your <span style={{ color: C.pink }}>₹80,000</span> build?
          </h2>
        </div>
        <div className="absolute flex items-center gap-3 font-display font-extrabold" style={{ right: 110, top: 150, fontSize: 30, background: backed ? C.marigold : '#fff', border: `5px solid ${INK}`, boxShadow: `6px 6px 0 ${INK}`, borderRadius: 99, padding: '12px 26px', color: INK }}>
          <ShoppingBasket size={32} /> {backed} backed · {rupees(backed ? 80_000 : 0)}
        </div>
        <div className="absolute flex" style={{ left: 110, top: 226, gap: 10, background: '#fff', border: `4px solid ${INK}`, borderRadius: 99, padding: 6 }}>
          {['All', `My City · ${DEMO.city}`, `State · ${DEMO.state}`, 'National'].map((t, i) => (
            <span key={t} className="font-display font-bold" style={{ fontSize: 24, padding: '8px 22px', borderRadius: 99, background: i === 0 ? INK : 'transparent', color: i === 0 ? '#fff' : INK }}>
              {t}
            </span>
          ))}
        </div>

        {cards.map((p, i) => {
          const { x, y } = cardPos(i)
          const clickAt = clicks[i]
          const on = clickAt !== undefined && f >= clickAt
          const cat = CATEGORIES[p.category]
          const Icon = projectIcon(p)
          const squish = clickAt !== undefined ? clickPulse(f, [clickAt]) : 0
          return (
            <div key={p.id} className="absolute" style={{ left: x, top: y, width: GRID.w, height: GRID.h, ...pop(f, 6 + i * 4, 0, 0.85) }}>
              <div
                className="flex h-full overflow-hidden"
                style={{ borderRadius: 30, border: `5px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}`, background: on ? '#FFF1C7' : '#fff' }}
              >
                <div className="relative flex items-center justify-center" style={{ width: 150, background: cat.color, borderRight: `5px solid ${INK}` }}>
                  <div className="bg-dots absolute inset-0" style={{ opacity: 0.5 }} />
                  <span className="relative flex items-center justify-center" style={{ width: 84, height: 84, borderRadius: 24, background: '#fff', border: `5px solid ${INK}`, transform: 'rotate(-6deg)' }}>
                    <Icon size={44} strokeWidth={2.3} color={INK} />
                  </span>
                </div>
                <div className="flex flex-1 flex-col" style={{ padding: '18px 22px' }}>
                  <div className="flex gap-2">
                    <Pill bg={INK} fg="#fff" size={15}>{TIERS[p.tier].label}</Pill>
                    <Pill bg={cat.soft} size={15}>{cat.label}</Pill>
                  </div>
                  <p className="font-display font-extrabold" style={{ fontSize: 31, lineHeight: 1.04, marginTop: 10, color: INK, letterSpacing: '-0.02em' }}>{p.title}</p>
                  <div style={{ marginTop: 'auto' }}>
                    <div className="flex justify-between font-mono" style={{ fontSize: 15, color: '#6B645B', marginBottom: 6 }}>
                      <span>{crore(p.raisedCr)} raised</span>
                      <span>{Math.round((p.raisedCr / p.goalCr) * 100)}%</span>
                    </div>
                    <Bar value={p.raisedCr / p.goalCr} color={cat.color} height={18} />
                    <div
                      className="flex items-center justify-center gap-2 font-display font-bold"
                      style={{
                        marginTop: 12,
                        height: 46,
                        borderRadius: 99,
                        border: `4px solid ${INK}`,
                        background: on ? '#fff' : INK,
                        color: on ? INK : '#fff',
                        fontSize: 22,
                        transform: `scale(${1 - squish * 0.08})`,
                      }}
                    >
                      {on ? <><Check size={24} /> Backing this</> : <><Plus size={24} /> Back this project</>}
                    </div>
                  </div>
                </div>
              </div>
              {on && (
                <div className="absolute" style={{ right: -18, top: -22, ...pop(f, clickAt, 9) }}>
                  <Sticker tone="marigold" size={24}>You're in!</Sticker>
                </div>
              )}
            </div>
          )
        })}

        <Cursor x={cursor.x} y={cursor.y} pressed={clickPulse(f, clicks)} />
      </AbsoluteFill>
      {clicks.map((c, i) => (
        <Sfx key={i} at={c} name="pop" volume={0.4} />
      ))}
    </Bg>
  )
}

/* ───────────────────────── 8 · Split it however you like ───────────────────────── */

export function AllocateScene({ scene }: { scene: PlacedScene }) {
  const f = useCurrentFrame()
  const line = lineOf(scene, 'split')
  const quotas = wordAt(scene, 'split', 'quotas')
  const amounts = DEMO.picks.map((p, i) => 20_000 + (p.amount - 20_000) * ramp(f, [line.from + i * 3, line.from + 34 + i * 3]))
  const total = amounts.reduce((a, b) => a + b, 0)

  // donut
  const R = 200
  const SW = 74
  const circ = 2 * Math.PI * R
  let offset = 0

  return (
    <Bg>
      <AbsoluteFill style={{ opacity: outro(f, scene.duration, 6) }}>
        <div className="absolute flex items-center" style={{ left: 110, top: 96, gap: 40 }}>
          <h2 className="font-display font-extrabold" style={{ fontSize: 92, letterSpacing: '-0.04em', color: INK, ...rise(f, 0) }}>
            Split it however you like.
          </h2>
          <div style={pop(f, quotas - 4, -6)}>
            <Sticker tone="pink" size={48}>No quotas ✌️</Sticker>
          </div>
        </div>

        {DEMO.picks.map((pick, i) => {
          const p = byId(pick.id)
          const cat = CATEGORIES[p.category]
          const v = amounts[i]
          return (
            <div
              key={p.id}
              className="absolute flex items-center"
              style={{ left: 110, top: 270 + i * 160, width: 1080, height: 128, background: '#fff', border: `5px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, borderRadius: 28, padding: '0 30px', gap: 24, ...rise(f, 2 + i * 3) }}
            >
              <ProjectGlyph project={p} size={70} />
              <div style={{ width: 340 }}>
                <p className="font-display font-extrabold" style={{ fontSize: 30, lineHeight: 1.05, color: INK }}>{SHORT[p.id]}</p>
                <div style={{ marginTop: 6 }}>
                  <Pill bg={p.tier === 'local' ? C.pink : C.marigold} fg={p.tier === 'local' ? '#fff' : INK} size={14}>{TIERS[p.tier].label}</Pill>
                </div>
              </div>
              <div className="relative" style={{ flex: 1 }}>
                <Bar value={v / 40_000} color={cat.color} height={24} />
                <span className="absolute rounded-full" style={{ left: `calc(${(v / 40_000) * 100}% - 20px)`, top: -10, width: 44, height: 44, background: C.marigold, border: `5px solid ${INK}` }} />
              </div>
              <p className="font-display font-extrabold" style={{ width: 200, textAlign: 'right', fontSize: 46, color: INK }}>{rupees(Math.round(v / 100) * 100)}</p>
            </div>
          )
        })}

        <div className="absolute" style={{ left: 1310, top: 310, width: 2 * (R + SW), height: 2 * (R + SW), ...pop(f, 4, 0, 0.7) }}>
          <svg width={2 * (R + SW)} height={2 * (R + SW)} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={R + SW} cy={R + SW} r={R + SW / 2} fill="none" stroke={INK} strokeWidth={6} />
            <circle cx={R + SW} cy={R + SW} r={R - SW / 2} fill="none" stroke={INK} strokeWidth={6} />
            {DEMO.picks.map((pick, i) => {
              const len = (amounts[i] / total) * circ
              const el = (
                <circle
                  key={pick.id}
                  cx={R + SW}
                  cy={R + SW}
                  r={R}
                  fill="none"
                  stroke={CATEGORIES[byId(pick.id).category].color}
                  strokeWidth={SW - 6}
                  strokeDasharray={`${Math.max(0, len - 6)} ${circ}`}
                  strokeDashoffset={-offset}
                />
              )
              offset += len
              return el
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-display font-extrabold" style={{ fontSize: 86, color: INK, lineHeight: 1 }}>100%</p>
            <p className="font-mono font-bold" style={{ fontSize: 26, color: '#6B645B' }}>{rupees(total)}</p>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx at={quotas - 4} name="pop" volume={0.4} />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={i} at={line.from + 8 + i * 6} name="tick" volume={0.2} />
      ))}
    </Bg>
  )
}

/* ───────────────────────── 9 · Mint purpose-bound e₹ ───────────────────────── */

export function MintScene({ scene }: { scene: PlacedScene }) {
  const f = useCurrentFrame()
  const line = lineOf(scene, 'mint')
  const clickF = line.from + 6
  const onlyAt = wordAt(scene, 'mint', 'only')
  const btnOut = ramp(f, [clickF + 8, clickF + 18])
  const machine = sp(f, clickF + 10, { damping: 13, stiffness: 120 })
  const cursor = cursorAt(f, [
    { f: 0, x: 1320, y: 760 },
    { f: clickF - 4, x: 1010, y: 520 },
    { f: clickF + 30, x: 1300, y: 1000 },
  ])

  return (
    <Bg color={INK} pattern="none">
      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.09) 2.4px, transparent 2.4px)', backgroundSize: '28px 28px' }} />
      <AbsoluteFill style={{ opacity: outro(f, scene.duration) }}>
        {/* confirm button */}
        {btnOut < 1 && (
          <div className="absolute flex w-full justify-center" style={{ top: 430, opacity: 1 - btnOut, transform: `scale(${(1 - btnOut * 0.4) * (1 - clickPulse(f, [clickF]) * 0.07)})` }}>
            <div className="flex items-center gap-4 font-display font-extrabold" style={{ fontSize: 70, background: C.marigold, border: `6px solid #fff`, boxShadow: `10px 10px 0 rgba(255,255,255,.35)`, borderRadius: 99, padding: '30px 64px', color: INK }}>
              Confirm & mint e₹ <ArrowRight size={64} />
            </div>
          </div>
        )}

        {/* the mint */}
        <div
          className="absolute flex items-center justify-between"
          style={{
            left: 460,
            top: 60,
            width: 1000,
            height: 230,
            background: '#fff',
            border: `6px solid ${INK}`,
            boxShadow: `14px 14px 0 ${C.marigold}`,
            borderRadius: 40,
            padding: '0 60px',
            transform: `translateY(${(1 - machine) * -420}px)`,
          }}
        >
          <div className="flex items-center gap-5">
            <Coin size={120} spin={f * 6} />
            <div>
              <p className="font-mono font-bold uppercase" style={{ fontSize: 22, letterSpacing: '0.24em', color: '#6B645B' }}>RBI e-Rupee rail</p>
              <p className="font-display font-extrabold" style={{ fontSize: 76, lineHeight: 1, color: INK }}>e₹ Mint</p>
            </div>
          </div>
          <div className="flex gap-3">
            {[C.pink, C.marigold, C.mint].map((c, i) => (
              <span key={c} className="rounded-full" style={{ width: 34, height: 34, border: `5px solid ${INK}`, background: Math.floor(f / 6 + i) % 3 === 0 ? c : '#fff' }} />
            ))}
          </div>
          <div className="absolute" style={{ left: 260, bottom: 18, width: 480, height: 26, borderRadius: 99, background: INK }} />
        </div>

        {/* the notes */}
        {DEMO.picks.map((pick, i) => {
          const p = byId(pick.id)
          const emerge = clickF + 26 + i * 12
          if (f < emerge) return null
          const out = ramp(f, [emerge, emerge + 8])
          const fly = sp(f, emerge + 8, { damping: 15, stiffness: 120 })
          const fromX = 770
          const toX = 110 + i * 440
          const x = fromX + (toX - fromX) * fly
          const y = 250 + out * 90 + fly * 140
          const lockPop = sp(f, onlyAt + i * 4, { damping: 9, stiffness: 260 })
          return (
            <div
              key={p.id}
              className="absolute"
              style={{ left: x, top: y, width: 380, height: 236, transform: `rotate(${(i % 2 ? 3 : -3) * fly}deg) scaleY(${0.3 + 0.7 * out})`, transformOrigin: 'top center', zIndex: 4 - i }}
            >
              <div className="relative h-full" style={{ background: '#FFF1C7', border: `5px solid ${INK}`, boxShadow: `10px 10px 0 rgba(255,255,255,.3)`, borderRadius: 26, padding: 22 }}>
                <div className="absolute" style={{ inset: 9, border: '3px dashed rgba(22,19,15,.3)', borderRadius: 18 }} />
                <div className="relative flex items-center gap-3">
                  <Coin size={58} />
                  <p className="font-mono font-bold uppercase" style={{ fontSize: 15, letterSpacing: '0.16em', color: C.pink }}>Purpose-bound</p>
                </div>
                <p className="relative font-display font-extrabold" style={{ fontSize: 58, lineHeight: 1.05, marginTop: 10, color: INK }}>{rupees(pick.amount)}</p>
                <p className="relative" style={{ fontSize: 19, color: '#2E2A25' }}>
                  Only for: <strong>{SHORT[p.id]}</strong>
                </p>
                <p className="relative font-mono" style={{ fontSize: 13, color: '#6B645B', marginTop: 4 }}>
                  NRM-{p.tier.slice(0, 3).toUpperCase()}-{p.id.toUpperCase().replace(/-/g, '').slice(0, 6)}
                </p>
                <span
                  className="absolute flex items-center justify-center rounded-full"
                  style={{ right: -20, top: -20, width: 66, height: 66, background: C.pink, border: `5px solid ${INK}`, color: '#fff', transform: `scale(${lockPop}) rotate(${(1 - lockPop) * 60}deg)`, opacity: Math.min(1, lockPop * 2) }}
                >
                  <Lock size={32} strokeWidth={2.8} />
                </span>
              </div>
            </div>
          )
        })}

        <div className="absolute flex w-full justify-center" style={{ top: 760, ...rise(f, onlyAt + 6) }}>
          <p className="flex items-center gap-4 font-display font-extrabold" style={{ fontSize: 50, color: '#fff' }}>
            <Lock size={46} color={C.marigold} strokeWidth={2.8} /> Can only be spent on the project you picked
          </p>
        </div>

        {f < clickF + 34 && <Cursor x={cursor.x} y={cursor.y} pressed={clickPulse(f, [clickF])} />}
      </AbsoluteFill>
      <Sfx at={clickF} name="click" volume={0.45} />
      <Sfx at={clickF + 10} name="whoosh" volume={0.3} />
      {DEMO.picks.map((_, i) => (
        <Sfx key={i} at={clickF + 26 + i * 12} name="coin" volume={0.32} />
      ))}
      <Sfx at={onlyAt} name="stamp" volume={0.5} />
    </Bg>
  )
}

