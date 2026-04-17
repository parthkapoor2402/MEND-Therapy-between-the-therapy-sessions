import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { DiscoveryPage } from '../../src/pages/DiscoveryPage.jsx'

function renderDiscovery(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/" element={<DiscoveryPage />} />
        <Route path="/home" element={<DiscoveryPage />} />
        <Route path="/onboarding" element={<div data-testid="onboarding-route">Onboarding</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('DiscoveryPage', () => {
  it('YourdostHomeScreen renders YourDOST header text', () => {
    renderDiscovery()
    expect(screen.getByRole('heading', { name: /YourDOST/i })).toBeInTheDocument()
  })

  it('Mood strip renders 5 emoji buttons', () => {
    renderDiscovery()
    expect(screen.getByRole('button', { name: /Mood: Sad/i })).toHaveTextContent('😞')
    expect(screen.getByRole('button', { name: /Mood: Low/i })).toHaveTextContent('😕')
    expect(screen.getByRole('button', { name: /Mood: Neutral/i })).toHaveTextContent('😐')
    expect(screen.getByRole('button', { name: /Mood: Good/i })).toHaveTextContent('🙂')
    expect(screen.getByRole('button', { name: /Mood: Great/i })).toHaveTextContent('😊')
  })

  it('Counselor section renders 3 counselor cards from mockYourDostCounselors', () => {
    renderDiscovery()
    expect(screen.getByText('Dr. Meera Nair')).toBeInTheDocument()
    expect(screen.getByText('Riya Sharma')).toBeInTheDocument()
    expect(screen.getByText('Dr. Arjun Khanna')).toBeInTheDocument()
  })

  it('MendRecommendedCard renders with headline "Don\'t lose what happened in therapy."', () => {
    renderDiscovery()
    expect(
      screen.getByText("Don't lose what happened in therapy."),
    ).toBeInTheDocument()
  })

  it('MendRecommendedCard shows 3 feature pills', () => {
    renderDiscovery()
    expect(screen.getByText('🎤 3-min voice debrief')).toBeInTheDocument()
    expect(screen.getByText('📋 Pre-session brief')).toBeInTheDocument()
    expect(screen.getByText('🔁 Pattern detection')).toBeInTheDocument()
  })

  it('Privacy text "🔒 Opt-in only" is visible', () => {
    renderDiscovery()
    expect(screen.getByText('🔒 Opt-in only')).toBeInTheDocument()
  })

  it('"Try free →" button present and navigates to /onboarding on click', async () => {
    const user = userEvent.setup()
    renderDiscovery('/home')

    const cta = screen.getByRole('button', { name: /Try Mend free/i })
    expect(cta).toHaveTextContent('Try free →')

    await user.click(cta)

    expect(screen.getByTestId('onboarding-route')).toBeInTheDocument()
  })

  it('Articles section renders 2 article cards', () => {
    renderDiscovery()
    const articles = screen.getAllByRole('article')
    expect(articles).toHaveLength(2)
    expect(screen.getByText('5 ways to manage anxiety at work')).toBeInTheDocument()
    expect(screen.getByText('Why sleep affects your mental health')).toBeInTheDocument()
  })
})
