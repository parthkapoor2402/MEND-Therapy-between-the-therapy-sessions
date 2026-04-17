import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App.jsx'

describe('App', () => {
  it('renders the phone frame and default route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    expect(document.querySelector('.border-gray-800')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /YourDOST/i })).toBeInTheDocument()
  })
})
