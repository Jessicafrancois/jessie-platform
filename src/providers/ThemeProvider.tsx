'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

type Theme =
  | 'system'
  | 'light'
  | 'dark'

interface ThemeContextType {
  theme: Theme

  setTheme: (
    theme: Theme
  ) => void
}

const ThemeContext =
  createContext<
    ThemeContextType
  >({
    theme: 'system',
    setTheme: () => {},
  })

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {

  const [theme, setTheme] =
    useState<Theme>('system')

  useEffect(() => {

    const saved =
      localStorage.getItem(
        'theme'
      ) as Theme | null

    if (saved) {
      setTheme(saved)
    }

  }, [])

  useEffect(() => {

    localStorage.setItem(
      'theme',
      theme
    )

    const root =
      document.documentElement

    root.classList.remove(
      'light',
      'dark'
    )

    if (theme === 'system') {

      const dark =
        window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches

      root.classList.add(
        dark
          ? 'dark'
          : 'light'
      )

      return
    }

    root.classList.add(theme)

  }, [theme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(
    ThemeContext
  )
}

