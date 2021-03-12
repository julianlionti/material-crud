import React, { Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'
import { createContext } from 'react'
import { createMuiTheme } from '@material-ui/core'
import { blue, grey } from '@material-ui/core/colors'

type ThemeOptions = 'light' | 'dark'
type Context = [ThemeOptions, Dispatch<SetStateAction<ThemeOptions>>]
const ThemeContext = createContext<Context>(['light', () => {}])

export const ColorThemeProvider = ({ children }: { children: ReactNode }) => {
  const state = useState<ThemeOptions>(
    () => (localStorage.getItem('theme') as ThemeOptions) || 'light',
  )
  return <ThemeContext.Provider value={state}>{children}</ThemeContext.Provider>
}

export const useColorTheme = () => {
  const [color, setColor] = useContext(ThemeContext)
  useEffect(() => {
    localStorage.setItem('theme', color)
  }, [color])

  return { setColor, color, isDarkTheme: color === 'dark' }
}

export const getTheme = (color: ThemeOptions) => {
  return createMuiTheme({
    palette: {
      primary: { main: color === 'dark' ? grey[700] : blue[500] },
      type: color,
    },
    typography: {
      h1: {
        fontSize: 32,
      },
    },
  })
}
