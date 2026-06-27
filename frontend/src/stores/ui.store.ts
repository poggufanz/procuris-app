import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type System = 'hris' | 'purchasing'
type Theme = 'light' | 'dark'

interface UiState {
  theme: Theme
  activeSystem: System
  toggleTheme: () => void
  setActiveSystem: (s: System) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'light',
      activeSystem: 'hris',
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      setActiveSystem: (activeSystem) => set({ activeSystem }),
    }),
    { name: 'procuris.ui' },
  ),
)
