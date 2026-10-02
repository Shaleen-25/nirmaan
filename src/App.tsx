import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Start from './pages/Start'
import Essentials from './pages/Essentials'
import Build from './pages/Build'
import ProjectDetail from './pages/ProjectDetail'
import Basket from './pages/Basket'
import Confirm from './pages/Confirm'
import Track from './pages/Track'
import Ideas from './pages/Ideas'
import IdeaStory from './pages/IdeaStory'
import Fairness from './pages/Fairness'
import Government from './pages/Government'
import FeedbackPage from './pages/FeedbackPage'
import Login from './pages/Login'
import YourTax from './pages/YourTax'
import { useStore } from './store'

/** Pages that need the user's tax and city first */
function NeedsSetup({ children }: { children: React.ReactNode }) {
  const { ready } = useStore()
  return ready ? <>{children}</> : <Navigate to="/start" replace />
}

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="start" element={<Start />} />
        <Route path="ideas" element={<Ideas />} />
        <Route path="ideas/new" element={<IdeaStory />} />
        <Route path="fairness" element={<Fairness />} />
        <Route path="government" element={<Government />} />
        <Route path="track" element={<Track />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="essentials" element={<NeedsSetup><Essentials /></NeedsSetup>} />
        <Route path="build" element={<NeedsSetup><Build /></NeedsSetup>} />
        <Route path="project/:id" element={<ProjectDetail />} />
        <Route path="basket" element={<NeedsSetup><Basket /></NeedsSetup>} />
        <Route path="confirm" element={<NeedsSetup><Confirm /></NeedsSetup>} />

        {/* PAN login flow: not linked in the product, kept for the promo video */}
        <Route path="promo/login" element={<Login />} />
        <Route path="promo/you" element={<YourTax />} />

        <Route path="login" element={<Navigate to="/start" replace />} />
        <Route path="you" element={<Navigate to="/start" replace />} />
        <Route path="impact" element={<Navigate to="/track" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
