/**
 * Union Budget 2026-27 (Budget Estimates), "Where the rupee goes" — paise per rupee.
 * Source: Budget at a Glance 2026-27, as reported by The Federal / PRS (Feb 2026).
 */
export const BUDGET_YEAR = '2026-27'
export const TOTAL_EXPENDITURE_CR = 53_47_315
export const INCOME_TAX_BE_CR = 14_66_000
export const CAPEX_CR = 12_21_821

export interface BudgetHead {
  id: string
  label: string
  paise: number
  color: string
  blurb: string
  examples: string[]
}

export const RUPEE_GOES_TO: BudgetHead[] = [
  {
    id: 'states',
    label: "States' share of taxes",
    paise: 22,
    color: '#3D5AFE',
    blurb: 'Constitutionally devolved to states as per the Finance Commission. Funds state police, hospitals, schools and roads.',
    examples: ['State health & education', 'Police & law and order', 'State highways'],
  },
  {
    id: 'interest',
    label: 'Interest payments',
    paise: 20,
    color: '#B9B2A6',
    blurb: "Interest on India's past borrowings. Not optional. Keeping it low is why fiscal discipline matters.",
    examples: ['Government bonds', 'Small savings schemes', 'Treasury bills'],
  },
  {
    id: 'central',
    label: 'Central sector schemes',
    paise: 17,
    color: '#FF7A1A',
    blurb: 'Schemes run directly by the Centre: railways, highways, space, telecom, R&D.',
    examples: ['National highways', 'Railways capex', 'ISRO & scientific research'],
  },
  {
    id: 'defence',
    label: 'Defence',
    paise: 11,
    color: '#16130F',
    blurb: 'Armed forces salaries, modernisation and capital acquisitions.',
    examples: ['Army, Navy, Air Force', 'Indigenous procurement', 'Border infrastructure'],
  },
  {
    id: 'css',
    label: 'Centrally sponsored schemes',
    paise: 8,
    color: '#17B26A',
    blurb: 'Co-funded with states: housing, drinking water, rural jobs, health missions.',
    examples: ['Jal Jeevan Mission', 'PM Awas Yojana', 'National Health Mission'],
  },
  {
    id: 'fc',
    label: 'Finance Commission & other transfers',
    paise: 7,
    color: '#8ED1FC',
    blurb: 'Grants to states, cities and panchayats for local bodies and disaster relief.',
    examples: ['Urban local body grants', 'Disaster response funds', 'Revenue deficit grants'],
  },
  {
    id: 'other',
    label: 'Other expenditure',
    paise: 7,
    color: '#FFC22E',
    blurb: 'Running ministries, salaries of central employees and miscellaneous spends.',
    examples: ['Ministry operations', 'Central employee salaries', 'Elections & institutions'],
  },
  {
    id: 'subsidies',
    label: 'Major subsidies',
    paise: 6,
    color: '#FF4F8B',
    blurb: 'Food, fertiliser and LPG subsidies that keep essentials affordable.',
    examples: ['Free foodgrains (PMGKAY)', 'Fertiliser subsidy', 'LPG for households'],
  },
  {
    id: 'pensions',
    label: 'Pensions',
    paise: 2,
    color: '#9B6BFF',
    blurb: 'Pensions for retired central government employees.',
    examples: ['Civil pensions', 'Family pensions'],
  },
]

export const RUPEE_COMES_FROM = [
  { label: 'Borrowings & other liabilities', paise: 24 },
  { label: 'Income tax', paise: 21, highlight: true },
  { label: 'Corporation tax', paise: 18 },
  { label: 'GST & other taxes', paise: 15 },
  { label: 'Non-tax revenue', paise: 10 },
  { label: 'Union excise duties', paise: 6 },
  { label: 'Customs', paise: 4 },
  { label: 'Non-debt capital receipts', paise: 2 },
]
