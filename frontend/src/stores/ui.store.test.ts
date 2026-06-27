import { useUiStore } from './ui.store'

test('toggleTheme flips light/dark', () => {
  useUiStore.setState({ theme: 'light' })
  useUiStore.getState().toggleTheme()
  expect(useUiStore.getState().theme).toBe('dark')
})

test('setActiveSystem switches system', () => {
  useUiStore.getState().setActiveSystem('purchasing')
  expect(useUiStore.getState().activeSystem).toBe('purchasing')
})
