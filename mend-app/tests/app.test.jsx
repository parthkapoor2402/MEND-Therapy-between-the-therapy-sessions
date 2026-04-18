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

  it('still shows YourDOST at / when onboarding is complete (Mend opens from card)', () => {
    useMendStore.setState({ onboardingComplete: true })
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: /YourDOST/i })).toBeInTheDocument()
    expect(screen.queryByText(/Good evening, Priya/)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Open Mend dashboard/i })).toBeInTheDocument()
  })
})
