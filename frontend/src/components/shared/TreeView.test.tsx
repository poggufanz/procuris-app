import { render, screen } from '@testing-library/react'
import { TreeView } from './TreeView'

test('renders nested node labels', () => {
  render(<TreeView nodes={[{ id: 1, name: 'Manager IT', children: [{ id: 2, name: 'Staff IT', children: [] }] }]} />)
  expect(screen.getByText('Manager IT')).toBeInTheDocument()
  expect(screen.getByText('Staff IT')).toBeInTheDocument()
})
