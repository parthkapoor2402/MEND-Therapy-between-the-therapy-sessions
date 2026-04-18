import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DebriefPage } from '../../src/pages/DebriefPage.jsx'

vi.mock('../../src/services/geminiService.js', () => ({
  generateBriefFromDebrief: vi.fn().mockResolvedValue(null),
}))
import { mockDebriefEntries } from '../../src/data/mockData.js'
import { useMendStore } from '../../src/store/useMendStore.js'

const speech = vi.hoisted(() => ({
  lastOpts: null,
  flushFinal: (text) => {
    speech.lastOpts?.onResult(text, true)
    speech.lastOpts?.onEnd?.()
  },
}))

vi.mock('../../src/hooks/useSpeechRecognition.js', () => ({
  useSpeechRecognition: (opts) => {
    speech.lastOpts = opts
    return {
      startListening: vi.fn(() => true),
      stopListening: vi.fn(() => {
        opts.onEnd?.()
      }),
    }
  },
}))

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
    try {
      localStorage.removeItem('mend-storage')
    } catch {
      /* ignore */
    }
    useMendStore.setState({
      debriefAnswers: {},
      briefGenerated: false,
      allDebriefs: [],
    })
    speech.lastOpts = null
  })

  afterEach(() => {
    vi.clearAllMocks()
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
    const user = userEvent.setup()
    renderDebrief()
    await user.click(screen.getByRole('button', { name: /Start debrief/i }))
    expect(screen.getByText(mockDebriefEntries[0].question)).toBeInTheDocument()
  })

  it('Step 0 shows first question and tag', async () => {
    const user = userEvent.setup()
    renderDebrief()
    await user.click(screen.getByRole('button', { name: /Start debrief/i }))
    expect(screen.getByText(mockDebriefEntries[0].tagLabel)).toBeInTheDocument()
    expect(screen.getByText(mockDebriefEntries[0].tag)).toBeInTheDocument()
  })

  it('Progress bar at step 0 is 20% width', async () => {
    const user = userEvent.setup()
    renderDebrief()
    await user.click(screen.getByRole('button', { name: /Start debrief/i }))
    const bar = screen.getByTestId('debrief-progress-inner')
    expect(bar).toHaveAttribute('data-progress-pct', '20')
  })

  it('Progress bar at step 4 is 100% width', async () => {
    const user = userEvent.setup()
    renderDebrief()
    await user.click(screen.getByRole('button', { name: /Start debrief/i }))
    for (let step = 0; step < 4; step += 1) {
      await user.click(screen.getByTestId('debrief-mic'))
      act(() => {
        speech.flushFinal(mockDebriefEntries[step].answer)
      })
      await user.click(screen.getByTestId('debrief-next'))
    }
    const bar = screen.getByTestId('debrief-progress-inner')
    expect(bar).toHaveAttribute('data-progress-pct', '100')
  })

  it('Next question disabled when transcript empty', async () => {
    const user = userEvent.setup()
    renderDebrief()
    await user.click(screen.getByRole('button', { name: /Start debrief/i }))
    expect(screen.getByTestId('debrief-next')).toBeDisabled()
  })

  it('After mic tap shows Listening', async () => {
    const user = userEvent.setup()
    renderDebrief()
    await user.click(screen.getByRole('button', { name: /Start debrief/i }))
    await user.click(screen.getByTestId('debrief-mic'))
    expect(screen.getByText(/Listening/i)).toBeInTheDocument()
  })

  it('After final transcript Next is enabled', async () => {
    const user = userEvent.setup()
    renderDebrief()
    await user.click(screen.getByRole('button', { name: /Start debrief/i }))
    await user.click(screen.getByTestId('debrief-mic'))
    act(() => {
      speech.flushFinal(mockDebriefEntries[0].answer)
    })
    expect(screen.getByTestId('debrief-next')).not.toBeDisabled()
  })

  it('Step 4 shows Complete Debrief button', async () => {
    const user = userEvent.setup()
    renderDebrief()
    await user.click(screen.getByRole('button', { name: /Start debrief/i }))

    for (let step = 0; step < 4; step += 1) {
      await user.click(screen.getByTestId('debrief-mic'))
      act(() => {
        speech.flushFinal(mockDebriefEntries[step].answer)
      })
      await user.click(screen.getByTestId('debrief-next'))
    }

    expect(screen.getByRole('button', { name: /Complete debrief/i })).toHaveTextContent(
      'Complete Debrief ✓',
    )
  })

  it('Step 5 shows Saved and 5 summary cards', async () => {
    const user = userEvent.setup()
    renderDebrief()
    await user.click(screen.getByRole('button', { name: /Start debrief/i }))

    for (let step = 0; step < 5; step += 1) {
      await user.click(screen.getByTestId('debrief-mic'))
      act(() => {
        speech.flushFinal(mockDebriefEntries[step].answer)
      })
      await user.click(screen.getByTestId('debrief-next'))
    }

    await waitFor(() => {
      expect(screen.getByText('Saved. ✓')).toBeInTheDocument()
    })
    const cards = screen.getAllByTestId('debrief-summary-card')
    expect(cards).toHaveLength(5)
    expect(within(cards[0]).getByText(mockDebriefEntries[0].answer)).toBeInTheDocument()
  })

  it('briefGenerated true on completion', async () => {
    const user = userEvent.setup()
    renderDebrief()
    await user.click(screen.getByRole('button', { name: /Start debrief/i }))
    for (let step = 0; step < 5; step += 1) {
      await user.click(screen.getByTestId('debrief-mic'))
      act(() => {
        speech.flushFinal(mockDebriefEntries[step].answer)
      })
      await user.click(screen.getByTestId('debrief-next'))
    }
    await waitFor(() => {
      expect(useMendStore.getState().briefGenerated).toBe(true)
    })
  })
})
