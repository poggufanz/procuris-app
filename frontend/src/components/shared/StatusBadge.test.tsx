import { render, screen } from '@testing-library/react'
import { StatusBadge } from './StatusBadge'

test('renders the status label', () => {
  render(<StatusBadge status="approved" />)
  expect(screen.getByText('approved')).toBeInTheDocument()
})

test('uses the approved status color variable', () => {
  render(<StatusBadge status="approved" />)
  expect(screen.getByText('approved')).toHaveStyle({ color: 'var(--status-approved)' })
})
