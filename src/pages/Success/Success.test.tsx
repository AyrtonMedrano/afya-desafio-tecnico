import { render, screen } from '@testing-library/react'
import SuccessPage from './SuccessPage'

describe('SuccessPage', () => {
  it('renders a success message', () => {
    render(<SuccessPage />)
    expect(screen.getByText(/sucesso/i)).toBeInTheDocument()
  })
})