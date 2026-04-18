import { render, screen } from '@testing-library/react'
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

  it('redirects / to home when onboarding is complete', () => {
    useMendStore.setState({ onboardingComplete: true })
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.queryByRole('heading', { name: /YourDOST/i })).not.toBeInTheDocument()
    expect(screen.getByText(/Good evening, Priya/)).toBeInTheDocument()
  })
})
