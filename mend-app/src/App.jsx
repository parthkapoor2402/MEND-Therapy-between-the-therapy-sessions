import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import DiscoveryPage from './pages/DiscoveryPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import HomeDashboard from './pages/HomeDashboard.jsx'
import DebriefPage from './pages/DebriefPage.jsx'
import BriefPage from './pages/BriefPage.jsx'
import PulsePage from './pages/PulsePage.jsx'
import MemoryPage from './pages/MemoryPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import BottomNav from './components/ui/BottomNav.jsx'
import ScrollToTop from './components/ui/ScrollToTop.jsx'
import { useMendStore } from './store/useMendStore.js'

const SHOW_BOTTOM_NAV = ['/home', '/debrief', '/brief', '/pulse']

function DiscoveryOrHome() {
  const onboardingComplete = useMendStore((s) => s.onboardingComplete)
  return onboardingComplete ? <Navigate to="/home" replace /> : <DiscoveryPage />
}

export default function App() {
  const location = useLocation()
  const showNav = SHOW_BOTTOM_NAV.includes(location.pathname)

  return (
    <div className="flex min-h-[100dvh] w-full items-stretch justify-center bg-gray-200 sm:min-h-screen sm:items-center sm:py-6">
      <div
        data-testid="mend-device-frame"
        className="relative flex h-[100dvh] max-h-[100dvh] w-full max-w-[390px] flex-col overflow-hidden bg-mend-bg sm:h-auto sm:max-h-[min(100dvh,920px)] sm:min-h-[844px] sm:rounded-[40px] sm:border-4 sm:border-gray-800 sm:shadow-2xl"
      >
        <ScrollToTop />
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain [-webkit-overflow-scrolling:touch] [touch-action:pan-y]">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<DiscoveryOrHome />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/home" element={<HomeDashboard />} />
              <Route path="/debrief" element={<DebriefPage />} />
              <Route path="/brief" element={<BriefPage />} />
              <Route path="/pulse" element={<PulsePage />} />
              <Route path="/memory" element={<MemoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </AnimatePresence>
        </div>
        {showNav && <BottomNav />}
      </div>
    </div>
  )
}
