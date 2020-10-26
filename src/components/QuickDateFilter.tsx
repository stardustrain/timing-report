import React from 'react'
import { useRecoilState } from 'recoil'

import { dateFilter, DateFilterType } from '../recoil/date'

import styled from '../styles/styled'

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
] as const

interface Props {
  onSelect: (id: DateFilterType) => void
}

export default function QuickDateFilter({ onSelect }: Props) {
  const [dateFilterOption, setDateFilter] = useRecoilState(dateFilter)

  const selectFilter = (id: Exclude<DateFilterType, DateFilterType.CUSTOM>) => {
    if (!id) {
      return
    }
    setDateFilter({
      filterType: id,
    })
    onSelect(id)
  }

  return (
    <>
      {options.map(({ id, title }) => (
        <Li
          key={id}
          data-id={id}
          data-name={title}
          isSelected={dateFilterOption.filterType === id}
          onClick={() => {
            selectFilter(id)
          }}
        >
          {title}
        </Li>
      ))}
    </>
  )
}
