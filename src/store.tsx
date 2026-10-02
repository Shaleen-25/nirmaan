import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { personaFor, type Persona } from './data/personas'
import { computeTax, type TaxBreakdown } from './lib/tax'

export interface Confirmation {
  at: number
  allocations: Record<string, number>
}

interface State {
  pan: string | null
  income: number | null
  allocations: Record<string, number>
  confirmation: Confirmation | null
}

interface Store extends State {
  persona: Persona | null
  tax: TaxBreakdown | null
  allocated: number
  remaining: number
  login: (pan: string) => void
  logout: () => void
  setIncome: (n: number) => void
  toggle: (id: string) => void
  setAmount: (id: string, amount: number) => void
  splitEvenly: () => void
  confirm: () => void
}

const KEY = 'nirmaan-demo-v1'
const EMPTY: State = { pan: null, income: null, allocations: {}, confirmation: null }

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY
  } catch {
    return EMPTY
  }
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

  const persona = state.pan ? personaFor(state.pan) : null
  const tax = persona ? computeTax(state.income ?? persona.income) : null
  const allocated = Object.values(state.allocations).reduce((a, b) => a + b, 0)
  const budget = tax?.nirmaan ?? 0

  const store = useMemo<Store>(() => {
    const evenly = (ids: string[]) => {
      if (!ids.length) return {}
      const each = Math.floor(budget / ids.length / 100) * 100
      const out: Record<string, number> = {}
      ids.forEach((id, i) => (out[id] = i === 0 ? budget - each * (ids.length - 1) : each))
      return out
    }
    return {
      ...state,
      persona,
      tax,
      allocated,
      remaining: Math.max(0, budget - allocated),
      login: (pan) => setState({ ...EMPTY, pan }),
      logout: () => setState(EMPTY),
      setIncome: (income) => setState((s) => ({ ...s, income, allocations: {} })),
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
          const others = Object.entries(s.allocations).filter(([k]) => k !== id)
          const othersTotal = others.reduce((a, [, v]) => a + v, 0)
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
    }
  }, [state, persona, tax, allocated, budget])

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore outside provider')
  return s
}
