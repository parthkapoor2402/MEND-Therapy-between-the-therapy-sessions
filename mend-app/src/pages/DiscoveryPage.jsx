import { YourdostHomeScreen } from '../components/discovery/YourdostHomeScreen'
import PageTransition from '../components/ui/PageTransition.jsx'

export function DiscoveryPage() {
  return (
    <PageTransition className="flex h-full min-h-full flex-col bg-white">
      <YourdostHomeScreen />
    </PageTransition>
  )
}

export default DiscoveryPage
