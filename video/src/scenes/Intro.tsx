import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { Bg, C, INK, LogoMark, Sfx, Squiggle, Sticker, outro, pop, ramp, rise, sp } from '../kit'
import { lineOf, wordAt, type PlacedScene } from '../timeline'

/* ───────────────────────── 1 · Hook: the family WhatsApp group ───────────────────────── */

const CHAT = [
  { who: 'Rahul', text: 'Salary credited. TDS took ₹67,000 again 😤', me: false, color: C.blue },
  { who: 'You', text: 'And the road outside office still looks like the moon 🌚', me: true, color: '' },
  { who: 'Priya', text: 'Where the hell is all our tax money going??', me: false, color: C.pink },
  { who: 'Kabir', text: 'Nobody asks us. We just pay 🙏', me: false, color: C.mint },
  { who: 'You', text: 'What if we could decide? 🤔', me: true, color: '' },
]

export function HookScene({ scene }: { scene: PlacedScene }) {
  const f = useCurrentFrame()
  const where = wordAt(scene, 'hook', 'where')
  const times = [0, 28, where - 4, where + 32, scene.duration - 46]
  const fade = outro(f, scene.duration)

  return (
    <Bg>
      <AbsoluteFill style={{ opacity: fade }}>
        {/* phone */}
        <div
          className="absolute overflow-hidden"
          style={{ left: 150, top: 70, width: 640, height: 930, borderRadius: 64, background: INK, border: `6px solid ${INK}`, boxShadow: `16px 16px 0 ${INK}`, padding: 14, ...rise(f, -10, 30) }}
        >
          <div className="flex h-full flex-col overflow-hidden" style={{ borderRadius: 50, background: '#EFE7DC' }}>
            <div className="flex items-center gap-4" style={{ background: C.mint, borderBottom: `5px solid ${INK}`, padding: '34px 30px 22px' }}>
              <span className="flex items-center justify-center rounded-full" style={{ width: 70, height: 70, background: C.marigold, border: `4px solid ${INK}`, fontSize: 38 }}>
                ☕
              </span>
              <div style={{ color: '#fff' }}>
                <p className="font-display font-extrabold" style={{ fontSize: 36 }}>Chai Sutta Gang</p>
                <p style={{ fontSize: 20, opacity: 0.85 }}>Rahul, Priya, Kabir, You</p>
              </div>
            </div>
            <div className="bg-dots flex flex-1 flex-col justify-end gap-4" style={{ padding: 26 }}>
              {CHAT.map((m, i) => {
                const t = times[i]
                if (f < t - 12) return null
                const typing = f < t
                return (
                  <div key={i} className={`flex ${m.me ? 'justify-end' : 'justify-start'}`} style={typing ? { opacity: 0.9 } : pop(f, t, 0, 0.6)}>
                    {typing ? (
                      <div className="flex gap-2 rounded-3xl bg-white" style={{ border: `4px solid ${INK}`, padding: '16px 22px' }}>
                        {[0, 1, 2].map((d) => (
                          <span key={d} className="rounded-full" style={{ width: 12, height: 12, background: '#9a9389', opacity: 0.4 + 0.6 * Math.abs(Math.sin((f + d * 4) / 4)) }} />
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          maxWidth: 470,
                          background: m.me ? '#D9FDD3' : '#fff',
                          border: `4px solid ${INK}`,
                          boxShadow: `5px 5px 0 ${INK}`,
                          borderRadius: 28,
                          borderBottomRightRadius: m.me ? 8 : 28,
                          borderBottomLeftRadius: m.me ? 28 : 8,
                          padding: '14px 22px',
                        }}
                      >
                        {!m.me && <p className="font-bold" style={{ fontSize: 22, color: m.color }}>{m.who}</p>}
                        <p className="font-medium" style={{ fontSize: 31, lineHeight: 1.25, color: INK }}>{m.text}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* right side: the question */}
        <div className="absolute" style={{ left: 900, top: 150, width: 920 }}>
          <div style={pop(f, 4, -5)}>
            <Sticker tone="marigold" size={44}>Be honest 👀</Sticker>
          </div>
          <p className="font-display font-bold" style={{ fontSize: 66, lineHeight: 1.05, marginTop: 48, color: INK, ...rise(f, wordAt(scene, 'hook', 'chai')) }}>
            Every chai-sutta break. Every house party. It ends with…
          </p>
          <div style={{ marginTop: 34, ...pop(f, where, -2, 0.7) }}>
            <p className="font-display font-extrabold" style={{ fontSize: 112, lineHeight: 1.1, letterSpacing: '-0.035em', color: INK }}>
              “Where the hell is all my{' '}
              <span style={{ background: C.marigold, padding: '0 14px', borderRadius: 14, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>tax money</span> going?”
            </p>
          </div>
          <div style={{ marginTop: 46, ...pop(f, scene.duration - 40, 4) }}>
            <Sticker tone="pink" size={40}>Every. Single. Time.</Sticker>
          </div>
        </div>
      </AbsoluteFill>

      {times.map((t, i) => (i === 0 ? null : <Sfx key={i} at={t} name="ding" volume={0.22} />))}
      <Sfx at={where} name="pop" volume={0.35} />
    </Bg>
  )
}

/* ───────────────────────── 2 · Pain: 30% tax, zero say ───────────────────────── */

export function PainScene({ scene }: { scene: PlacedScene }) {
  const f = useCurrentFrame()
  const line = lineOf(scene, 'pain')
  const still = wordAt(scene, 'pain', 'still')
  const zero = wordAt(scene, 'pain', 'zero')
  const items = [
    { e: '💧', t: 'Water', at: wordAt(scene, 'pain', 'water'), tone: 'blue' as const, r: -5 },
    { e: '🛡️', t: 'Security', at: wordAt(scene, 'pain', 'security'), tone: 'marigold' as const, r: 4 },
    { e: '🎒', t: 'Schools', at: wordAt(scene, 'pain', 'schools'), tone: 'mint' as const, r: -3 },
  ]
  const pct = Math.round(ramp(f, [line.from + 4, line.from + 34], [0, 30]))
  const beat1 = interpolate(f, [still - 8, still + 2], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const beat2 = interpolate(f, [zero - 6, zero + 4], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const stamp = sp(f, zero, { damping: 11, stiffness: 260 })
  const shake = f >= zero && f < zero + 10 ? Math.sin(f * 2.3) * (10 - (f - zero)) * 1.6 : 0

  return (
    <Bg>
      <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.6}px)`, opacity: outro(f, scene.duration) }}>
        {/* beat 1 */}
        {beat1 > 0 && (
          <AbsoluteFill className="flex flex-col items-center justify-center" style={{ opacity: beat1, paddingBottom: 90 }}>
            <p className="font-display font-bold" style={{ fontSize: 76, color: INK, ...rise(f, line.from) }}>We pay up to</p>
            <p className="font-display font-extrabold" style={{ fontSize: 400, lineHeight: 0.9, letterSpacing: '-0.05em', color: C.pink, WebkitTextStroke: `8px ${INK}`, ...pop(f, line.from + 2, -3, 0.6) }}>
              {pct}%
            </p>
            <p className="font-display font-bold" style={{ fontSize: 76, color: INK, ...rise(f, line.from + 10) }}>in income tax</p>
          </AbsoluteFill>
        )}

        {/* beat 2 */}
        {f >= still - 4 && (
          <AbsoluteFill className="flex flex-col items-center justify-center" style={{ opacity: beat2, paddingBottom: 110 }}>
            <p className="font-display font-extrabold" style={{ fontSize: 86, color: INK, ...rise(f, still) }}>
              …and we <span style={{ color: C.pink }}>still</span> pay for our own
            </p>
            <div className="flex" style={{ gap: 44, marginTop: 64 }}>
              {items.map((it) => (
                <div key={it.t} style={pop(f, it.at, it.r)}>
                  <Sticker tone={it.tone} size={74}>
                    <span style={{ fontSize: 84 }}>{it.e}</span> {it.t}
                  </Sticker>
                </div>
              ))}
            </div>
          </AbsoluteFill>
        )}

        {/* beat 3: the stamp */}
        {f >= zero && (
          <AbsoluteFill className="flex flex-col items-center justify-center" style={{ paddingBottom: 110 }}>
            <div
              className="font-display font-extrabold uppercase"
              style={{
                fontSize: 250,
                lineHeight: 1,
                color: '#E4002B',
                border: '16px solid #E4002B',
                borderRadius: 40,
                padding: '10px 60px 24px',
                background: 'rgba(255,255,255,.85)',
                transform: `scale(${3 - 2 * stamp}) rotate(${-8 * stamp}deg)`,
                opacity: Math.min(1, stamp * 3),
                letterSpacing: '-0.03em',
              }}
            >
              Zero say
            </div>
            <p className="font-display font-bold" style={{ fontSize: 64, marginTop: 50, color: INK, ...rise(f, zero + 12) }}>
              in how a single rupee is spent.
            </p>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
      {items.map((it) => (
        <Sfx key={it.t} at={it.at} name="pop" volume={0.3} />
      ))}
      <Sfx at={zero} name="stamp" volume={0.75} />
    </Bg>
  )
}

/* ───────────────────────── 3 · What if you could choose? ───────────────────────── */

const WISHES = [
  { e: '🏃', t: 'A jogging track', s: 'in your neighbourhood park', bg: C.saffron, word: 'jogging', r: -4 },
  { e: '⚡', t: 'EV chargers', s: "you're betting big on electric", bg: C.mint, word: 'chargers', r: 3 },
  { e: '🚛', t: 'Garbage trucks', s: 'that actually show up', bg: C.blue, word: 'garbage', r: -2 },
  { e: '🔬', t: "India's own chip labs", s: 'made-in-India silicon', bg: C.teal, word: 'chip', r: 4 },
]

export function WhatIfScene({ scene }: { scene: PlacedScene }) {
  const f = useCurrentFrame()
  const q = lineOf(scene, 'whatif')
  const words = ['What', 'if', 'you', 'could', 'choose?']
  const last = wordAt(scene, 'wishes', 'chip')

  return (
    <Bg>
      <AbsoluteFill style={{ opacity: outro(f, scene.duration) }}>
        <div className="absolute flex w-full justify-center" style={{ top: 90 }}>
          <h1 className="font-display font-extrabold" style={{ fontSize: 150, letterSpacing: '-0.04em', color: INK, display: 'flex', gap: 34 }}>
            {words.map((w, i) => (
              <span key={w} className="relative inline-block" style={{ ...pop(f, q.from + i * 5, 0, 0.3), color: i === 4 ? C.pink : INK }}>
                {w}
                {i === 4 && (
                  <span className="absolute" style={{ left: 0, bottom: -18 }}>
                    <Squiggle progress={ramp(f, [q.from + 26, q.from + 46])} color={C.marigold} width={470} height={40} strokeWidth={16} />
                  </span>
                )}
              </span>
            ))}
          </h1>
        </div>

        <div className="absolute flex" style={{ left: 100, top: 380, gap: 40 }}>
          {WISHES.map((w) => {
            const at = wordAt(scene, 'wishes', w.word)
            return (
              <div
                key={w.t}
                className="flex flex-col"
                style={{
                  width: 400,
                  height: 470,
                  borderRadius: 40,
                  background: w.bg,
                  border: `6px solid ${INK}`,
                  boxShadow: `14px 14px 0 ${INK}`,
                  padding: 36,
                  color: '#fff',
                  ...pop(f, at, w.r),
                }}
              >
                <span className="flex items-center justify-center rounded-full bg-white" style={{ width: 132, height: 132, border: `5px solid ${INK}`, fontSize: 76 }}>
                  {w.e}
                </span>
                <p className="font-display font-extrabold" style={{ fontSize: 54, lineHeight: 1, marginTop: 40, letterSpacing: '-0.03em' }}>{w.t}</p>
                <p className="font-hand" style={{ fontSize: 34, lineHeight: 1.15, marginTop: 14, opacity: 0.95 }}>{w.s}</p>
              </div>
            )
          })}
        </div>

        <div className="absolute flex w-full justify-center" style={{ top: 935, ...pop(f, last + 34, -3) }}>
          <Sticker tone="ink" size={42}>You decide where it goes ✓</Sticker>
        </div>
      </AbsoluteFill>
      <Sfx at={q.from} name="whoosh" volume={0.3} />
      {WISHES.map((w) => (
        <Sfx key={w.t} at={wordAt(scene, 'wishes', w.word)} name="pop" volume={0.35} />
      ))}
    </Bg>
  )
}

/* ───────────────────────── 4 · Title: Meet Nirmaan ───────────────────────── */

export function TitleScene({ scene }: { scene: PlacedScene }) {
  const f = useCurrentFrame()
  const letters = 'Nirmaan'.split('')
  const tag = wordAt(scene, 'meet', 'your tax')

  return (
    <Bg color={C.marigold} pattern="dots">
      <AbsoluteFill className="flex flex-col items-center justify-center" style={{ opacity: outro(f, scene.duration, 6), paddingBottom: 40 }}>
        <div className="flex items-center" style={{ gap: 46 }}>
          <div style={pop(f, 0, -8, 0)}>
            <LogoMark size={250} />
          </div>
          <div className="flex flex-col">
            <div className="flex font-display font-extrabold" style={{ fontSize: 270, lineHeight: 0.85, letterSpacing: '-0.05em', color: INK }}>
              {letters.map((l, i) => {
                const s = sp(f, 5 + i * 2.5, { damping: 10, stiffness: 220 })
                return (
                  <span key={i} style={{ display: 'inline-block', transform: `translateY(${(1 - s) * -220}px)`, opacity: Math.min(1, s * 2) }}>
                    {l}
                  </span>
                )
              })}
            </div>
            <p className="font-hand" style={{ fontSize: 64, color: INK, marginTop: 6, ...rise(f, 22) }}>निर्माण · build india</p>
          </div>
        </div>

        <div className="relative" style={{ marginTop: 70, ...pop(f, tag, 0, 0.5) }}>
          <p className="font-display font-extrabold" style={{ fontSize: 120, letterSpacing: '-0.04em', color: INK }}>
            Your tax. <span style={{ color: '#fff', WebkitTextStroke: `6px ${INK}` }}>Your say.</span>
          </p>
          <span className="absolute" style={{ right: 0, bottom: -26 }}>
            <Squiggle progress={ramp(f, [tag + 10, tag + 30])} color={C.pink} width={560} height={40} strokeWidth={16} />
          </span>
        </div>
      </AbsoluteFill>

      <div className="absolute" style={{ left: 130, bottom: 110, ...pop(f, 16, -10) }}>
        <TruckArt />
      </div>
      <div className="absolute" style={{ right: 140, top: 140, ...pop(f, 20, 10) }}>
        <Sticker tone="blue" size={40}>e₹ tracked</Sticker>
      </div>
      <div className="absolute" style={{ right: 200, bottom: 120, ...pop(f, tag + 8, -6) }}>
        <Sticker tone="pink" size={40}>10% is yours</Sticker>
      </div>
      <Sfx at={0} name="whoosh" volume={0.35} />
      <Sfx at={tag} name="pop" volume={0.4} />
    </Bg>
  )
}

/** "Horn OK Please" truck-art becomes "Tax OK Please" */
export function TruckArt({ scale = 1 }: { scale?: number }) {
  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
      <div style={{ background: '#FFE14D', border: `6px solid ${INK}`, borderRadius: 24, padding: 8, boxShadow: `8px 8px 0 ${INK}` }}>
        <div style={{ border: '5px dashed #E4002B', borderRadius: 16, padding: '12px 30px', textAlign: 'center' }}>
          <p className="font-display font-extrabold uppercase" style={{ fontSize: 26, letterSpacing: '0.22em', color: '#0A7E3E' }}>Tax</p>
          <p className="font-display font-extrabold uppercase" style={{ fontSize: 50, lineHeight: 1, color: '#E4002B' }}>OK Please</p>
          <p style={{ fontSize: 18, color: C.blue, marginTop: 4 }}>★ ✿ ★</p>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── 1b · The three Indias ───────────────────────── */

const INDIAS = [
  {
    n: '1', key: 'india one', title: 'The ultra-rich', bg: INK, fg: '#fff', accent: C.marigold, r: -3,
    points: ['Invest & create jobs', 'Direct line to the government'], badge: '📞 Govt listens',
  },
  {
    n: '2', key: 'india two', title: 'The salaried, corporate crowd', bg: C.pink, fg: '#fff', accent: '#fff', r: 0,
    points: ['Pays the income tax', 'Gets no say in how it is spent'], badge: '👋 That’s us',
  },
  {
    n: '3', key: 'india three', title: 'The underprivileged', bg: C.mint, fg: '#fff', accent: '#fff', r: 3,
    points: ['Schemes & subsidies', 'Support to rise out of poverty'], badge: '🤝 Govt supports',
  },
]

export function ThreeIndiasScene({ scene }: { scene: PlacedScene }) {
  const f = useCurrentFrame()
  const line = lineOf(scene, 'three')
  const twoAt = wordAt(scene, 'three', 'india two')
  const usAt = wordAt(scene, 'three', 'us.')
  const focus = sp(f, twoAt, { damping: 14, stiffness: 120 })

  return (
    <Bg>
      <AbsoluteFill style={{ opacity: outro(f, scene.duration) }}>
        <div className="absolute flex w-full justify-center" style={{ top: 70 }}>
          <h2 className="font-display font-extrabold" style={{ fontSize: 104, letterSpacing: '-0.04em', color: INK, ...pop(f, line.from + 6, 0, 0.5) }}>
            There are <span style={{ color: C.pink }}>three Indias.</span>
          </h2>
        </div>
        {INDIAS.map((c, i) => {
          const at = wordAt(scene, 'three', c.key)
          const isTwo = c.n === '2'
          const scale = isTwo ? 1 + focus * 0.1 : 1 - focus * 0.06
          const dim = isTwo ? 1 : 1 - focus * 0.45
          return (
            <div
              key={c.n}
              className="absolute"
              style={{ left: 110 + i * 580, top: 250, width: 540, zIndex: isTwo ? 5 : 1, opacity: dim, transform: `scale(${scale})`, transformOrigin: 'center top' }}
            >
              <div style={pop(f, at, c.r, 0.4)}>
                <div style={{ background: c.bg, color: c.fg, border: `6px solid ${INK}`, boxShadow: `14px 14px 0 ${INK}`, borderRadius: 36, padding: '34px 36px', height: 560 }}>
                  <p className="font-mono font-bold uppercase" style={{ fontSize: 24, letterSpacing: '0.2em', color: c.accent }}>India</p>
                  <p className="font-display font-extrabold" style={{ fontSize: 170, lineHeight: 0.9, color: c.accent }}>{c.n}</p>
                  <p className="font-display font-extrabold" style={{ fontSize: 46, lineHeight: 1.02, marginTop: 14 }}>{c.title}</p>
                  <div className="flex flex-col" style={{ gap: 10, marginTop: 22 }}>
                    {c.points.map((t) => (
                      <p key={t} className="font-semibold" style={{ fontSize: 28, lineHeight: 1.2, opacity: 0.92 }}>• {t}</p>
                    ))}
                  </div>
                </div>
                <div className="absolute" style={{ right: -14, bottom: -26, ...pop(f, isTwo ? usAt : at + 14, isTwo ? -6 : 5) }}>
                  <Sticker tone={isTwo ? 'marigold' : 'white'} size={isTwo ? 40 : 30}>{c.badge}</Sticker>
                </div>
              </div>
            </div>
          )
        })}
      </AbsoluteFill>
      {INDIAS.map((c) => (
        <Sfx key={c.n} at={wordAt(scene, 'three', c.key)} name="pop" volume={0.35} />
      ))}
      <Sfx at={usAt} name="stamp" volume={0.5} />
    </Bg>
  )
}
