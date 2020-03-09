import React, { useState, useRef } from 'react'

import useEventListener from './hooks/useEventListener'

import Button from './Button'

import styled from './styles/styled'

const StyledHeader = styled.header`
  padding: 1.2rem 0;
  background-color: rgba(0, 0, 0, 0.12);
  width: 100%;
  border-bottom: 1px solid #bdbdbd;

  div {
    position: relative;
    display: inline-block;
  }

  button {
    min-width: 12rem;
  }

  ul {
    position: absolute;
    font-size: 1.6rem;
    text-align: center;
    width: 100%;
    margin-top: 0.5rem;
    border-radius: 4px;
    background-color: #424242;
  }

  li {
    padding: 1rem 0;
    color: white;
    cursor: pointer;

    :hover {
      background-color: rgba(255, 255, 255, 0.32);
    }
  }
`

const Li = styled.li<{ isSelected: boolean }>`
  padding: 1rem 0;
  color: white;
  cursor: pointer;
  background-color: ${({ isSelected }) => (isSelected ? 'rgba(255, 255, 255, 0.16)' : '')};
  font-style: ${({ isSelected }) => (isSelected ? 'italic' : 'inherit')};

  :hover {
    background-color: rgba(255, 255, 255, 0.4);
  }
`

const options = [
  {
    id: 'day',
    title: 'Today',
  },
  {
    id: 'week',
    title: 'This week',
  },
  {
    id: 'month',
    title: 'Month',
  },
  {
    id: 'year',
    title: 'Year',
  },
]

export default function Header() {
  const [isActivate, setIsActivate] = useState(false)
  const [selectedFilter, setFilter] = useState('Today')
  const $divEl = useRef<HTMLDivElement>(null)

  const toggleMenu = () => setIsActivate(prev => !prev)

  const selectFilter = (e: React.MouseEvent<HTMLElement>) => {
    const name = (e.target as HTMLLIElement).dataset.name!
    setFilter(name)
    setIsActivate(false)
  }

  useEventListener([
    {
      name: 'click',
      callback: (e: MouseEvent) => {
        if ($divEl.current?.contains(e.target as HTMLElement)) {
          return
        }

        setIsActivate(false)
      },
    },
  ])

  return (
    <StyledHeader>
      <div ref={$divEl}>
        <Button title={selectedFilter} onClick={toggleMenu} color="default" />
        {isActivate && (
          <ul onClick={selectFilter}>
            {options.map(({ id, title }) => (
              <Li key={id} data-id={id} data-name={title} isSelected={title === selectedFilter}>
                {title}
              </Li>
            ))}
          </ul>
        )}
      </div>
    </StyledHeader>
  )
}
