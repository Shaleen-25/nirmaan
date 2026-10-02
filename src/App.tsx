import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import YourTax from './pages/YourTax'
import Essentials from './pages/Essentials'
import Build from './pages/Build'
import ProjectDetail from './pages/ProjectDetail'
import Basket from './pages/Basket'
import Confirm from './pages/Confirm'
import Impact from './pages/Impact'
import Fairness from './pages/Fairness'
import Government from './pages/Government'
import { useStore } from './store'

function Private({ children }: { children: React.ReactNode }) {
  const { pan } = useStore()
  return pan ? <>{children}</> : <Navigate to="/login" replace />
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
        <Route path="login" element={<Login />} />
        <Route path="fairness" element={<Fairness />} />
        <Route path="government" element={<Government />} />
        <Route path="you" element={<Private><YourTax /></Private>} />
        <Route path="essentials" element={<Private><Essentials /></Private>} />
        <Route path="build" element={<Private><Build /></Private>} />
        <Route path="project/:id" element={<Private><ProjectDetail /></Private>} />
        <Route path="basket" element={<Private><Basket /></Private>} />
        <Route path="confirm" element={<Private><Confirm /></Private>} />
        <Route path="impact" element={<Private><Impact /></Private>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
