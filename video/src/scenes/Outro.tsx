import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion'
import { Check, Globe, Heart, Landmark, Mail } from 'lucide-react'
import { Bg, BrandIcon, C, INK, LogoMark, Sfx, Squiggle, Sticker, outro, pop, ramp, rise, sp } from '../kit'
import { OWNER, SITE_URL } from '../config'
import { lineOf, wordAt, type PlacedScene } from '../timeline'

/* ───────────────────────── 13 · Everybody wins ───────────────────────── */

export function WinWinScene({ scene }: { scene: PlacedScene }) {
  const f = useCurrentFrame()
  const you = lineOf(scene, 'you')
  const left = sp(f, 0, { damping: 16, stiffness: 120 })
  const right = sp(f, you.from - 10, { damping: 16, stiffness: 120 })
  const buildAt = wordAt(scene, 'you', 'build')

  const govtPoints = [
    { t: 'Transparent governance', at: wordAt(scene, 'govt', 'transparent') },
    { t: 'Trust of taxpayers', at: wordAt(scene, 'govt', 'trust') },
    { t: 'A ranked wishlist for every Budget', at: wordAt(scene, 'govt', 'paying') + 6 },
  ]
  const youPoints = [
    { t: 'A real say in where your tax goes', at: you.from + 2 },
    { t: 'Every rupee tracked', at: wordAt(scene, 'you', 'knowing') },
    { t: 'Pride in building your nation', at: wordAt(scene, 'you', 'paying') + 4 },
  ]

  return (
    <AbsoluteFill style={{ background: C.paper, opacity: outro(f, scene.duration) }}>
      <Panel x={0} shift={(1 - left) * -960} color={C.blue} icon={<Landmark size={64} />} title="For the government" points={govtPoints} f={f} />
      <Panel x={960} shift={(1 - right) * 960} color={C.pink} icon={<Heart size={64} />} title="For you" points={youPoints} f={f} />
      <div className="absolute" style={{ left: 956, top: 0, bottom: 0, width: 8, background: INK }} />

      <div className="absolute flex w-full justify-center" style={{ top: 870, zIndex: 5 }}>
        <div style={pop(f, buildAt + 4, -3, 0.4)}>
          <Sticker tone="marigold" size={58}>Not just paying for India. Building it.</Sticker>
        </div>
      </div>
      <Sfx at={0} name="whoosh" volume={0.3} />
      <Sfx at={you.from - 10} name="whoosh" volume={0.3} />
      {[...govtPoints, ...youPoints].map((p) => (
        <Sfx key={p.t} at={p.at} name="pop" volume={0.28} />
      ))}
      <Sfx at={buildAt + 4} name="stamp" volume={0.55} />
    </AbsoluteFill>
  )
}

