import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    /** JSDOM never finishes AnimatePresence exit animations; passthrough for tests. */
    AnimatePresence: ({ children }) => children,
  }
})

import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PulsePage } from '../../src/pages/PulsePage.jsx'
import { mockPulsePatterns } from '../../src/data/mockData.js'
import { useMendStore } from '../../src/store/useMendStore.js'

function renderPulse() {
  return render(
    <MemoryRouter initialEntries={['/pulse']}>
      <Routes>
        <Route path="/pulse" element={<PulsePage />} />
        <Route path="/home" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('PulsePage', () => {
  beforeEach(() => {
    useMendStore.setState({ pulsePatterns: [] })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('renders 3 pattern cards', () => {
    renderPulse()
    expect(screen.getByTestId('pulse-card-recurring')).toBeInTheDocument()
    expect(screen.getByTestId('pulse-card-shift')).toBeInTheDocument()
    expect(screen.getByTestId('pulse-card-regression')).toBeInTheDocument()
  })

  it('Card 1 shows RECURRING PATTERN strip', () => {
    renderPulse()
    expect(screen.getByText('RECURRING PATTERN')).toBeInTheDocument()
  })

  it('Card 1 shows 4 context chips', () => {
    renderPulse()
    for (const c of mockPulsePatterns[0].contexts) {
      expect(screen.getByText(c)).toBeInTheDocument()
    }
  })

  it('Card 2 shows SHIFT POINT strip', () => {
    renderPulse()
    expect(screen.getByText('SHIFT POINT')).toBeInTheDocument()
  })

  it('Card 2 timeline has 7 day labels', () => {
    renderPulse()
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Sun')).toBeInTheDocument()
  })

  it('Card 3 shows REGRESSION DETECTED on red strip', () => {
    renderPulse()
    const strip = screen.getByText('REGRESSION DETECTED').closest('div')
    expect(strip).toHaveClass('bg-mend-red')
  })

  it('Card 3 shows before and after quotes', () => {
    renderPulse()
    expect(screen.getByText(/I don't believe I deserve to rest/)).toBeInTheDocument()
    expect(screen.getByText(/I keep pushing through even when I'm exhausted/)).toBeInTheDocument()
  })

  it('Card 3 footer shows Add to brief', () => {
    renderPulse()
    const btn = screen.getByTestId('pulse-add-brief-3')
    expect(btn).toHaveTextContent('Add to brief →')
  })

  it('Add to brief on card 3 calls Zustand and shows Added', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const spy = vi.spyOn(useMendStore.getState(), 'addPulseToBreif')
    renderPulse()
    await user.click(screen.getByTestId('pulse-add-brief-3'))
    expect(spy).toHaveBeenCalledWith(3)
    expect(screen.getByText('Added ✓')).toBeInTheDocument()
    spy.mockRestore()
  })

  it('toast shows then hides after 2s', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderPulse()
    await user.click(screen.getByTestId('pulse-add-brief-3'))
    expect(screen.getByTestId('pulse-toast')).toHaveTextContent(/Added to Thursday's brief/)
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(screen.queryByTestId('pulse-toast')).not.toBeInTheDocument()
  })
})
