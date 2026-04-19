import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    AnimatePresence: ({ children }) => children,
  }
})

const tagMomentMock = vi.fn()

vi.mock('../../src/services/geminiService.js', () => ({
  tagMoment: (...args) => tagMomentMock(...args),
}))

const startListening = vi.fn(() => true)
const stopListening = vi.fn()

vi.mock('../../src/hooks/useSpeechRecognition.js', () => ({
  useSpeechRecognition: () => ({
    startListening,
    stopListening,
  }),
}))

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { MomentCapturePage } from '../../src/pages/MomentCapturePage.jsx'
import { useMendStore } from '../../src/store/useMendStore.js'

function renderMoment() {
  return render(
    <MemoryRouter initialEntries={['/moment']}>
      <Routes>
        <Route path="/moment" element={<MomentCapturePage />} />
        <Route path="/home" element={<div>Home page</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('MomentCapturePage', () => {
  beforeEach(() => {
    try {
      localStorage.removeItem('mend-storage')
    } catch {
      /* ignore */
    }
    tagMomentMock.mockReset()
    tagMomentMock.mockResolvedValue({
      keyCapture: 'key phrase',
      emotionTag: 'emotion',
      tagEmoji: '💛',
      patternDetected: true,
      patternLabel: 'avoidance',
      momentLabel: 'A hard moment',
    })
    startListening.mockClear()
    stopListening.mockClear()
    useMendStore.setState({
      isPro: false,
      momentUsed: false,
      moments: [],
    })
  })

  it('renders in idle state with mic button', () => {
    renderMoment()
    expect(screen.getByTestId('moment-mic')).toBeInTheDocument()
    expect(screen.getByTestId('moment-capture-idle')).toBeInTheDocument()
  })

  it('Idle state shows live time display', () => {
    renderMoment()
    expect(screen.getByText(/Tap and speak/)).toBeInTheDocument()
  })

  it('Mic button tap starts listening and shows recording UI', async () => {
    const user = userEvent.setup()
    renderMoment()
    await user.click(screen.getByTestId('moment-mic'))
    expect(startListening).toHaveBeenCalled()
    expect(screen.getByTestId('moment-capture-recording')).toBeInTheDocument()
    expect(screen.getByText('Listening...')).toBeInTheDocument()
  })

  it('Recording state shows Listening label', async () => {
    const user = userEvent.setup()
    renderMoment()
    await user.click(screen.getByTestId('moment-mic'))
    expect(screen.getByText('Listening...')).toBeInTheDocument()
  })

  it('Stop button returns to idle when no transcript', async () => {
    const user = userEvent.setup()
    renderMoment()
    await user.click(screen.getByTestId('moment-mic'))
    await user.click(screen.getByTestId('moment-stop'))
    await waitFor(() => expect(screen.getByTestId('moment-capture-idle')).toBeInTheDocument())
  })

  it('Typed state shows captured text and actions after text mode save', async () => {
    const user = userEvent.setup()
    renderMoment()
    await user.click(screen.getByTestId('moment-type-instead'))
    await user.type(
      screen.getByTestId('moment-textarea'),
      'Something important happened today and I need to say it out loud.',
    )
    await user.click(screen.getByTestId('moment-text-save'))
    expect(screen.getByTestId('moment-capture-typed')).toBeInTheDocument()
    expect(screen.getByText(/Something important happened/)).toBeInTheDocument()
    expect(screen.getByTestId('moment-save')).toBeInTheDocument()
    expect(screen.getByTestId('moment-rerecord')).toBeInTheDocument()
  })

  it('Re-record clears and returns to idle', async () => {
    const user = userEvent.setup()
    renderMoment()
    await user.click(screen.getByTestId('moment-type-instead'))
    await user.type(screen.getByTestId('moment-textarea'), 'Enough text here for sure yes.')
    await user.click(screen.getByTestId('moment-text-save'))
    await user.click(screen.getByTestId('moment-rerecord'))
    expect(screen.getByTestId('moment-capture-idle')).toBeInTheDocument()
  })

  it('"Type instead" shows text mode overlay', async () => {
    const user = userEvent.setup()
    renderMoment()
    await user.click(screen.getByTestId('moment-type-instead'))
    expect(screen.getByTestId('moment-textarea')).toBeInTheDocument()
    expect(screen.getByText('Type your moment')).toBeInTheDocument()
  })

  it('Text mode save disabled when text < 5 chars', async () => {
    const user = userEvent.setup()
    renderMoment()
    await user.click(screen.getByTestId('moment-type-instead'))
    await user.type(screen.getByTestId('moment-textarea'), 'ab')
    expect(screen.getByTestId('moment-text-save')).toBeDisabled()
  })

  it('Text mode save enabled when text >= 5 chars', async () => {
    const user = userEvent.setup()
    renderMoment()
    await user.click(screen.getByTestId('moment-type-instead'))
    await user.type(screen.getByTestId('moment-textarea'), 'hello')
    expect(screen.getByTestId('moment-text-save')).not.toBeDisabled()
  })

  it('Save flow reaches saved state with summary', async () => {
    const user = userEvent.setup()
    renderMoment()
    await user.click(screen.getByTestId('moment-type-instead'))
    await user.type(screen.getByTestId('moment-textarea'), 'This is my moment text for saving now.')
    await user.click(screen.getByTestId('moment-text-save'))
    await user.click(screen.getByTestId('moment-save'))
    await waitFor(() => expect(screen.getByTestId('moment-capture-saved')).toBeInTheDocument())
    expect(screen.getByText('Moment saved.')).toBeInTheDocument()
  })

  it('addMoment sets momentUsed after save', async () => {
    const user = userEvent.setup()
    renderMoment()
    await user.click(screen.getByTestId('moment-type-instead'))
    await user.type(screen.getByTestId('moment-textarea'), 'Enough characters here for the save.')
    await user.click(screen.getByTestId('moment-text-save'))
    await user.click(screen.getByTestId('moment-save'))
    await waitFor(() => expect(useMendStore.getState().momentUsed).toBe(true))
    expect(useMendStore.getState().moments.length).toBe(1)
  })

  it('Paywall shows on mount when momentUsed true and !isPro', () => {
    useMendStore.setState({ momentUsed: true, isPro: false, moments: [{ id: 1, keyCapture: 'x' }] })
    renderMoment()
    expect(screen.getByText("Real life doesn't wait")).toBeInTheDocument()
  })
})
