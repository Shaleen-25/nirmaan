export type CityId = 'bengaluru' | 'pune' | 'delhi' | 'mumbai'

export interface City {
  id: CityId
  name: string
  state: string
  stateId: 'KA' | 'MH' | 'DL'
  civicBody: string
}

export const CITIES: Record<CityId, City> = {
  bengaluru: { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', stateId: 'KA', civicBody: 'Greater Bengaluru Authority' },
  pune: { id: 'pune', name: 'Pune', state: 'Maharashtra', stateId: 'MH', civicBody: 'Pune Municipal Corporation' },
  delhi: { id: 'delhi', name: 'New Delhi', state: 'Delhi', stateId: 'DL', civicBody: 'Municipal Corporation of Delhi' },
  mumbai: { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', stateId: 'MH', civicBody: 'Brihanmumbai Municipal Corporation' },
}

export interface Persona {
  pan: string
  name: string
  role: string
  locality: string
  city: CityId
  income: number
  avatar: string // gradient seed
}

/** Fictional demo identities. These PANs are illustrative only. */
export const PERSONAS: Persona[] = [
  { pan: 'ABCPR4821K', name: 'Ananya Rao', role: 'Software Engineer', locality: 'Bellandur', city: 'bengaluru', income: 32_00_000, avatar: 'from-orange-400 to-rose-500' },
  { pan: 'PQRPK7310M', name: 'Rohan Kulkarni', role: 'Product Manager', locality: 'Baner', city: 'pune', income: 18_00_000, avatar: 'from-emerald-400 to-teal-600' },
  { pan: 'LMNPS2290D', name: 'Dr. Meera Sethi', role: 'Cardiologist', locality: 'Dwarka', city: 'delhi', income: 55_00_000, avatar: 'from-indigo-400 to-blue-700' },
  { pan: 'XYZPM5567Q', name: 'Arjun Mehta', role: 'Startup Founder', locality: 'Andheri West', city: 'mumbai', income: 1_20_00_000, avatar: 'from-amber-300 to-orange-600' },
]

export const PAN_REGEX = /^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]$/

export function personaFor(pan: string): Persona {
  const found = PERSONAS.find((p) => p.pan === pan)
  if (found) return found
  // Any well-formed individual PAN gets a generic demo profile
  const cities: CityId[] = ['bengaluru', 'pune', 'delhi', 'mumbai']
  const city = cities[pan.charCodeAt(5) % cities.length]
  return {
    pan,
    name: 'Demo Taxpayer',
    role: 'Salaried professional',
    locality: { bengaluru: 'Koramangala', pune: 'Kothrud', delhi: 'Saket', mumbai: 'Powai' }[city],
    city,
    income: 24_00_000,
    avatar: 'from-sky-400 to-indigo-600',
  }
}

export function maskPan(pan: string): string {
  return pan.slice(0, 3) + '••••••' + pan.slice(-1)
}
