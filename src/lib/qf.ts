import { PROJECTS, type Project, type Tier } from '../data/projects'

/**
 * Quadratic funding: a project's matching weight is (Σ √cᵢ)².
 * Your rupees always go 100% to what you pick. The *matching fund* listens to
 * how many people back a project, with each person's voice growing with the
 * square root of what they put in.
 */
export const MATCHING_POOL_CR: Record<Tier, number> = {
  national: 2500,
  state: 600,
  local: 120,
}
export const MATCHING_POOL_TOTAL_CR = Object.values(MATCHING_POOL_CR).reduce((a, b) => a + b, 0)

/** Seeded projects approximate every backer as giving the average amount. */
function seedSqrtSum(p: Project): number {
  const avg = (p.raisedCr * 1e7) / p.backers
  return p.backers * Math.sqrt(avg)
}

function tierScores(tier: Tier, extra: Record<string, number> = {}) {
  const scores: Record<string, number> = {}
  let total = 0
  for (const p of PROJECTS) {
    if (p.tier !== tier) continue
    const s = seedSqrtSum(p) + (extra[p.id] ?? 0)
    scores[p.id] = s * s
    total += s * s
  }
  return { scores, total }
}

/** Matching (in ₹) a project currently attracts from its tier's pool */
export function projectMatch(p: Project): number {
  const { scores, total } = tierScores(p.tier)
  return (MATCHING_POOL_CR[p.tier] * 1e7 * scores[p.id]) / total
}

/**
 * The share of matching attributable to *your* contribution, given all of your allocations.
 * Attribution: your √amount / project's Σ√ × project's match.
 */
export function yourMatch(allocations: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {}
  const byTier: Record<Tier, Record<string, number>> = { national: {}, state: {}, local: {} }
  for (const [id, amt] of Object.entries(allocations)) {
    const p = PROJECTS.find((x) => x.id === id)
    if (!p || amt <= 0) continue
    byTier[p.tier][id] = Math.sqrt(amt)
  }
  for (const tier of Object.keys(byTier) as Tier[]) {
    const extra = byTier[tier]
    if (!Object.keys(extra).length) continue
    const { scores, total } = tierScores(tier, extra)
    for (const [id, root] of Object.entries(extra)) {
      const match = (MATCHING_POOL_CR[tier] * 1e7 * scores[id]) / total
      out[id] = (match * root) / Math.sqrt(scores[id])
    }
  }
  return out
}

/** Generic QF over groups of contributions → share of a pool. Used by the fairness explainer. */
export function qfShares(groups: number[][]): number[] {
  const scores = groups.map((g) => {
    const s = g.reduce((a, c) => a + Math.sqrt(c), 0)
    return s * s
  })
  const total = scores.reduce((a, b) => a + b, 0) || 1
  return scores.map((s) => s / total)
}
