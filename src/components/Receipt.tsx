import { motion } from 'motion/react'
import { ArrowRight, Scissors } from 'lucide-react'
import { rupees } from '../lib/format'

/** A tax receipt whose 10% stub tears off: the core Nirmaan metaphor */
export function TaxReceipt({ tax, label = 'FY 2026-27', name, delay = 0.6, onStub }: { tax: number; label?: string; name?: string; delay?: number; onStub?: () => void }) {
  const share = Math.round(tax * 0.1)
  return (
    <div className="relative mx-auto w-full max-w-sm font-mono">
      <div className="brut relative z-10 rounded-t-2xl bg-white px-6 pb-5 pt-6">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-muted">
          <span>Tax receipt</span>
          <span>{label}</span>
        </div>
        {name && <p className="mt-1 text-xs text-ink-soft">{name}</p>}
        <div className="my-4 border-t-2 border-dashed border-ink/25" />
        <Row k="Income tax paid" v={rupees(tax)} bold />
        <Row k="↳ Keeps India running (90%)" v={rupees(tax - share)} />
        <Row k="↳ You decide (10%)" v={rupees(share)} hl />
        <div className="mt-4 flex items-center gap-2 text-[10px] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-leaf" /> verified · e₹ ready
        </div>
      </div>
      {/* perforation */}
      <div className="relative z-20 -my-px flex items-center px-3">
        <Scissors className="h-4 w-4 -rotate-90 text-ink" />
        <div className="ml-1 flex-1 border-t-[2.5px] border-dashed border-ink" />
      </div>
      {/* the stub */}
      <motion.button
        type="button"
        onClick={onStub}
        initial={{ rotate: 0, x: 0, y: 0 }}
        animate={{ rotate: [0, 0, 5], x: [0, 0, 14], y: [0, 0, 16] }}
        transition={{ duration: 1.2, delay, times: [0, 0.4, 1], ease: 'easeOut' }}
        className="brut relative block w-full origin-top-left rounded-b-2xl bg-marigold px-6 py-4 text-left"
      >
        <p className="text-[10px] font-bold uppercase tracking-widest">Your 10% · torn off for you</p>
        <div className="mt-1 flex items-center justify-between">
          <span className="font-display text-3xl font-extrabold tabular tracking-tight">{rupees(share)}</span>
          <span className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-white px-3 py-1 font-display text-xs font-bold">
            You decide <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </motion.button>
    </div>
  )
}

function Row({ k, v, bold, hl }: { k: string; v: string; bold?: boolean; hl?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-3 py-1 text-[13px] ${bold ? 'font-bold' : ''}`}>
      <span className={hl ? 'rounded bg-marigold px-1 text-ink' : 'text-ink-soft'}>{k}</span>
      <span className="tabular">{v}</span>
    </div>
  )
}
