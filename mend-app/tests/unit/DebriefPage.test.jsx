import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DebriefPage } from '../../src/pages/DebriefPage.jsx'
import { mockDebriefEntries } from '../../src/data/mockData.js'
import { useMendStore } from '../../src/store/useMendStore.js'

function renderDebrief(initialEntry = '/debrief') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/debrief" element={<DebriefPage />} />
        <Route path="/home" element={<div data-testid="home">Home</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('DebriefPage', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    useMendStore.setState({ debriefAnswers: {}, briefGenerated: false })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Step -1 renders headline', () => {
    renderDebrief()
    expect(screen.getByText('Capture before it fades')).toBeInTheDocument()
  })

  it('Step -1 shows privacy note about audio on device', () => {
    renderDebrief()
    expect(screen.getByText(/Audio processed on device only/)).toBeInTheDocument()
  })

  it('Start Debrief advances to step 0', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderDebrief()
    await user.click(screen.getByRole('button', { name: /Start debrief/i }))
    expect(screen.getByText(mockDebriefEntries[0].question)).toBeInTheDocument()
  })

  it('Step 0 shows first question and tag', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderDebrief()
    await user.click(screen.getByRole('button', { name: /Start debrief/i }))
    expect(screen.getByText(mockDebriefEntries[0].tagLabel)).toBeInTheDocument()
    expect(screen.getByText(mockDebriefEntries[0].tag)).toBeInTheDocument()
  })

  it('Progress bar at step 0 is 20% width', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderDebrief()
    await user.click(screen.getByRole('button', { name: /Start debrief/i }))
    const bar = screen.getByTestId('debrief-progress-inner')
    expect(bar).toHaveAttribute('data-progress-pct', '20')
  })

  it('Progress bar at step 4 is 100% width', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderDebrief()
    await user.click(screen.getByRole('button', { name: /Start debrief/i }))
    for (let step = 0; step < 4; step += 1) {
      const ans = mockDebriefEntries[step].answer
      await user.click(screen.getByTestId('debrief-mic'))
      act(() => {
        vi.advanceTimersByTime(ans.length * 30 + 50)
      })
      await user.click(screen.getByTestId('debrief-next'))
    }
    const bar = screen.getByTestId('debrief-progress-inner')
    expect(bar).toHaveAttribute('data-progress-pct', '100')
  })

  it('Next question disabled when transcript empty', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderDebrief()
    await user.click(screen.getByRole('button', { name: /Start debrief/i }))
    expect(screen.getByTestId('debrief-next')).toBeDisabled()
  })

  it('After mic tap shows Listening', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderDebrief()
    await user.click(screen.getByRole('button', { name: /Start debrief/i }))
    await user.click(screen.getByTestId('debrief-mic'))
    expect(screen.getByText(/Listening/i)).toBeInTheDocument()
  })

  it('After typewriter completes Next is enabled', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderDebrief()
    await user.click(screen.getByRole('button', { name: /Start debrief/i }))
    await user.click(screen.getByTestId('debrief-mic'))
    const len = mockDebriefEntries[0].answer.length
    act(() => {
      vi.advanceTimersByTime(len * 30 + 50)
    })
    expect(screen.getByTestId('debrief-next')).not.toBeDisabled()
  })

  it('Step 4 shows Complete Debrief button', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderDebrief()
    await user.click(screen.getByRole('button', { name: /Start debrief/i }))

    for (let step = 0; step < 4; step += 1) {
      const ans = mockDebriefEntries[step].answer
      await user.click(screen.getByTestId('debrief-mic'))
      act(() => {
        vi.advanceTimersByTime(ans.length * 30 + 50)
      })
      await user.click(screen.getByTestId('debrief-next'))
    }

    expect(screen.getByRole('button', { name: /Complete debrief/i })).toHaveTextContent(
      'Complete Debrief ✓',
    )
  })

  it('Step 5 shows Saved and 5 summary cards', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderDebrief()
    await user.click(screen.getByRole('button', { name: /Start debrief/i }))

    for (let step = 0; step < 5; step += 1) {
      const ans = mockDebriefEntries[step].answer
      await user.click(screen.getByTestId('debrief-mic'))
      act(() => {
        vi.advanceTimersByTime(ans.length * 30 + 50)
      })
      await user.click(screen.getByTestId('debrief-next'))
    }

    expect(screen.getByText('Saved. ✓')).toBeInTheDocument()
    const cards = screen.getAllByTestId('debrief-summary-card')
    expect(cards).toHaveLength(5)
    expect(within(cards[0]).getByText(mockDebriefEntries[0].answer)).toBeInTheDocument()
  })

  it('setBriefGenerated true on completion', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderDebrief()
    await user.click(screen.getByRole('button', { name: /Start debrief/i }))
    for (let step = 0; step < 5; step += 1) {
      const ans = mockDebriefEntries[step].answer
      await user.click(screen.getByTestId('debrief-mic'))
      act(() => {
        vi.advanceTimersByTime(ans.length * 30 + 50)
      })
      await user.click(screen.getByTestId('debrief-next'))
    }
    expect(useMendStore.getState().briefGenerated).toBe(true)
  })
})
