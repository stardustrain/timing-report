import React, { useState, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { find, propEq } from 'ramda'

import useEventListener from '../hooks/useEventListener'
import { dateFilter, dateRangeSelector, DateFilterType } from '../recoil/date'

import Button from './Button'
import QuickDateFilter from './QuickDateFilter'
import CustomDateSelector from './CustomDateSelector'

import styled, { bp } from '../styles/styled'

const Div = styled.div`
  position: relative;
  display: inline-block;

  button {
    min-width: 12rem;
  }

  ul {
    font-size: 1.6rem;
    text-align: center;
  }
`

const FilterOptionPanel = styled.div`
  display: flex;
  position: absolute;
  margin-top: 0.5rem;
  border-radius: 4px;
  background-color: #424242;

  ul {
    width: 12rem;
    flex: 1 12rem;
  }

  ${bp.mq[bp.BreakPoint.MEDIUM]} {
    left: 0;
  }
`

const Li = styled.li`
  position: relative;
  padding: 1rem 0;
  color: white;
  cursor: pointer;
  border-top: 1px solid white;

  :hover {
    background-color: rgba(255, 255, 255, 0.4);
  }

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-left: 4px solid white;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
  }
`

const options = [
  {
    id: DateFilterType.TODAY,
    title: 'Today',
  },
  {
    id: DateFilterType.WEEK,
    title: 'This week',
  },
  {
    id: DateFilterType.MONTH,
    title: 'Month',
  },
  {
    id: DateFilterType.YEAR,
    title: 'Year',
  },
  {
    id: DateFilterType.CUSTOM,
    title: 'Custom',
  },
] as const

const getSelectedFilterTitle = (dateFilterOption: DateFilterType) =>
  find(propEq('id', dateFilterOption), options)?.title ?? ''

export default function DateFilter() {
  const [dateFilterOption] = useRecoilState(dateFilter)
  const { startAt, endAt } = useRecoilValue(dateRangeSelector)
  const [buttonTitle, setButtonTitle] = useState(getSelectedFilterTitle(dateFilterOption.filterType))
  const [isActivate, setIsActivate] = useState(true)
  const $divEl = useRef<HTMLDivElement>(null)

  const toggleMenu = () => setIsActivate(prev => !prev)

  const onSelect = (id: DateFilterType) => {
    setButtonTitle(getSelectedFilterTitle(id))
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
    <Div ref={$divEl}>
      <Button title={buttonTitle} onClick={toggleMenu} color="default" />
      {isActivate && (
        <FilterOptionPanel>
          <ul>
            <QuickDateFilter onSelect={onSelect} />
            <Li>Set custom </Li>
          </ul>
          <CustomDateSelector
            dateRange={dateFilterOption.filterType === DateFilterType.TODAY ? startAt : `${startAt} ~ ${endAt}`}
          />
        </FilterOptionPanel>
      )}
    </Div>
  )
}
