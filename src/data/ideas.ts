import type { CityId } from './personas'
import type { Category } from './projects'

export type IdeaStage = 'new' | 'trending' | 'review' | 'shortlisted'

export interface Idea {
  id: string
  title: string
  pitch: string
  category: Category
  city: CityId | 'india'
  where: string
  by: string
  vouches: number
  thisWeek: number
  stage: IdeaStage
}

/** Vouch thresholds that trigger an official response, by scope */
export const THRESHOLDS = [
  { at: 1_000, label: 'Ward office responds' },
  { at: 5_000, label: 'City review' },
  { at: 25_000, label: 'Considered for next Union Budget' },
]

export const STAGES: Record<IdeaStage, { label: string; bg: string; fg: string }> = {
  new: { label: 'New', bg: '#FFFFFF', fg: '#16130F' },
  trending: { label: 'Trending', bg: '#FFC22E', fg: '#16130F' },
  review: { label: 'Under govt review', bg: '#3D5AFE', fg: '#FFFFFF' },
  shortlisted: { label: 'Shortlisted · Budget 27-28', bg: '#17B26A', fg: '#FFFFFF' },
}

/** Illustrative community ideas. Names are fictional. */
export const IDEAS: Idea[] = [
  { id: 'stray-dogs', title: 'Humane stray-dog sterilisation & shelters', pitch: 'Vaccinate, sterilise and shelter, so streets are safe for kids and dogs alike.', category: 'health', city: 'india', where: 'All cities', by: 'Ishita, Noida', vouches: 48_210, thisWeek: 3_920, stage: 'shortlisted' },
  { id: 'bus-10', title: 'A bus every 10 minutes on every major road', pitch: 'If buses came on time, half of us would leave the car at home.', category: 'daily', city: 'india', where: 'All metros', by: 'Kabir, Chennai', vouches: 41_870, thisWeek: 2_610, stage: 'shortlisted' },
  { id: 'creche-metro', title: 'Public crèches at metro stations', pitch: 'Drop your kid at the station, pick them up on the way back. Working parents need this.', category: 'daily', city: 'india', where: 'Metro cities', by: 'Neha, Gurugram', vouches: 22_140, thisWeek: 1_880, stage: 'review' },
  { id: 'flyover-skate', title: 'Skate parks & courts under flyovers', pitch: 'Dead space under flyovers → lit skate parks, futsal and street art walls.', category: 'sports', city: 'mumbai', where: 'Mumbai', by: 'Aarav, Bandra', vouches: 9_640, thisWeek: 2_240, stage: 'review' },
  { id: 'gachibowli-joggers', title: 'Joggers Park for Gachibowli', pitch: 'Thousands of us run on the road at 6am. Give us a safe, lit 3 km track with water points.', category: 'sports', city: 'hyderabad', where: 'Gachibowli, Greater Hyderabad', by: 'Sneha, Kondapur', vouches: 3_812, thisWeek: 1_140, stage: 'trending' },
  { id: 'open-cinema', title: 'Open-air cinema nights in city parks', pitch: 'Free Indian classics on a big screen in parks every Saturday. Bring a mat.', category: 'arts', city: 'pune', where: 'Pune', by: 'Rohan, Kothrud', vouches: 6_930, thisWeek: 870, stage: 'review' },
  { id: 'bus-stop-wifi', title: 'Free Wi-Fi + charging at bus stops', pitch: 'Waiting is less painful with a charged phone. Solar-powered, of course.', category: 'daily', city: 'bengaluru', where: 'Bengaluru', by: 'Divya, HSR Layout', vouches: 5_420, thisWeek: 610, stage: 'review' },
  { id: 'pet-parks', title: 'Fenced pet parks in every ward', pitch: 'Dogs need to run. Owners need a place that doesn’t annoy neighbours.', category: 'green', city: 'bengaluru', where: 'Bengaluru', by: 'Arjun, Indiranagar', vouches: 4_180, thisWeek: 520, stage: 'trending' },
  { id: 'isl-schools', title: 'Indian Sign Language in every school', pitch: 'One period a week. Imagine a generation that can talk to everyone.', category: 'arts', city: 'india', where: 'All states', by: 'Meher, Jaipur', vouches: 12_760, thisWeek: 1_090, stage: 'review' },
  { id: 'box-cricket', title: 'Box-cricket turfs on unused municipal plots', pitch: 'Night cricket after work, ₹0 booking fee for local teams.', category: 'sports', city: 'delhi', where: 'New Delhi', by: 'Sahil, Dwarka', vouches: 3_310, thisWeek: 980, stage: 'trending' },
  { id: 'shade-trees', title: 'Shade trees on every footpath', pitch: 'Walking in 44°C is not a lifestyle choice. Plant native trees with tree-guards.', category: 'green', city: 'delhi', where: 'New Delhi', by: 'Ananya, Saket', vouches: 7_820, thisWeek: 450, stage: 'review' },
  { id: 'library-things', title: 'A “library of things” in every ward', pitch: 'Borrow a drill, a tent or a sewing machine instead of buying one.', category: 'green', city: 'pune', where: 'Pune', by: 'Tanvi, Aundh', vouches: 1_960, thisWeek: 390, stage: 'new' },
  { id: 'hyd-cycle', title: 'Protected cycle lane on the Hitec City loop', pitch: 'Let’s make cycling to work in Hyderabad not a death wish.', category: 'green', city: 'hyderabad', where: 'Hitec City, Hyderabad', by: 'Vikram, Madhapur', vouches: 2_470, thisWeek: 520, stage: 'new' },
  { id: 'mum-toilets', title: 'Clean, rated public toilets every 1 km', pitch: 'Staffed, rated on an app, open 24×7. Basic dignity.', category: 'daily', city: 'mumbai', where: 'Mumbai', by: 'Farah, Andheri', vouches: 8_310, thisWeek: 760, stage: 'review' },
]

/** Funnel shown to government: from raw ideas to funded projects */
export const PIPELINE = [
  { label: 'Ideas submitted', value: 1_284 },
  { label: 'Crossed 1,000 vouches', value: 212 },
  { label: 'Feasibility study', value: 38 },
  { label: 'Listed on Nirmaan', value: 11 },
]
