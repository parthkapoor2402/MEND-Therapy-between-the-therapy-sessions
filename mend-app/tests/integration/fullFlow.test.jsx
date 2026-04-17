import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '../../src/App.jsx'
import { mockBriefBullets, mockDebriefEntries } from '../../src/data/mockData.js'

function renderAtRoute(route) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  )
}

describe('Mend full flow', () => {
  it('Discovery page loads with YourDost mock and Mend card', () => {
    renderAtRoute('/')
    expect(screen.getByText('YourDOST')).toBeInTheDocument()
    expect(screen.getByText("Don't lose what happened in therapy.")).toBeInTheDocument()
    expect(screen.getByText('Try free →')).toBeInTheDocument()
    expect(screen.getByText('🔒 Opt-in only')).toBeInTheDocument()
  })

  it('Clicking Try free navigates to onboarding', async () => {
    renderAtRoute('/')
    fireEvent.click(screen.getByText('Try free →'))
    await waitFor(() =>
      expect(screen.getByText('Only listens when you ask it to.')).toBeInTheDocument(),
    )
  })

  it('Onboarding screen 0 shows 3 trust bullets', () => {
    renderAtRoute('/onboarding')
    expect(screen.getByText('Audio processed on your device')).toBeInTheDocument()
    expect(screen.getByText('Delete anything, anytime, instantly')).toBeInTheDocument()
    expect(screen.getByText('Never shared without your permission')).toBeInTheDocument()
  })

  it('Onboarding completes and reaches home dashboard', async () => {
    renderAtRoute('/onboarding')
    fireEvent.click(screen.getByText("I'm in — let's set up"))
    await waitFor(() => expect(screen.getByText("Let's get you set up")).toBeInTheDocument())
    fireEvent.click(screen.getByText('Continue'))
    await waitFor(() => expect(screen.getByText("You're always in control.")).toBeInTheDocument())
    fireEvent.click(screen.getByText('These look good'))
    await waitFor(() => expect(screen.getByText('Had any therapy recently?')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Remind me after my next session'))
    await waitFor(() => expect(screen.getByText('Good evening, Priya 👋')).toBeInTheDocument())
  })

  it('Home dashboard shows session card and debrief action', () => {
    renderAtRoute('/home')
    expect(screen.getByText('Dr. Meera Nair')).toBeInTheDocument()
    expect(screen.getByText('Thursday, April 24 · 6:00 PM')).toBeInTheDocument()
    expect(screen.getByText('Start Debrief →')).toBeInTheDocument()
    expect(screen.getByText('3 patterns spotted this week')).toBeInTheDocument()
  })

  it('Debrief flow: pre-screen to step 0', async () => {
    renderAtRoute('/debrief')
    expect(screen.getByText('Capture before it fades')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Start Debrief'))
    await waitFor(() => expect(screen.getByText('Question 1 of 5')).toBeInTheDocument())
    expect(screen.getByText(mockDebriefEntries[0].question)).toBeInTheDocument()
  })

  it('Pre-session brief renders all 5 bullets', () => {
    renderAtRoute('/brief')
    for (const bullet of mockBriefBullets) {
      expect(screen.getByText(bullet.label)).toBeInTheDocument()
    }
    expect(screen.getByText('Share with Dr. Meera Nair')).toBeInTheDocument()
  })

  it('Pattern pulse renders all 3 cards and regression card', () => {
    renderAtRoute('/pulse')
    expect(screen.getByText('RECURRING PATTERN')).toBeInTheDocument()
    expect(screen.getByText('SHIFT POINT')).toBeInTheDocument()
    expect(screen.getByText('REGRESSION DETECTED')).toBeInTheDocument()
    expect(screen.getByText('"I don\'t believe I deserve to rest."')).toBeInTheDocument()
  })

  it('Adding regression to brief shows toast', async () => {
    renderAtRoute('/pulse')
    const addButtons = screen.getAllByText('Add to brief →')
    fireEvent.click(addButtons[2])
    await waitFor(() => expect(screen.getByText("✓ Added to Thursday's brief")).toBeInTheDocument())
  })

  it('Bottom nav visible on inner pages, hidden on discovery and onboarding', () => {
    renderAtRoute('/')
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    renderAtRoute('/home')
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
