import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { BriefPage } from '../../src/pages/BriefPage.jsx'
import { mockBriefBullets } from '../../src/data/mockData.js'

function renderBrief() {
  return render(
    <MemoryRouter initialEntries={['/brief']}>
      <Routes>
        <Route path="/brief" element={<BriefPage />} />
        <Route path="/home" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('BriefPage', () => {
  it('renders 5 bullet cards from mockBriefBullets', () => {
    renderBrief()
    const articles = screen.getAllByRole('article')
    expect(articles).toHaveLength(mockBriefBullets.length)
  })

  it('first bullet shows emoji and label', () => {
    renderBrief()
    expect(screen.getByText('💛')).toBeInTheDocument()
    expect(screen.getByText('You felt something shift')).toBeInTheDocument()
  })

  it('belief bullet (id=2) detail is italic', () => {
    renderBrief()
    const belief = mockBriefBullets.find((b) => b.id === 2)
    const detail = screen.getByText(belief.detail)
    expect(detail).toHaveClass('italic')
  })

  it('commitment bullet has checkbox', () => {
    renderBrief()
    expect(screen.getByTestId('commitment-checkbox-4')).toBeInTheDocument()
  })

  it('checkbox toggles checked state', async () => {
    const user = userEvent.setup()
    renderBrief()
    const box = screen.getByTestId('commitment-checkbox-4')
    expect(box).toHaveAttribute('aria-checked', 'false')
    await user.click(box)
    expect(box).toHaveAttribute('aria-checked', 'true')
  })

  it('checked commitment label has line-through', async () => {
    const user = userEvent.setup()
    renderBrief()
    const label = screen.getByText('You wanted to try:')
    await user.click(screen.getByTestId('commitment-checkbox-4'))
    expect(label).toHaveClass('line-through')
    expect(label).toHaveClass('opacity-60')
  })

  it('share button shows therapist name', () => {
    renderBrief()
    expect(
      screen.getByRole('button', { name: /Share with Dr\. Meera Nair/i }),
    ).toBeInTheDocument()
  })

  it('click share opens modal with 3 options', async () => {
    const user = userEvent.setup()
    renderBrief()
    await user.click(screen.getByRole('button', { name: /Share with Dr\. Meera Nair/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Send as PDF')).toBeInTheDocument()
    expect(screen.getByText('Copy to clipboard')).toBeInTheDocument()
    expect(screen.getByText('Keep private')).toBeInTheDocument()
  })

  it('Keep private closes modal', async () => {
    const user = userEvent.setup()
    renderBrief()
    await user.click(screen.getByRole('button', { name: /Share with Dr\. Meera Nair/i }))
    await user.click(screen.getByRole('button', { name: /Keep private/i }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('privacy note visible', () => {
    renderBrief()
    expect(
      screen.getByText(/Sharing is optional\. Brief stays private by default\./),
    ).toBeInTheDocument()
  })

  it('footer note shows mend reflection copy', () => {
    renderBrief()
    expect(
      screen.getByText(/These are your words, reflected back\./),
    ).toBeInTheDocument()
  })
})
