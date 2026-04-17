import { YourdostHomeScreen } from '../components/discovery/YourdostHomeScreen'
import PageTransition from '../components/ui/PageTransition.jsx'

export function DiscoveryPage() {
  return (
    <PageTransition className="flex min-h-0 flex-1 flex-col bg-white">
      <YourdostHomeScreen />
    </PageTransition>
  )
}

export default DiscoveryPage
