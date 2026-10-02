import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import clsx from 'clsx'
import { ArrowRight, Hammer, Landmark, Lightbulb, Mail, MessageCircleHeart, Scale, TrainFront } from 'lucide-react'
import { LinkedInIcon, Logo } from './ui'
import { OWNER } from '../config'
import { useStore } from '../store'
import { compact, rupees } from '../lib/format'

const NAV = [
  { to: '/build', label: 'Build', icon: Hammer },
  { to: '/track', label: 'Track my ₹', icon: TrainFront },
  { to: '/ideas', label: 'Ideas', icon: Lightbulb },
  { to: '/fairness', label: 'Fairness', icon: Scale },
  { to: '/government', label: 'For Govt', icon: Landmark },
]

export default function Layout() {
  const { ready, budget, allocations, allocated } = useStore()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const picks = Object.keys(allocations).length
  const showBasketBar = ready && picks > 0 && (pathname === '/build' || pathname.startsWith('/project/'))

  return (
    <div className="bg-grid min-h-dvh pb-24 md:pb-0">
      <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" aria-label="Nirmaan home">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  clsx(
                    'rounded-full border-2 px-3.5 py-1.5 font-display text-sm font-bold transition',
                    isActive ? 'border-ink bg-ink text-white' : 'border-transparent text-ink hover:border-ink',
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/feedback" className="hidden items-center gap-1.5 font-display text-sm font-bold text-pink hover:underline xl:inline-flex">
              <MessageCircleHeart className="h-4 w-4" /> Feedback
            </Link>
            {ready ? (
              <Link to="/start" className="brut-sm press inline-flex items-center gap-2 rounded-full bg-marigold py-1.5 pl-2 pr-4" title="Change your tax or city">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-white font-display text-xs font-extrabold">e₹</span>
                <span className="leading-tight">
                  <span className="block font-display text-sm font-extrabold tabular">{rupees(budget)}</span>
                  <span className="block text-[10px] font-semibold text-ink-soft">your 10% · edit</span>
                </span>
              </Link>
            ) : (
              <Link to="/start" className="brut-sm press inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 font-display text-sm font-bold text-white">
                Start building <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <AnimatePresence mode="wait">
          <motion.div key={pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t-2 border-ink bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
                Nirmaan<span className="text-pink">.</span>
              </p>
              <p className="mt-2 font-hand text-xl text-marigold">Don't just pay for India. Build it.</p>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 font-display text-sm font-bold">
              <Link to="/build" className="hover:text-marigold">Build</Link>
              <Link to="/ideas" className="hover:text-marigold">Ideas</Link>
              <Link to="/fairness" className="hover:text-marigold">Fairness</Link>
              <Link to="/government" className="hover:text-marigold">For Government</Link>
              <Link to="/essentials" className="hover:text-marigold">Where the 90% goes</Link>
              <Link to="/feedback" className="hover:text-marigold">Feedback</Link>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="font-hand text-lg text-white/70">Built in public by {OWNER.name}</span>
            <a href={OWNER.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border-2 border-white/30 px-3 py-1.5 text-xs font-bold hover:border-white">
              <LinkedInIcon className="h-3.5 w-3.5" /> LinkedIn
            </a>
            <a href={`mailto:${OWNER.email}`} className="inline-flex items-center gap-1.5 rounded-full border-2 border-white/30 px-3 py-1.5 text-xs font-bold hover:border-white">
              <Mail className="h-3.5 w-3.5" /> {OWNER.email}
            </a>
          </div>
          <p className="mt-8 max-w-3xl border-t border-white/15 pt-5 text-xs text-white/55">
            Nirmaan is a concept prototype, built in public. Not affiliated with the Government of India, RBI or the Income Tax Department.
            Projects, ideas, names, vendors and transactions are illustrative.
          </p>
        </div>
      </footer>

      <AnimatePresence>
        {showBasketBar && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed inset-x-0 bottom-20 z-40 px-4 md:bottom-6"
          >
            <button
              onClick={() => navigate('/basket')}
              className="brut mx-auto flex w-full max-w-xl items-center justify-between gap-3 rounded-full bg-ink py-2.5 pl-5 pr-2.5 text-left text-white"
            >
              <span className="text-sm">
                <strong className="font-display">{picks} project{picks > 1 ? 's' : ''}</strong> · {compact(allocated)} allocated
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-marigold px-4 py-2 font-display text-sm font-bold text-ink">
                Review <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className="flex flex-col items-center gap-1 py-2 text-[11px] font-bold">
              {({ isActive }) => (
                <>
                  <span className={clsx('inline-flex h-8 w-12 items-center justify-center rounded-full border-2 transition', isActive ? 'border-ink bg-marigold' : 'border-transparent')}>
                    <n.icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className={isActive ? 'text-ink' : 'text-muted'}>{n.label.replace(' my ₹', '')}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
