import React from 'react'
import { Link } from 'react-router-dom'

import styled from './styles/styled'

const Aside = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: 15rem;
  min-height: 100vh;
  padding: 5.8rem 2rem;
  background-color: ${({ theme }) => theme.colors.fbBlue};
  font-size: 2rem;
  text-align: center;

  li:not(:first-child) {
    margin-top: 4rem;
  }

  img {
    display: block;
    margin: 0 auto;
    width: 4rem;
  }

  a {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
  }
`

export default function Sidebar() {
  return (
    <Aside>
      <nav>
        <ul>
          <li>
            <Link to="/">
              <img src="/icons/dashboard-24px.svg" alt="Overview link" />
              Overview
            </Link>
          </li>
          <li>
            <Link to="/rescue-time">
              <img src="/icons/timelapse-24px.svg" alt="Rescuetime link" />
              Rescuetime
            </Link>
          </li>
          <li>
            <Link to="/github">
              <img src="/icons/Github.svg" alt="Rescuetime link" />
              Github
            </Link>
          </li>
        </ul>
      </nav>
    </Aside>
  )
}
