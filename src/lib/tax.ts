/**
 * Income tax under the new regime, FY 2026-27 (slabs unchanged from Budget 2025).
 * Salaried individual, resident, below 60. Demo-grade: ignores surcharge marginal relief.
 */
export const STANDARD_DEDUCTION = 75_000
export const PARTICIPATION_SHARE = 0.1

export const TEN_PERCENT_NOTE =
  "We're starting this pilot at 10%, in discussion with the government and subject to feasibility, so the percentage may change. For this demo, 90% of your income tax goes to essential government spending and 10% is where you have a say."

const SLABS: [number, number][] = [
  [4_00_000, 0],
  [8_00_000, 0.05],
  [12_00_000, 0.1],
  [16_00_000, 0.15],
  [20_00_000, 0.2],
  [24_00_000, 0.25],
  [Infinity, 0.3],
]

export interface TaxBreakdown {
  gross: number
  taxable: number
  slabTax: number
  rebate: number
  surcharge: number
  cess: number
  total: number
  essential: number // 90%
  nirmaan: number // 10%
  effectiveRate: number
}

export function computeTax(gross: number): TaxBreakdown {
  const taxable = Math.max(0, gross - STANDARD_DEDUCTION)
  let slabTax = 0
  let lower = 0
  for (const [upper, rate] of SLABS) {
    if (taxable > lower) slabTax += (Math.min(taxable, upper) - lower) * rate
    lower = upper
  }

  // Section 87A rebate (up to ₹60,000) with marginal relief just above ₹12 L
  let rebate = 0
  if (taxable <= 12_00_000) rebate = slabTax
  else if (slabTax > taxable - 12_00_000) rebate = slabTax - (taxable - 12_00_000)
  const afterRebate = slabTax - rebate

  let surchargeRate = 0
  if (taxable > 2_00_00_000) surchargeRate = 0.25
  else if (taxable > 1_00_00_000) surchargeRate = 0.15
  else if (taxable > 50_00_000) surchargeRate = 0.1
  const surcharge = afterRebate * surchargeRate

  const cess = (afterRebate + surcharge) * 0.04
  const total = Math.round(afterRebate + surcharge + cess)
  const nirmaan = Math.round(total * PARTICIPATION_SHARE)

  return {
    gross,
    taxable,
    slabTax,
    rebate,
    surcharge,
    cess,
    total,
    essential: total - nirmaan,
    nirmaan,
    effectiveRate: gross ? total / gross : 0,
  }
}
