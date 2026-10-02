import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { BadgeCheck, Camera, HardHat, Landmark, Lock, MapPin, Wallet, type LucideIcon } from 'lucide-react'
import { Bg, C, Coin, Eyebrow, INK, ProjectGlyph, Sfx, outro, pop, ramp, rise, rupees } from '../kit'
import { CATEGORIES, PROJECTS, type Project } from '../../../src/data/projects'
import { lineOf, wordAt, type PlacedScene } from '../timeline'

const X0 = 250
const STEP = 284
const TRACK_Y = 455
const TILTS = [-2.5, 1.5, -1, 2, -1.5, 1]

export function MetroScene({ scene }: { scene: PlacedScene }) {
  const f = useCurrentFrame()
  const line = lineOf(scene, 'metro')
  const p = PROJECTS.find((x) => x.id === 'blr-lake-park') as Project
  const color = CATEGORIES[p.category].color
  const amount = 25_000
  const tranche = amount / 4

  const stations: { name: string; who: string; detail: string; amount: number; icon: LucideIcon; at: number }[] = [
    { name: 'Your wallet', who: 'You · PAN linked', detail: 'Earmarked from your 10%', amount, icon: Wallet, at: line.from + 2 },
    { name: 'e₹ Mint', who: 'RBI e-Rupee rail', detail: 'Purpose-bound to this project', amount, icon: Landmark, at: wordAt(scene, 'metro', 'money metro') + 6 },
    { name: 'Escrow', who: 'Project escrow', detail: 'Locked till milestones verify', amount, icon: Lock, at: wordAt(scene, 'metro', 'escrow') },
    { name: 'Agency', who: 'Greater Bengaluru Authority', detail: 'Milestone 1 verified: track bed', amount: tranche, icon: BadgeCheck, at: wordAt(scene, 'metro', 'agency') },
    { name: 'Vendor', who: 'Kere Restoration Co.', detail: 'Paid for track works', amount: tranche, icon: HardHat, at: wordAt(scene, 'metro', 'vendor') },
    { name: 'Live!', who: '262 citizens verified', detail: 'Geotagged proof on the ground', amount: tranche, icon: Camera, at: wordAt(scene, 'metro', 'live') },
  ]
  const ledgerAt = wordAt(scene, 'metro', 'ledger')
  const proofAt = wordAt(scene, 'metro', 'geotagged')

  // continuous position along the line, arriving at each station on its word
  let posIndex = 0
  for (let i = 1; i < stations.length; i++) posIndex += ramp(f, [stations[i].at - 14, stations[i].at])
  const coinX = X0 + posIndex * STEP
  const hop = Math.abs(Math.sin(posIndex * Math.PI)) * 34
  const live = f >= stations[5].at

  return (
    <Bg>
      <AbsoluteFill style={{ opacity: outro(f, scene.duration) }}>
        <div className="absolute" style={{ left: 110, top: 62, ...rise(f, -8) }}>
          <Eyebrow dot={C.blue}>Track my ₹</Eyebrow>
          <h2 className="font-display font-extrabold" style={{ fontSize: 76, letterSpacing: '-0.04em', color: INK, marginTop: 8 }}>
            Watch your e₹ ride the <span style={{ color: C.blue }}>Money Metro.</span>
          </h2>
        </div>
        <div className="absolute flex items-center gap-4" style={{ left: 110, top: 220, ...rise(f, 4) }}>
          <ProjectGlyph project={p} size={58} />
          <p className="font-display font-extrabold" style={{ fontSize: 32, color: INK }}>{p.title}</p>
          <span className="font-mono font-bold" style={{ fontSize: 20, background: color, color: '#fff', border: `4px solid ${INK}`, borderRadius: 10, padding: '4px 12px' }}>
            NRM-LOC-BLRLAK
          </span>
          <span className="font-display font-extrabold" style={{ fontSize: 30, color: C.pink }}>{rupees(amount)} on this line</span>
        </div>

        {/* track */}
        <div className="absolute" style={{ left: X0, top: TRACK_Y - 16, width: STEP * 5, height: 32, borderRadius: 99, border: `6px solid ${INK}`, background: '#fff' }} />
        <div className="absolute" style={{ left: X0, top: TRACK_Y - 16, width: Math.max(32, posIndex * STEP), height: 32, borderRadius: 99, border: `6px solid ${INK}`, background: color }} />

        {/* stations */}
        {stations.map((s, i) => {
          const x = X0 + i * STEP
          const done = f >= s.at
          const here = done && (i === stations.length - 1 || f < stations[i + 1].at - 14)
          const Icon = s.icon
          const pulse = here ? 1 + Math.sin(f / 4) * 0.06 : 1
          return (
            <div key={s.name}>
              <div
                className="absolute flex items-center justify-center rounded-full"
                style={{
                  left: x - 48,
                  top: TRACK_Y - 48,
                  width: 96,
                  height: 96,
                  border: `6px solid ${INK}`,
                  background: done ? C.marigold : '#fff',
                  color: done ? INK : '#9a9389',
                  transform: `scale(${pulse})`,
                  zIndex: 3,
                }}
              >
                <Icon size={44} strokeWidth={2.4} />
              </div>
              {here && <div className="absolute rounded-full" style={{ left: x - 64, top: TRACK_Y - 64, width: 128, height: 128, border: `5px solid ${color}`, opacity: 0.6 + Math.sin(f / 4) * 0.3 }} />}
              <div className="absolute text-center" style={{ left: x - 140, top: TRACK_Y + 70, width: 280, opacity: done ? 1 : 0.35 }}>
                <p className="font-display font-extrabold" style={{ fontSize: 36, lineHeight: 1, color: INK }}>{s.name}</p>
                <p className="font-semibold" style={{ fontSize: 19, color: '#2E2A25', marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.who}</p>
              </div>
              {done && (
                <div className="absolute" style={{ left: x - 128, top: TRACK_Y + 158, width: 256, ...pop(f, s.at + 3, TILTS[i], 0.6) }}>
                  <div style={{ background: '#fff', border: `4px solid ${INK}`, boxShadow: `5px 5px 0 ${INK}`, borderRadius: 16, padding: '10px 14px' }}>
                    <p className="font-mono font-bold" style={{ fontSize: 22, color }}>{rupees(s.amount)}</p>
                    <p style={{ fontSize: 17, lineHeight: 1.2, color: '#2E2A25' }}>{s.detail}</p>
                    <p className="font-mono" style={{ fontSize: 13, color: '#6B645B', marginTop: 4 }}>0x{(0x3a9f1c + i * 0x1b7d3).toString(16)}…{(0xe4 + i * 17).toString(16)}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {live && (
          <div className="absolute flex items-center gap-2 font-mono font-bold" style={{ left: X0 + 5 * STEP + 20, top: TRACK_Y + 24, fontSize: 20, background: C.pink, color: '#fff', border: `4px solid ${INK}`, borderRadius: 99, padding: '4px 12px', zIndex: 6, ...pop(f, stations[5].at, -6) }}>
            <span className="rounded-full" style={{ width: 10, height: 10, background: '#fff', opacity: Math.abs(Math.sin(f / 5)) }} /> LIVE
          </div>
        )}
        {live &&
          Array.from({ length: 10 }).map((_, k) => {
            const a = (k / 10) * Math.PI * 2
            const t = interpolate(f - stations[5].at, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            return (
              <span
                key={k}
                className="absolute rounded-full"
                style={{ left: X0 + 5 * STEP - 8 + Math.cos(a) * 110 * t, top: TRACK_Y - 8 + Math.sin(a) * 110 * t, width: 16, height: 16, background: [C.pink, C.blue, C.mint, C.marigold][k % 4], border: `3px solid ${INK}`, opacity: 1 - t }}
              />
            )
          })}

        {/* coin */}
        <div className="absolute" style={{ left: coinX - 52, top: TRACK_Y - 168 - hop, zIndex: 8 }}>
          <Coin size={104} spin={posIndex * 360} />
        </div>

        {/* ledger + proof */}
        <div className="absolute" style={{ left: 110, top: 770, width: 860, ...rise(f, ledgerAt, 60) }}>
          <div style={{ background: '#fff', border: `5px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, borderRadius: 24, padding: '16px 22px' }}>
            <p className="font-mono font-bold uppercase" style={{ fontSize: 18, letterSpacing: '0.18em', color: C.pink }}>Public e₹ ledger</p>
            {[
              ['ALLOCATE', rupees(amount), 'You · PAN linked'],
              ['RELEASE', rupees(tranche), 'Greater Bengaluru Authority'],
              ['PAY', rupees(tranche), 'Kere Restoration Co.'],
            ].map(([a, b, c], k) => (
              <div key={a} className="flex justify-between font-mono" style={{ fontSize: 19, marginTop: 6, color: INK, opacity: ramp(f, [ledgerAt + 4 + k * 5, ledgerAt + 10 + k * 5]) }}>
                <span><strong>{a}</strong> → {c}</span>
                <span className="font-bold">{b}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute flex" style={{ left: 1010, top: 770, gap: 18, ...rise(f, proofAt, 60) }}>
          {['Track bed laid', 'Lights installed', 'Open gym'].map((cap, k) => (
            <div key={cap} className="relative overflow-hidden" style={{ width: 252, height: 156, borderRadius: 18, border: `5px solid ${INK}`, background: `linear-gradient(${130 + k * 40}deg, ${color}, ${INK} 85%)` }}>
              <div className="bg-dots absolute inset-0" style={{ opacity: 0.3 }} />
              <div className="absolute inset-x-0 bottom-0" style={{ padding: '8px 12px', background: 'linear-gradient(transparent, rgba(0,0,0,.75))', color: '#fff' }}>
                <p className="font-bold" style={{ fontSize: 18 }}>{cap}</p>
                <p className="flex items-center gap-1 font-mono" style={{ fontSize: 12, opacity: 0.8 }}><MapPin size={12} /> 12.926°N 77.676°E</p>
              </div>
              {k === 0 && (
                <span className="absolute flex items-center gap-1 font-mono font-bold" style={{ right: 8, top: 8, fontSize: 14, background: C.pink, color: '#fff', border: `3px solid ${INK}`, borderRadius: 99, padding: '2px 8px' }}>
                  ● LIVE
                </span>
              )}
            </div>
          ))}
        </div>
      </AbsoluteFill>
      {stations.map((s, i) => (
        <Sfx key={s.name} at={s.at} name={i === stations.length - 1 ? 'ding' : 'coin'} volume={i === stations.length - 1 ? 0.35 : 0.25} />
      ))}
      <Sfx at={ledgerAt} name="whoosh" volume={0.25} />
      <Sfx at={proofAt} name="pop" volume={0.3} />
    </Bg>
  )
}