function Panel({
  x, shift, color, icon, title, points, f,
}: { x: number; shift: number; color: string; icon: React.ReactNode; title: string; points: { t: string; at: number }[]; f: number }) {
  return (
    <div className="absolute overflow-hidden" style={{ left: x, top: 0, width: 960, height: 1080, background: color, transform: `translateX(${shift}px)` }}>
      <div className="bg-dots absolute inset-0" style={{ opacity: 0.18 }} />
      <div className="relative" style={{ padding: '120px 90px' }}>
        <span className="flex items-center justify-center rounded-full bg-white" style={{ width: 130, height: 130, border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, color: INK }}>
          {icon}
        </span>
        <h2 className="font-display font-extrabold" style={{ fontSize: 86, letterSpacing: '-0.04em', color: '#fff', marginTop: 34, lineHeight: 1 }}>{title}</h2>
        <div className="flex flex-col" style={{ gap: 22, marginTop: 44 }}>
          {points.map((p, i) => (
            <div key={p.t} style={pop(f, p.at, i % 2 ? 1 : -1, 0.6)}>
              <span className="inline-flex items-center gap-4 whitespace-nowrap font-display font-extrabold" style={{ fontSize: 36, background: '#fff', color: INK, border: `5px solid ${INK}`, boxShadow: `7px 7px 0 ${INK}`, borderRadius: 24, padding: '16px 26px' }}>
                <Check size={38} strokeWidth={3.2} color={color} /> {p.t}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── 14 · "It's a far-fetched idea" ───────────────────────── */

const NOTES = [
  { t: 'What stops fraud?', x: 120, y: 330, r: -6, bg: '#FFF1C7' },
  { t: 'Is 10% even legal?', x: 560, y: 290, r: 4, bg: '#FFE0EB' },
  { t: 'Who picks the projects?', x: 1000, y: 320, r: -3, bg: '#EEE5FF' },
  { t: 'What if a project fails?', x: 1430, y: 300, r: 6, bg: '#D8F6E6' },
  { t: "Won't the rich get more say?", x: 230, y: 660, r: 3, bg: '#E2E7FF' },
  { t: 'What about my privacy?', x: 1320, y: 650, r: -5, bg: '#FFE6D1' },
]

export function EdgeScene({ scene }: { scene: PlacedScene }) {
  const f = useCurrentFrame()
  const line = lineOf(scene, 'edge')
  const thinking = wordAt(scene, 'edge', 'hundred')
  const good = wordAt(scene, 'edge', 'good')
  const shoot = wordAt(scene, 'edge', 'shoot')
  const reveal = ramp(f, [line.from, line.from + 34])
  const dim = interpolate(f, [shoot - 4, shoot + 6], [1, 0.45], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <Bg>
      <AbsoluteFill style={{ opacity: outro(f, scene.duration) }}>
        <div className="absolute flex w-full justify-center" style={{ top: 70 }}>
          <p className="font-hand" style={{ fontSize: 110, color: INK, clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)` }}>
            I know… it's a far-fetched idea.
          </p>
        </div>
        {NOTES.map((n, i) => {
          const at = thinking + i * 6
          const s = sp(f, at, { damping: 13, stiffness: 150 })
          const fromX = n.x < 900 ? -500 : 2300
          const wobble = f > good && f < shoot ? Math.sin((f + i * 7) / 2.2) * 2 : 0
          return (
            <div
              key={n.t}
              className="absolute"
              style={{ left: fromX + (n.x - fromX) * s, top: n.y, width: 380, transform: `rotate(${n.r + wobble}deg)`, opacity: Math.min(1, s * 2) * dim }}
            >
              <div className="relative" style={{ background: n.bg, border: `5px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, borderRadius: 10, padding: '44px 28px 34px' }}>
                <span className="absolute" style={{ left: 130, top: -16, width: 120, height: 34, background: 'rgba(255,255,255,.75)', border: `3px solid rgba(22,19,15,.25)`, transform: 'rotate(-3deg)' }} />
                <p className="font-hand font-bold" style={{ fontSize: 40, lineHeight: 1.1, color: INK }}>{n.t}</p>
              </div>
            </div>
          )
        })}
        <div className="absolute flex w-full flex-col items-center" style={{ top: 470, zIndex: 5 }}>
          <p className="font-hand font-bold" style={{ fontSize: 90, color: C.pink, ...pop(f, good, -6, 0.3) }}>Good.</p>
          <div style={{ marginTop: 10, ...pop(f, shoot, -4, 0.3) }}>
            <Sticker tone="marigold" size={92}>Shoot them my way 🎯</Sticker>
          </div>
        </div>
      </AbsoluteFill>
      {NOTES.map((n, i) => (
        <Sfx key={n.t} at={thinking + i * 6} name="pop" volume={0.25} />
      ))}
      <Sfx at={good} name="tick" volume={0.4} />
      <Sfx at={shoot} name="stamp" volume={0.6} />
    </Bg>
  )
}

/* ───────────────────────── 15 · Building in public ───────────────────────── */

