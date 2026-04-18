import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { BottomNav } from '../../src/components/ui/BottomNav.jsx'
import { HomeDashboard } from '../../src/pages/HomeDashboard.jsx'
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
        <Route path="/memory" element={<div>Memory</div>} />
        <Route path="/settings" element={<div>Settings</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

function resetHomeState() {
  try {
    localStorage.removeItem('mend-storage')
  } catch {
    /* ignore */
  }
  useMendStore.setState({
    briefGenerated: false,
    allDebriefs: [],
    pulsePatterns: [],
    currentBrief: null,
    onboardingComplete: true,
  })
}

describe('HomeDashboard', () => {
  beforeEach(() => {
    resetHomeState()
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

  it('Session card shows next session number', () => {
    renderHome()
    expect(screen.getByText('Session 1')).toBeInTheDocument()
  })

  it('When not debriefed today: debrief card with Start Debrief button', () => {
    renderHome()
    expect(screen.getByText('Debrief your last session')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Start debrief/i })).toHaveTextContent('Start Debrief →')
  })

  it('When debriefed today: session debriefed card', () => {
    const today = new Date().toISOString()
    useMendStore.setState({
      allDebriefs: [
        {
          id: 1,
          date: today,
          answers: { emotion: 'Calm' },
        },
      ],
      briefGenerated: true,
    })
    renderHome()
    expect(screen.getByText('Session debriefed ✓')).toBeInTheDocument()
  })

  it('Memory Jar shows 3 placeholders when no debriefs', () => {
    renderHome()
    expect(screen.getAllByText('Your captures will appear here')).toHaveLength(3)
  })

  it('Memory Jar shows real capture when debriefs exist', () => {
    useMendStore.setState({
      allDebriefs: [
        {
          id: 1,
          date: new Date('2026-01-15').toISOString(),
          answers: { emotion: 'I felt lighter after naming the fear.' },
        },
      ],
    })
    renderHome()
    expect(screen.getByText(/I felt lighter after naming the fear/)).toBeInTheDocument()
  })

  it('Pulse teaser uses pulsePatterns length when set', () => {
    useMendStore.setState({ pulsePatterns: [{ id: 1 }, { id: 2 }] })
    renderHome()
    expect(screen.getByText('2 patterns spotted this week')).toBeInTheDocument()
  })

  it('Pulse teaser falls back to 3 when pulsePatterns empty', () => {
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

  it('See all navigates to memory', async () => {
    const user = userEvent.setup()
    renderHome()
    await user.click(screen.getByRole('button', { name: /See all memories/i }))
    expect(screen.getByText('Memory')).toBeInTheDocument()
  })

  it('Settings bell navigates to settings', async () => {
    const user = userEvent.setup()
    renderHome()
    await user.click(screen.getByRole('button', { name: /Settings/i }))
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })
})
