import React from 'react'
import ReactDOM from 'react-dom'
import { MemoryRouter as Router } from 'react-router-dom'
import { ThemeProvider } from 'emotion-theming'
import { RecoilRoot } from 'recoil'

import App from './App'
import { theme } from './styles/styled'
import 'antd/dist/antd.css'

ReactDOM.render(
  <RecoilRoot>
    <ThemeProvider theme={theme}>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </RecoilRoot>,
  document.getElementById('root')
)
