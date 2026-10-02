import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { Lock, LockOpen } from 'lucide-react'
import { Bg, C, INK, Sfx, Sticker, outro, pop, rise, sp } from '../kit'
import { lineOf, wordAt, type PlacedScene } from '../timeline'

const BAR_X = 120
const BAR_W = 1680
const BAR_Y = 360
const BAR_H = 220

export function Split9010Scene({ scene }: { scene: PlacedScene }) {
  const f = useCurrentFrame()
  const ninety = lineOf(scene, 'ninety')
  const ten = lineOf(scene, 'ten')
  const splitAt = ninety.from + 8
  const split = sp(f, splitAt, { damping: 16, stiffness: 120 })
  const lockAt = wordAt(scene, 'ninety', 'keeps')
  const lock = sp(f, lockAt, { damping: 9, stiffness: 240 })
  const lift = sp(f, ten.from + 4, { damping: 11, stiffness: 150 })
  const dim = interpolate(f, [ten.from, ten.from + 12], [1, 0.38], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const chipsGone = interpolate(f, [ten.from, ten.from + 10], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const startsAt = wordAt(scene, 'ten', 'starts')

  const ninetyW = BAR_W * (1 - 0.1 * split) - 14 * split
  const tenX = BAR_X + BAR_W * 0.9 + 14 * (1 - split)

  const chips = [
    { t: '🛡️ Defence', at: wordAt(scene, 'ninety', 'defence'), r: -4 },
    { t: '💳 Interest', at: wordAt(scene, 'ninety', 'interest'), r: 3 },
    { t: "🏛️ States' share", at: wordAt(scene, 'ninety', 'states'), r: -2 },
    { t: '🌾 Subsidies', at: wordAt(scene, 'ninety', 'states') + 10, r: 4 },
    { t: '👵 Pensions', at: wordAt(scene, 'ninety', 'states') + 18, r: -3 },
  ]

  return (
    <Bg>
      <AbsoluteFill style={{ opacity: outro(f, scene.duration) }}>
        {/* headline swaps between the two beats */}
        <div className="absolute" style={{ left: BAR_X, top: 110 }}>
          {f < ten.from ? (
            <h2 className="font-display font-extrabold" style={{ fontSize: 96, letterSpacing: '-0.04em', color: INK, ...rise(f, ninety.from - 6) }}>
              Not every rupee can be opened up.
            </h2>
          ) : (
            <h2 className="font-display font-extrabold" style={{ fontSize: 96, letterSpacing: '-0.04em', color: INK, ...rise(f, ten.from) }}>
              But the <span style={{ background: C.marigold, padding: '0 16px', borderRadius: 16 }}>debatable slice</span> can.
            </h2>
          )}
        </div>

        {/* the 90% */}
        <div
          className="absolute flex items-center"
          style={{
            left: BAR_X,
            top: BAR_Y,
            width: f < splitAt ? BAR_W : ninetyW,
            height: BAR_H,
            background: INK,
            borderRadius: 36,
            border: `6px solid ${INK}`,
            boxShadow: `14px 14px 0 rgba(22,19,15,.25)`,
            padding: '0 56px',
            opacity: dim,
          }}
        >
          <div className="flex items-center" style={{ gap: 30, color: '#fff' }}>
            <span
              className="flex items-center justify-center rounded-full"
              style={{ width: 120, height: 120, background: C.marigold, border: `5px solid #fff`, color: INK, transform: `scale(${lock}) rotate(${(1 - lock) * -40}deg)`, opacity: lock }}
            >
              <Lock size={62} strokeWidth={2.6} />
            </span>
            <div>
              <p className="font-display font-extrabold" style={{ fontSize: 84, lineHeight: 1 }}>{f < splitAt ? '100%' : '90%'}</p>
              <p className="font-display font-bold" style={{ fontSize: 40, opacity: 0.85 }}>{f < splitAt ? 'Your income tax' : 'keeps India running'}</p>
            </div>
          </div>
        </div>

        {/* the 10% */}
        {f >= splitAt && (
          <div
            className="absolute flex items-center justify-center"
            style={{
              left: tenX,
              top: BAR_Y,
              width: BAR_W * 0.1,
              height: BAR_H,
              background: C.marigold,
              borderRadius: 30,
              border: `6px solid ${INK}`,
              boxShadow: `${8 + lift * 8}px ${8 + lift * 8}px 0 ${INK}`,
              transform: `translateY(${-lift * 46}px) rotate(${-lift * 7}deg) scale(${1 + lift * 0.1})`,
              opacity: Math.min(1, split * 2),
              zIndex: 5,
            }}
          >
            <div className="flex flex-col items-center" style={{ color: INK }}>
              {lift > 0.1 ? <LockOpen size={54} strokeWidth={2.6} /> : <Lock size={54} strokeWidth={2.6} />}
              <p className="font-display font-extrabold" style={{ fontSize: 54, lineHeight: 1, marginTop: 6 }}>10%</p>
            </div>
          </div>
        )}

        {/* what's inside the 90% */}
        <div className="absolute flex flex-wrap" style={{ left: BAR_X, top: BAR_Y + BAR_H + 56, width: 1500, gap: 26, opacity: chipsGone }}>
          {chips.map((c) => (
            <div key={c.t} style={pop(f, c.at, c.r)}>
              <Sticker tone="white" size={42}>{c.t}</Sticker>
            </div>
          ))}
        </div>

        {/* callout for the 10% */}
        {f >= ten.from && (
          <div className="absolute" style={{ right: 120, top: BAR_Y + BAR_H + 50, width: 860, ...pop(f, ten.from + 10, -2, 0.7) }}>
            <div style={{ background: '#fff', border: `6px solid ${INK}`, boxShadow: `14px 14px 0 ${INK}`, borderRadius: 34, padding: '30px 38px' }}>
              <p className="font-mono font-bold uppercase" style={{ fontSize: 22, letterSpacing: '0.16em', color: C.pink }}>The other 10%</p>
              <p className="font-display font-extrabold" style={{ fontSize: 52, lineHeight: 1.02, marginTop: 10, color: INK }}>
                Projects the government isn't sure about, decided by the people who pay for them.
              </p>
            </div>
          </div>
        )}

        <div className="absolute" style={{ left: BAR_X + 10, top: BAR_Y + BAR_H + 110, ...pop(f, startsAt, -4) }}>
          <Sticker tone="pink" size={50}>Nirmaan starts with 10%</Sticker>
        </div>
      </AbsoluteFill>
      <Sfx at={splitAt} name="whoosh" volume={0.3} />
      {chips.map((c) => (
        <Sfx key={c.t} at={c.at} name="pop" volume={0.25} />
      ))}
      <Sfx at={lockAt} name="stamp" volume={0.45} />
      <Sfx at={ten.from + 4} name="coin" volume={0.35} />
      <Sfx at={startsAt} name="pop" volume={0.4} />
    </Bg>
  )
}

