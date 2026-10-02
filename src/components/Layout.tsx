import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import clsx from 'clsx'
import { ArrowRight, Hammer, LogOut, PieChart, Receipt, Scale, Sparkles } from 'lucide-react'
import { Logo } from './ui'
import { useStore } from '../store'
import { compact } from '../lib/format'

const APP_NAV = [
  { to: '/you', label: 'Your Tax', short: 'You', icon: Receipt },
  { to: '/essentials', label: '90% Essentials', short: '90%', icon: PieChart },
  { to: '/build', label: 'Build with 10%', short: 'Build', icon: Hammer },
  { to: '/impact', label: 'My Impact', short: 'Impact', icon: Sparkles },
  { to: '/fairness', label: 'Fairness', short: 'Fair', icon: Scale },
]

export default function Layout() {
  const { pan, persona, logout, allocations, allocated } = useStore()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const picks = Object.keys(allocations).length
  const showBasketBar = pan && picks > 0 && (pathname === '/build' || pathname.startsWith('/project/'))

  return (
    <div className="min-h-dvh pb-24 md:pb-0">
      <div className="tricolor h-1 w-full" />
      <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" aria-label="Nirmaan home">
            <Logo />
          </Link>

          {pan ? (
            <nav className="hidden items-center gap-1 md:flex">
              {APP_NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) =>
                    clsx('rounded-full px-3.5 py-2 text-sm font-medium transition', isActive ? 'bg-ink text-white' : 'text-muted hover:text-ink')
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
          ) : (
            <nav className="hidden items-center gap-1 md:flex">
              <a href="/#how" className="rounded-full px-3.5 py-2 text-sm font-medium text-muted hover:text-ink">How it works</a>
              <NavLink to="/fairness" className="rounded-full px-3.5 py-2 text-sm font-medium text-muted hover:text-ink">Fairness</NavLink>
              <NavLink to="/government" className="rounded-full px-3.5 py-2 text-sm font-medium text-muted hover:text-ink">For Government</NavLink>
            </nav>
          )}

          {pan && persona ? (
            <div className="flex items-center gap-2">
              <span className={`hidden h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white sm:inline-flex ${persona.avatar}`}>
                {persona.name.replace('Dr. ', '').split(' ').map((w) => w[0]).join('')}
              </span>
              <button
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted hover:bg-black/5 hover:text-ink"
              >
                <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
              Try the demo <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-line/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            <strong className="text-ink">Nirmaan is a concept prototype</strong>, built in public. Not affiliated with the Government of India, RBI or
            the Income Tax Department. Personas, projects, vendors and transactions are illustrative.
          </p>
          <div className="flex shrink-0 gap-4">
            <Link to="/government" className="hover:text-ink">For Government</Link>
            <Link to="/fairness" className="hover:text-ink">Fairness model</Link>
          </div>
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
              className="mx-auto flex w-full max-w-xl items-center justify-between gap-3 rounded-full bg-ink py-3 pl-5 pr-3 text-left text-white shadow-2xl"
            >
              <span className="text-sm">
                <strong>{picks} project{picks > 1 ? 's' : ''}</strong> · {compact(allocated)} allocated
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron px-4 py-2 text-sm font-semibold">
                Review <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {pan && (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
          <div className="mx-auto grid max-w-md grid-cols-5">
            {APP_NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  clsx('flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium', isActive ? 'text-ink' : 'text-muted')
                }
              >
                {({ isActive }) => (
                  <>
                    <n.icon className={clsx('h-5 w-5', isActive && 'text-saffron')} />
                    {n.short}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
