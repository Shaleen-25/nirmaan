import { motion } from 'motion/react'
import { CheckCheck } from 'lucide-react'

export const CHAT = [
  { who: 'Rahul', text: 'Salary credited. TDS took ₹67,000 again 😤', me: false, color: '#3D5AFE' },
  { who: 'You', text: 'And the road outside office still looks like the moon 🌚', me: true, color: '' },
  { who: 'Priya', text: 'Where the hell is all our tax money going??', me: false, color: '#FF4F8B' },
  { who: 'Kabir', text: 'Nobody asks us. We just pay. 🙏', me: false, color: '#17B26A' },
  { who: 'You', text: 'What if we could decide? 🤔', me: true, color: '' },
]

/** The office chai-sutta group every Indian taxpayer is in */
export function FamilyChat() {
  return (
    <div className="brut-lg mx-auto w-full max-w-sm overflow-hidden rounded-[28px] bg-[#EFE7DC]">
      <div className="flex items-center gap-3 border-b-2 border-ink bg-leaf px-4 py-3 text-white">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-marigold text-lg">☕</span>
        <div className="leading-tight">
          <p className="font-display font-extrabold">Chai Sutta Gang</p>
          <p className="text-[11px] text-white/80">Rahul, Priya, Kabir, You</p>
        </div>
      </div>
      <div className="bg-dots space-y-2.5 p-4">
        {CHAT.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 + i * 0.45, type: 'spring', stiffness: 260, damping: 20 }}
            className={`flex ${m.me ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl border-2 border-ink px-3 py-2 text-sm shadow-[2px_2px_0_#16130F] ${m.me ? 'rounded-br-md bg-[#D9FDD3]' : 'rounded-bl-md bg-white'}`}>
              {!m.me && <p className="text-[11px] font-bold" style={{ color: m.color }}>{m.who}</p>}
              <p className="font-medium">{m.text}</p>
              {m.me && (
                <p className="mt-0.5 flex justify-end">
                  <CheckCheck className="h-3.5 w-3.5 text-chakra" />
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
