import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Header from './Header'
import Sidebar from './Sidebar'
import Overview from './pages/overview/Overview'
import Github from './pages/github/Github'

import GlobalStyle from './styles/GlobalStyle'
import styled from './styles/styled'

const Div = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  padding-left: 15rem;
  background-color: ${({ theme }) => theme.colors.fbBlue + 26};
  min-height: 100vh;
  font-size: calc(10px + 2vmin);
  color: ${({ theme }) => theme.colors.fbFont};
`

const Main = styled.main`
  min-height: 100vh;
  max-width: 1200px;
  width: 100%;
`

const Article = styled.article`
  padding: 3rem 3rem;
`

function App() {
  return (
    <Div>
      <GlobalStyle />
      <Sidebar />
      <Header />
      <Main>
        <Article>
          <Switch>
            <Route path="/" component={Overview} exact />
            <Route path="/github" component={Github} exact />
          </Switch>
        </Article>
      </Main>
    </Div>
  )
}

export default App
