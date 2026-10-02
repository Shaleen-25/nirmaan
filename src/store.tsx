import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CITIES, personaFor, type City, type CityId, type Persona } from './data/personas'
import { computeTax, PARTICIPATION_SHARE, type TaxBreakdown } from './lib/tax'

export interface Confirmation {
  at: number
  allocations: Record<string, number>
}

interface State {
  /** Annual income tax the user pays. Entered by hand until portal connectors exist. */
  taxPaid: number | null
  city: CityId | null
  allocations: Record<string, number>
  confirmation: Confirmation | null
  vouched: string[]
  /** Promo-only PAN login (kept for the demo video) */
  pan: string | null
  income: number | null
}

interface Store extends State {
  ready: boolean
  cityInfo: City | null
  budget: number
  allocated: number
  remaining: number
  persona: Persona | null
  tax: TaxBreakdown | null
  setup: (taxPaid: number, city: CityId) => void
  setTaxPaid: (n: number) => void
  setCity: (c: CityId) => void
  toggle: (id: string) => void
  setAmount: (id: string, amount: number) => void
  splitEvenly: () => void
  confirm: () => void
  vouch: (id: string) => void
  reset: () => void
  login: (pan: string) => void
  setIncome: (n: number) => void
}

const KEY = 'nirmaan-demo-v2'
const EMPTY: State = { taxPaid: null, city: null, allocations: {}, confirmation: null, vouched: [], pan: null, income: null }

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY
  } catch {
    return EMPTY
  }
}

const share = (tax: number) => Math.round(tax * PARTICIPATION_SHARE)

/** Rescale allocations when the budget changes so the split is preserved */
function rescale(allocs: Record<string, number>, from: number, to: number): Record<string, number> {
  if (!from) return {}
  const out: Record<string, number> = {}
  for (const [k, v] of Object.entries(allocs)) out[k] = Math.floor((v * to) / from / 100) * 100
  return out
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable: demo still works in-memory */
    }
  }, [state])

  const store = useMemo<Store>(() => {
    const budget = state.taxPaid ? share(state.taxPaid) : 0
    const allocated = Object.values(state.allocations).reduce((a, b) => a + b, 0)
    const persona = state.pan ? personaFor(state.pan) : null
    const tax = persona ? computeTax(state.income ?? persona.income) : null

    const evenly = (ids: string[]) => {
      if (!ids.length) return {}
      const each = Math.floor(budget / ids.length / 100) * 100
      const out: Record<string, number> = {}
      ids.forEach((id, i) => (out[id] = i === 0 ? budget - each * (ids.length - 1) : each))
      return out
    }
    const withTax = (s: State, taxPaid: number): State => ({
      ...s,
      taxPaid,
      allocations: rescale(s.allocations, s.taxPaid ? share(s.taxPaid) : 0, share(taxPaid)),
    })

    return {
      ...state,
      ready: state.taxPaid !== null && state.city !== null,
      cityInfo: state.city ? CITIES[state.city] : null,
      budget,
      allocated,
      remaining: Math.max(0, budget - allocated),
      persona,
      tax,
      setup: (taxPaid, city) => setState((s) => ({ ...withTax(s, taxPaid), city })),
      setTaxPaid: (taxPaid) => setState((s) => withTax(s, taxPaid)),
      setCity: (city) => setState((s) => ({ ...s, city })),
      toggle: (id) =>
        setState((s) => {
          const ids = Object.keys(s.allocations)
          const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
          return { ...s, allocations: evenly(next) }
        }),
      setAmount: (id, amount) =>
        setState((s) => {
          // Raising one project past the budget proportionally trims the others
          const value = Math.max(0, Math.min(amount, budget))
          const othersTotal = Object.entries(s.allocations).reduce((a, [k, v]) => (k === id ? a : a + v), 0)
          const room = budget - value
          const scale = othersTotal > room && othersTotal > 0 ? room / othersTotal : 1
          const next: Record<string, number> = {}
          for (const [k, v] of Object.entries(s.allocations)) {
            next[k] = k === id ? value : scale < 1 ? Math.floor((v * scale) / 100) * 100 : v
          }
          return { ...s, allocations: next }
        }),
      splitEvenly: () => setState((s) => ({ ...s, allocations: evenly(Object.keys(s.allocations)) })),
      confirm: () => setState((s) => ({ ...s, confirmation: { at: Date.now(), allocations: s.allocations } })),
      vouch: (id) =>
        setState((s) => ({ ...s, vouched: s.vouched.includes(id) ? s.vouched.filter((x) => x !== id) : [...s.vouched, id] })),
      reset: () => setState(EMPTY),
      login: (pan) => {
        const p = personaFor(pan)
        setState((s) => ({ ...withTax(s, computeTax(p.income).total), pan, income: p.income, city: p.city }))
      },
      setIncome: (income) => setState((s) => ({ ...withTax(s, computeTax(income).total), income })),
    }
  }, [state])

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore outside provider')
  return s
}