export function PublicScene({ scene }: { scene: PlacedScene }) {
  const f = useCurrentFrame()
  const line = lineOf(scene, 'public')
  const feedbackAt = wordAt(scene, 'public', 'feedback')
  const tryAt = wordAt(scene, 'public', 'try it')
  const contacts = [
    { icon: <BrandIcon name="linkedin" size={40} />, t: OWNER.linkedin, bg: '#0A66C2', fg: '#fff' },
    { icon: <Mail size={40} strokeWidth={2.4} />, t: OWNER.email, bg: '#fff', fg: INK },
    { icon: <Globe size={40} strokeWidth={2.4} />, t: SITE_URL, bg: C.marigold, fg: INK },
  ]

  return (
    <Bg color={INK} pattern="none">
      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.08) 2.4px, transparent 2.4px)', backgroundSize: '28px 28px' }} />
      <AbsoluteFill style={{ opacity: outro(f, scene.duration, 6) }}>
        <div className="absolute" style={{ left: 160, top: 110, ...pop(f, line.from - 6, -4) }}>
          <Sticker tone="marigold" size={40}>Building in public</Sticker>
        </div>
        <div
          className="absolute overflow-hidden rounded-full"
          style={{ left: 160, top: 240, width: 290, height: 290, background: C.pink, border: `8px solid #fff`, boxShadow: `12px 12px 0 ${C.pink}`, ...pop(f, line.from, -6, 0.4) }}
        >
          <Img src={staticFile('shaleen.webp')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 18%', transform: 'scale(1.7)', transformOrigin: '50% 26%' }} />
        </div>
        <div className="absolute" style={{ left: 510, top: 262, ...rise(f, line.from + 4) }}>
          <p className="font-display font-extrabold" style={{ fontSize: 112, lineHeight: 1, letterSpacing: '-0.04em', color: '#fff' }}>{OWNER.name}</p>
          <p style={{ fontSize: 38, color: 'rgba(255,255,255,.7)', marginTop: 14 }}>{OWNER.role}</p>
        </div>
        <div className="absolute flex flex-col items-start" style={{ left: 500, top: 480, gap: 22 }}>
          {contacts.map((c, i) => (
            <div key={c.t} style={pop(f, feedbackAt + i * 6, i % 2 ? 1 : -1, 0.5)}>
              <span className="inline-flex items-center gap-4 font-display font-bold" style={{ fontSize: 42, background: c.bg, color: c.fg, border: `5px solid #fff`, borderRadius: 99, padding: '14px 32px' }}>
                {c.icon} {c.t}
              </span>
            </div>
          ))}
        </div>
        <p className="absolute font-hand" style={{ left: 160, top: 860, fontSize: 74, color: C.marigold, ...rise(f, tryAt) }}>
          Try it. Break it. Tell me what you think.
        </p>
      </AbsoluteFill>
      {contacts.map((c, i) => (
        <Sfx key={c.t} at={feedbackAt + i * 6} name="pop" volume={0.3} />
      ))}
      <Sfx at={line.from} name="whoosh" volume={0.3} />
    </Bg>
  )
}

/* ───────────────────────── 16 · End card ───────────────────────── */

export function EndScene({ scene }: { scene: PlacedScene }) {
  const f = useCurrentFrame()
  const line = lineOf(scene, 'end')
  const tag = wordAt(scene, 'end', 'your tax')

  return (
    <Bg color={C.marigold} pattern="dots">
      <AbsoluteFill className="flex flex-col items-center justify-center" style={{ paddingBottom: 30 }}>
        <div className="flex items-center" style={{ gap: 40, ...pop(f, 0, 0, 0.5) }}>
          <LogoMark size={210} />
          <span className="font-display font-extrabold" style={{ fontSize: 230, lineHeight: 0.9, letterSpacing: '-0.05em', color: INK }}>Nirmaan</span>
        </div>
        <div className="relative" style={{ marginTop: 50, ...pop(f, tag, 0, 0.5) }}>
          <p className="font-display font-extrabold" style={{ fontSize: 104, letterSpacing: '-0.04em', color: INK }}>
            Your tax. <span style={{ color: '#fff', WebkitTextStroke: `6px ${INK}` }}>Your say.</span>
          </p>
          <span className="absolute" style={{ right: 0, bottom: -24 }}>
            <Squiggle progress={ramp(f, [tag + 8, tag + 26])} color={C.pink} width={500} height={38} strokeWidth={15} />
          </span>
        </div>
        <div style={{ marginTop: 70, ...rise(f, line.from + 20) }}>
          <span className="inline-flex items-center gap-4 font-display font-extrabold" style={{ fontSize: 48, background: INK, color: C.marigold, border: `5px solid ${INK}`, boxShadow: `8px 8px 0 rgba(22,19,15,.3)`, borderRadius: 99, padding: '18px 44px' }}>
            <Globe size={46} /> {SITE_URL}
          </span>
        </div>
        <p className="font-hand" style={{ fontSize: 40, color: INK, marginTop: 34, ...rise(f, line.from + 30) }}>
          A concept, built in public by {OWNER.name}
        </p>
      </AbsoluteFill>
      <Sfx at={0} name="whoosh" volume={0.3} />
      <Sfx at={tag} name="coin" volume={0.4} />
    </Bg>
  )
}
