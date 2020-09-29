import React, { useEffect, useRef } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router-dom'

import styled, { bp } from '../styles/styled'

const Aside = styled.aside<{ isSideBarOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 15rem;
  min-height: 100vh;
  padding: 5.8rem 2rem;
  background-color: ${({ theme }) => theme.colors.fbBlue};
  font-size: 2rem;
  text-align: center;
  transition: left 0.3s;
  z-index: 1;

  ${bp.mq[bp.BreakPoint.MEDIUM]} {
    left: ${({ isSideBarOpen }) => (isSideBarOpen ? 0 : '-15rem')};
  }

  li:not(:first-of-type) {
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

const ToggleButton = styled.button<{ isSideBarOpen: boolean }>`
  display: none;
  position: absolute;
  right: ${({ isSideBarOpen }) => (isSideBarOpen ? '-2rem' : '-5rem')};
  top: 1rem;
  border-radius: 50%;
  overflow: hidden;
  width: 4rem;
  height: 4rem;
  padding-top: 3.5rem;
  border: 1px solid ${({ theme }) => theme.colors.fbBlue};
  transition: right 0.2s;
  cursor: pointer;
  background-color: white;

  &.active {
    &::after {
      transform: translate(-50%, -50%) rotate(180deg);
    }
  }

  ${bp.mq[bp.BreakPoint.MEDIUM]} {
    display: block;
  }

  &:hover {
    span {
      background-color: black;
      transition: background-color 0.2s linear;
    }
  }

  span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    opacity: 0.2;
    border-radius: 0.4rem;
  }

  &::after {
    position: absolute;
    content: '';
    background: center / contain no-repeat url('/icons/direction.svg');
    width: 3rem;
    height: 3rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: transform 0.3s;
  }
`

const links = [
  { title: 'Overview', to: '/', imgSrc: '/icons/dashboard-24px.svg' },
  { title: 'Rescuetime', to: '/rescue-time', imgSrc: '/icons/timelapse-24px.svg' },
  { title: 'Github', to: '/github', imgSrc: '/icons/Github.svg' },
]

interface Props {
  isSideBarOpen: boolean
  onIsSidebarOpen: Dispatch<SetStateAction<boolean>>
}

export default function Sidebar({ isSideBarOpen, onIsSidebarOpen }: Props) {
  const toggleButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.addEventListener('click', e => {
      if (e.target !== toggleButtonRef.current) {
        onIsSidebarOpen(false)
      }
    })

    return document.removeEventListener('click', e => {
      if (e.target !== toggleButtonRef.current) {
        onIsSidebarOpen(false)
      }
    })
    // eslint-disable-next-line
  }, [])

  return (
    <Aside isSideBarOpen={isSideBarOpen}>
      <nav>
        <ul>
          {links.map(({ title, to, imgSrc }) => (
            <li key={to}>
              <Link to={to}>
                <img src={imgSrc} alt={`${title} link`} />
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <ToggleButton
        ref={toggleButtonRef}
        className={isSideBarOpen ? 'active' : ''}
        isSideBarOpen={isSideBarOpen}
        onClick={() => {
          onIsSidebarOpen(prev => !prev)
        }}
      >
        <span></span>
        Sidebar toggle button
      </ToggleButton>
    </Aside>
  )
}
