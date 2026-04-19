import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import DiscoveryPage from './pages/DiscoveryPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import HomeDashboard from './pages/HomeDashboard.jsx'
import DebriefPage from './pages/DebriefPage.jsx'
import BriefPage from './pages/BriefPage.jsx'
import PulsePage from './pages/PulsePage.jsx'
import MemoryPage from './pages/MemoryPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import MomentCapturePage from './pages/MomentCapturePage.jsx'
import MomentsPage from './pages/MomentsPage.jsx'
import BottomNav from './components/ui/BottomNav.jsx'
import ScrollToTop from './components/ui/ScrollToTop.jsx'

const SHOW_BOTTOM_NAV = ['/home', '/debrief', '/brief', '/pulse']

export default function App() {
  const location = useLocation()
  const showNav = SHOW_BOTTOM_NAV.includes(location.pathname)

  return (
    <div className="flex min-h-[100dvh] w-full items-stretch justify-center bg-gray-200 sm:min-h-screen sm:items-center sm:py-6">
      <div
        data-testid="mend-device-frame"
        className="relative flex h-[100dvh] max-h-[100dvh] w-full max-w-[390px] flex-col overflow-hidden bg-mend-bg sm:h-auto sm:max-h-none sm:min-h-0 sm:overflow-visible sm:rounded-[40px] sm:border-4 sm:border-gray-800 sm:shadow-2xl"
      >
        <ScrollToTop />
        {/* Mobile: clip + inner scroll. sm+: frame grows with content so screenshots fit one frame without inner scrollbar. */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain [-webkit-overflow-scrolling:touch] [touch-action:pan-y] sm:flex-none sm:overflow-visible sm:overscroll-auto">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Root is always YourDOST discovery so shared links open the product entry first. */}
              <Route path="/" element={<DiscoveryPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/home" element={<HomeDashboard />} />
              <Route path="/debrief" element={<DebriefPage />} />
              <Route path="/brief" element={<BriefPage />} />
              <Route path="/pulse" element={<PulsePage />} />
              <Route path="/memory" element={<MemoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/moment" element={<MomentCapturePage />} />
              <Route path="/moments" element={<MomentsPage />} />
            </Routes>
          </AnimatePresence>
        </div>
        {showNav && <BottomNav />}
      </div>
    </div>
  )
}
