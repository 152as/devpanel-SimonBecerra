import { useState } from 'react'
import { applyTheme, getPreferredTheme, type Theme } from '../lib/theme'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => getPreferredTheme())

  const toggleTheme = () => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark'
      applyTheme(next)
      return next
    })
  }

  return { theme, toggleTheme }
}
