import { loadFont as bricolage } from '@remotion/google-fonts/BricolageGrotesque'
import { loadFont as instrument } from '@remotion/google-fonts/InstrumentSans'
import { loadFont as spaceMono } from '@remotion/google-fonts/SpaceMono'
import { loadFont as kalam } from '@remotion/google-fonts/Kalam'

bricolage('normal', { weights: ['500', '700', '800'], subsets: ['latin', 'latin-ext'] })
instrument('normal', { weights: ['400', '500', '600', '700'], subsets: ['latin', 'latin-ext'] })
spaceMono('normal', { weights: ['400', '700'], subsets: ['latin', 'latin-ext'] })
kalam('normal', { weights: ['400', '700'], subsets: ['latin', 'devanagari'] })
