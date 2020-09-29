import React, { useState, useRef } from 'react'
import { useRecoilState } from 'recoil'
import { find, propEq } from 'ramda'

import useEventListener from '../hooks/useEventListener'
import { dateFilter, DateFilter } from '../recoil/date'

import Button from './Button'

import styled, { bp } from '../styles/styled'

const StyledHeader = styled.header`
  padding: 1.2rem 0 1.2rem 15rem;
  background-color: rgba(0, 0, 0, 0.12);
  width: 100%;
  border-bottom: 1px solid #bdbdbd;

  ${bp.mq[bp.BreakPoint.MEDIUM]} {
    padding-left: 0;
  }

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
    id: DateFilter.TODAY,
    title: 'Today',
  },
  {
    id: DateFilter.WEEK,
    title: 'This week',
  },
  {
    id: DateFilter.MONTH,
    title: 'Month',
  },
  {
    id: DateFilter.YEAR,
    title: 'Year',
  },
] as const

const getSelectedFilterTitle = (dateFilterOption: DateFilter) =>
  find(propEq('id', dateFilterOption), options)?.title ?? ''

export default function Header() {
  const [dateFilterOption, setDateFilter] = useRecoilState(dateFilter)
  const [buttonTitle, setButtonTitle] = useState(getSelectedFilterTitle(dateFilterOption))
  const [isActivate, setIsActivate] = useState(false)
  const $divEl = useRef<HTMLDivElement>(null)

  const toggleMenu = () => setIsActivate(prev => !prev)

  const selectFilter = (e: React.MouseEvent<HTMLElement>) => {
    const { id } = (e.target as HTMLLIElement).dataset
    if (!id) {
      return
    }
    setDateFilter(id as DateFilter)
    setButtonTitle(getSelectedFilterTitle(id as DateFilter))
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
        <Button title={buttonTitle} onClick={toggleMenu} color="default" />
        {isActivate && (
          <ul onClick={selectFilter}>
            {options.map(({ id, title }) => (
              <Li key={id} data-id={id} data-name={title} isSelected={title === buttonTitle}>
                {title}
              </Li>
            ))}
          </ul>
        )}
      </div>
    </StyledHeader>
  )
}
