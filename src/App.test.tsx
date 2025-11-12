//SMOKE TEST
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App (smoke)', () => {
  it('deve renderizar o título principal', () => {
    render(<App />)
    const heading = screen.getByRole('heading', { name: /Whitebook/i })
    expect(heading).toBeInTheDocument()
  })
})

// describe('App (smokeParagraph)', () => {
//   it('deve renderizar o parágrafo de descrição', () => {
//     render(<App />)
//     const paragraph = screen.getByText(/Teste do tailwind./i)
//     expect(paragraph).toBeInTheDocument()
//   })
// })