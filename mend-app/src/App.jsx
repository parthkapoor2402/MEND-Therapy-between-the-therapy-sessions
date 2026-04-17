import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import DiscoveryPage from './pages/DiscoveryPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import HomeDashboard from './pages/HomeDashboard.jsx'
import DebriefPage from './pages/DebriefPage.jsx'
import BriefPage from './pages/BriefPage.jsx'
import PulsePage from './pages/PulsePage.jsx'
import BottomNav from './components/ui/BottomNav.jsx'
import ScrollToTop from './components/ui/ScrollToTop.jsx'

const SHOW_BOTTOM_NAV = ['/home', '/debrief', '/brief', '/pulse']

export default function App() {
  const location = useLocation()
  const showNav = SHOW_BOTTOM_NAV.includes(location.pathname)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200">
      <div className="relative flex min-h-[844px] w-[390px] flex-col overflow-hidden rounded-[40px] border-4 border-gray-800 bg-mend-bg shadow-2xl">
        <ScrollToTop />
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<DiscoveryPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/home" element={<HomeDashboard />} />
              <Route path="/debrief" element={<DebriefPage />} />
              <Route path="/brief" element={<BriefPage />} />
              <Route path="/pulse" element={<PulsePage />} />
            </Routes>
          </AnimatePresence>
        </div>
        {showNav && <BottomNav />}
      </div>
    </div>
  )
}
