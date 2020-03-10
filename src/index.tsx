import React from 'react'
import ReactDOM from 'react-dom'
import { MemoryRouter as Router } from 'react-router-dom'
import { ThemeProvider } from 'emotion-theming'

import App from './App'
import { Provider, rootStore } from './store'
import { theme } from './styles/styled'

ReactDOM.render(
  <Provider value={rootStore}>
    <ThemeProvider theme={theme}>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
)
