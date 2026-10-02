const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

/** ₹5,38,200 */
export function rupees(n: number): string {
  return '₹' + inr.format(Math.round(n))
}

/** Compact Indian units: ₹53,820 · ₹5.4 L · ₹2,400 Cr · ₹1.47 L Cr */
export function compact(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1e12) return '₹' + trim(n / 1e12) + ' L Cr'
  if (abs >= 1e9) return '₹' + inr.format(Math.round(n / 1e7)) + ' Cr'
  if (abs >= 1e7) return '₹' + trim(Math.round((n / 1e7) * 10) / 10) + ' Cr'
  if (abs >= 1e5) return '₹' + trim(n / 1e5) + ' L'
  return rupees(n)
}

/** Value given in crore → compact string */
export function crore(cr: number): string {
  return compact(cr * 1e7)
}

export function count(n: number): string {
  if (n >= 1e7) return trim(n / 1e7) + ' Cr'
  if (n >= 1e5) return trim(n / 1e5) + ' L'
  if (n >= 1e3) return trim(n / 1e3) + 'K'
  return inr.format(n)
}

function trim(n: number): string {
  return (Math.round(n * 100) / 100).toString()
}

export function pct(n: number, digits = 0): string {
  return (n * 100).toFixed(digits) + '%'
}

/** Deterministic pseudo-hash for demo transaction ids */
export function txHash(seed: string, len = 10): string {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  let out = ''
  for (let i = 0; i < len; i++) {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    out += ((h >>> 0) % 16).toString(16)
  }
  return '0x' + out
}
