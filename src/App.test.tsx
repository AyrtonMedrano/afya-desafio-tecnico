//SMOKE TEST
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App (smoke)', () => {
  it('deve renderizar o título principal', () => {
    render(<App />)
    const heading = screen.getByRole('heading', { name: /Afya • Teste Técnico/i })
    expect(heading).toBeInTheDocument()
  })
})