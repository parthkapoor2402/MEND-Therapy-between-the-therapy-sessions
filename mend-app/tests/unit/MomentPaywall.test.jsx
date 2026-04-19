import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    AnimatePresence: ({ children }) => children,
  }
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MomentPaywall } from '../../src/components/ui/MomentPaywall.jsx'
import { useMendStore } from '../../src/store/useMendStore.js'

describe('MomentPaywall', () => {
  const onClose = vi.fn()
  const onUnlock = vi.fn()

  beforeEach(() => {
    onClose.mockClear()
    onUnlock.mockClear()
    try {
      localStorage.removeItem('mend-storage')
    } catch {
      /* ignore */
    }
    useMendStore.setState({ isPro: false })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders with headline "Real life doesn\'t wait"', () => {
    render(
      <MomentPaywall
        isOpen
        onClose={onClose}
        onUnlock={onUnlock}
        firstMoment={{ keyCapture: 'First words', timestamp: new Date().toISOString() }}
      />,
    )
    expect(screen.getByText("Real life doesn't wait")).toBeInTheDocument()
  })

  it('shows first moment preview (blurred)', () => {
    render(
      <MomentPaywall
        isOpen
        onClose={onClose}
        onUnlock={onUnlock}
        firstMoment={{ keyCapture: 'My first capture line', timestamp: new Date().toISOString() }}
      />,
    )
    expect(screen.getByText(/My first capture line/)).toBeInTheDocument()
    expect(screen.getByText(/Unlock to continue capturing/)).toBeInTheDocument()
  })

  it('shows 3 Pro feature rows', () => {
    render(
      <MomentPaywall isOpen onClose={onClose} onUnlock={onUnlock} firstMoment={null} />,
    )
    expect(screen.getByText(/Unlimited Mend Moments/)).toBeInTheDocument()
    expect(screen.getByText(/Pre-Session Brief/)).toBeInTheDocument()
    expect(screen.getByText(/Patterns detected across Moments/)).toBeInTheDocument()
  })

  it('"Unlock Mend Pro →" calls onUnlock', async () => {
    const user = userEvent.setup()
    render(
      <MomentPaywall isOpen onClose={onClose} onUnlock={onUnlock} firstMoment={null} />,
    )
    await user.click(screen.getByRole('button', { name: /Unlock Mend Pro/i }))
    expect(onUnlock).toHaveBeenCalledTimes(1)
  })

  it('scrim click calls onClose', async () => {
    const user = userEvent.setup()
    render(
      <MomentPaywall isOpen onClose={onClose} onUnlock={onUnlock} firstMoment={null} />,
    )
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('unlockPro sets isPro true in store when used from parent', async () => {
    const user = userEvent.setup()
    render(
      <MomentPaywall
        isOpen
        onClose={onClose}
        onUnlock={() => {
          useMendStore.getState().unlockPro()
          onUnlock()
        }}
        firstMoment={null}
      />,
    )
    await user.click(screen.getByRole('button', { name: /Unlock Mend Pro/i }))
    expect(useMendStore.getState().isPro).toBe(true)
  })
})
