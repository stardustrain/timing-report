import React, { useState } from 'react'
import { Switch, Route } from 'react-router-dom'

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Overview from './pages/overview/Overview'
import Github from './pages/github/GithubReportPage'

import GlobalStyle from './styles/GlobalStyle'
import styled, { bp } from './styles/styled'

const Div = styled.div<{ isSideBarOpen: boolean }>`
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 0.4;
    }
  }

  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.fbBlue + 26};
  min-height: 100vh;
  font-size: calc(10px + 2vmin);
  color: ${({ theme }) => theme.colors.fbFont};

  &.active {
    &::before {
      animation-name: fadein;
      animation-delay: 0.2s;
      animation-duration: 0.3s;
      animation-fill-mode: forwards;
    }
  }

  &::before {
    display: ${({ isSideBarOpen }) => (isSideBarOpen ? 'block' : 'none')};
    position: absolute;
    content: '';
    width: calc(100% - 15rem);
    height: 100%;
    top: 0;
    left: 15rem;
    background-color: black;
    opacity: 0;
    z-index: 1;
  }
`

const Main = styled.main`
  min-height: 100vh;
  max-width: 1200px;
  width: 100%;
  padding-left: 15rem;
  transition: padding-left 0.3s;

  ${bp.mq[bp.BreakPoint.MEDIUM]} {
    padding-left: 0;
  }

  & > div {
    padding: 3rem 3rem;
  }
`

function App() {
  const [isSideBarOpen, setIsSidebarOpen] = useState(false)

  return (
    <Div className={isSideBarOpen ? 'active' : ''} isSideBarOpen={isSideBarOpen}>
      <GlobalStyle />
      <Sidebar isSideBarOpen={isSideBarOpen} onIsSidebarOpen={setIsSidebarOpen} />
      <Header />
      <Main>
        <Switch>
          <Route path="/github" component={Overview} exact />
          <Route path="/" component={Github} exact />
        </Switch>
      </Main>
    </Div>
  )
}

export default App
