import React from 'react'

import { CssBaseline } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { blue, pink } from '@material-ui/core/colors'

import Main from './components/Main'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blue,
    secondary: pink,
  },
  spacing: 6
})

export default () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Main />
  </ThemeProvider>
)
