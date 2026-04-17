import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { OnboardingPage } from '../../src/pages/OnboardingPage.jsx'
import { useMendStore } from '../../src/store/useMendStore.js'

function renderOnboarding(initialEntry = '/onboarding') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/debrief" element={<div data-testid="debrief-page">Debrief</div>} />
        <Route path="/home" element={<div data-testid="home-page">Home</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

async function goToScreen1(user) {
  renderOnboarding()
  await user.click(screen.getByRole('button', { name: /Continue onboarding/i }))
  await waitFor(() => {
    expect(screen.getByText("Let's get you set up")).toBeInTheDocument()
  })
}

async function goToScreen2(user) {
  await goToScreen1(user)
  await user.click(screen.getByRole('button', { name: /Continue to consent/i }))
  await waitFor(() => {
    expect(screen.getByText("You're always in control.")).toBeInTheDocument()
  })
}

async function goToScreen3(user) {
  await goToScreen2(user)
  await user.click(screen.getByRole('button', { name: /Continue to finish/i }))
  await waitFor(() => {
    expect(screen.getByText('Had any therapy recently?')).toBeInTheDocument()
  })
}

describe('OnboardingPage', () => {
  beforeEach(() => {
    useMendStore.setState({ onboardingComplete: false })
  })

  it('Screen 0 renders headline', () => {
    renderOnboarding()
    expect(screen.getByText('Only listens when you ask it to.')).toBeInTheDocument()
  })

  it('Screen 0 renders 3 trust bullets', () => {
    renderOnboarding()
    expect(screen.getByText('Audio processed on your device')).toBeInTheDocument()
    expect(screen.getByText('Delete anything, anytime, instantly')).toBeInTheDocument()
    expect(screen.getByText('Never shared without your permission')).toBeInTheDocument()
  })

  it('"I\'m in" button advances to screen 1', async () => {
    const user = userEvent.setup()
    await goToScreen1(user)
    await waitFor(() => {
      expect(screen.getByText('Which app do you use for therapy?')).toBeInTheDocument()
    })
  })

  it('Screen 1: clicking BetterHelp deselects YourDost', async () => {
    const user = userEvent.setup()
    await goToScreen1(user)
    const yourDost = screen.getByRole('button', { name: 'YourDost' })
    const betterHelp = screen.getByRole('button', { name: 'BetterHelp' })
    expect(yourDost).toHaveAttribute('aria-pressed', 'true')
    await user.click(betterHelp)
    expect(yourDost).toHaveAttribute('aria-pressed', 'false')
    expect(betterHelp).toHaveAttribute('aria-pressed', 'true')
  })

  it('Screen 1: response card appears when all fields have values', async () => {
    const user = userEvent.setup()
    await goToScreen1(user)
    await waitFor(() => {
      expect(screen.getByText(/Got it, Priya/)).toBeInTheDocument()
    })

    const dateInput = screen.getByLabelText(/When is your next session/i)
    fireEvent.change(dateInput, { target: { value: '' } })
    await waitFor(() => {
      expect(screen.queryByText(/Got it, Priya/)).not.toBeInTheDocument()
    })

    fireEvent.change(dateInput, { target: { value: '2026-04-24' } })
    await waitFor(() => {
      expect(screen.getByText(/Got it, Priya/)).toBeInTheDocument()
    })
  })

  it('Screen 2 renders 3 toggle rows with correct labels', async () => {
    const user = userEvent.setup()
    await goToScreen2(user)
    expect(screen.getByText('Session reminders')).toBeInTheDocument()
    expect(screen.getByText('Pre-session brief')).toBeInTheDocument()
    expect(screen.getByText('Weekly pulse')).toBeInTheDocument()
  })

  it('Screen 2 toggle changes state on click (ON→OFF→ON)', async () => {
    const user = userEvent.setup()
    await goToScreen2(user)
    const toggle = screen.getByRole('switch', { name: /Session reminders/i })
    expect(toggle).toHaveAttribute('aria-checked', 'true')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'false')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'true')
  })

  it('Screen 3 renders both choice cards', async () => {
    const user = userEvent.setup()
    await goToScreen3(user)
    expect(screen.getByRole('button', { name: /Yes, debrief now/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Remind me after my next session/i }),
    ).toBeInTheDocument()
  })

  it('Screen 3 "Yes, debrief now" sets onboarding complete and navigates to /debrief', async () => {
    const user = userEvent.setup()
    await goToScreen3(user)
    await user.click(screen.getByRole('button', { name: /Yes, debrief now/i }))
    await waitFor(() => {
      expect(useMendStore.getState().onboardingComplete).toBe(true)
      expect(screen.getByTestId('debrief-page')).toBeInTheDocument()
    })
  })

  it('Screen 3 remind card navigates to /home', async () => {
    const user = userEvent.setup()
    await goToScreen3(user)
    await user.click(screen.getByRole('button', { name: /Remind me after my next session/i }))
    await waitFor(() => {
      expect(useMendStore.getState().onboardingComplete).toBe(true)
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
    })
  })

  it('ProgressDots shows correct active index on each screen', async () => {
    const user = userEvent.setup()
    renderOnboarding()

    const dot = (i) => screen.getByTestId(`progress-dot-${i}`)

    expect(dot(0)).toHaveClass('bg-mend-green')
    expect(dot(1)).not.toHaveClass('bg-mend-green')

    await user.click(screen.getByRole('button', { name: /Continue onboarding/i }))
    await waitFor(() => {
      expect(dot(1)).toHaveClass('bg-mend-green')
      expect(dot(2)).not.toHaveClass('bg-mend-green')
    })

    await user.click(screen.getByRole('button', { name: /Continue to consent/i }))
    await waitFor(() => {
      expect(dot(2)).toHaveClass('bg-mend-green')
      expect(dot(3)).not.toHaveClass('bg-mend-green')
    })

    await user.click(screen.getByRole('button', { name: /Continue to finish/i }))
    await waitFor(() => {
      expect(dot(3)).toHaveClass('bg-mend-green')
    })
    expect(dot(0)).toHaveClass('bg-mend-green')
    expect(dot(1)).toHaveClass('bg-mend-green')
    expect(dot(2)).toHaveClass('bg-mend-green')
  })
})
