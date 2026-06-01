import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../src/App.jsx'
import { useMendStore } from '../src/store/useMendStore.js'

describe('App', () => {
  beforeEach(() => {
    try {
      localStorage.removeItem('mend-storage')
    } catch {
      /* ignore */
    }
    useMendStore.setState({ onboardingComplete: false })
  })

  it('renders the phone frame and default route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    expect(document.querySelector('[data-testid="mend-device-frame"]')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /YourDOST/i })).toBeInTheDocument()
  })

  it('Mend card routes through onboarding even when onboarding is complete', async () => {
    const user = userEvent.setup()
    useMendStore.setState({ onboardingComplete: true })
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: /YourDOST/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Open Mend/i }))
    await waitFor(() => {
      expect(screen.getByText('Only listens when you ask it to.')).toBeInTheDocument()
    })
  })
})
