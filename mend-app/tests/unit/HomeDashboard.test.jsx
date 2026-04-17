import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { BottomNav } from '../../src/components/ui/BottomNav.jsx'
import { HomeDashboard } from '../../src/pages/HomeDashboard.jsx'
import { mockDebriefEntries } from '../../src/data/mockData.js'
import { useMendStore } from '../../src/store/useMendStore.js'

function ShellWithNav() {
  return (
    <div className="relative min-h-[844px]">
      <HomeDashboard />
      <BottomNav />
    </div>
  )
}

function renderHome(pathname = '/home') {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route path="/home" element={<ShellWithNav />} />
        <Route path="/debrief" element={<div>Debrief</div>} />
        <Route path="/brief" element={<div>Brief</div>} />
        <Route path="/pulse" element={<div>Pulse</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('HomeDashboard', () => {
  beforeEach(() => {
    useMendStore.setState({ briefGenerated: false })
  })

  it('Greeting shows "Good evening, Priya"', () => {
    renderHome()
    expect(screen.getByText(/Good evening, Priya/)).toBeInTheDocument()
  })

  it('Session card shows therapist and session time', () => {
    renderHome()
    expect(screen.getByText('Dr. Meera Nair')).toBeInTheDocument()
    expect(screen.getByText('Thursday, April 24 · 6:00 PM')).toBeInTheDocument()
  })

  it('When briefGenerated is false: debrief card with Start Debrief button', () => {
    useMendStore.setState({ briefGenerated: false })
    renderHome()
    expect(screen.getByText('Debrief your last session')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Start debrief/i })).toHaveTextContent('Start Debrief →')
  })

  it('When briefGenerated is true: session debriefed card', () => {
    useMendStore.setState({ briefGenerated: true })
    renderHome()
    expect(screen.getByText('Session debriefed ✓')).toBeInTheDocument()
  })

  it('Memory Jar renders 3 cards', () => {
    renderHome()
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(3)
  })

  it('First memory card shows first mockDebriefEntries answer', () => {
    renderHome()
    const first = screen.getAllByRole('article')[0]
    expect(first).toHaveTextContent(mockDebriefEntries[0].answer)
  })

  it('Pulse teaser shows pattern count copy', () => {
    renderHome()
    expect(screen.getByText('3 patterns spotted this week')).toBeInTheDocument()
  })

  it('BottomNav renders 4 tabs', () => {
    renderHome()
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Debrief' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Brief' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pulse' })).toBeInTheDocument()
  })

  it('BottomNav home tab is active on /home', () => {
    renderHome('/home')
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
})
