import React, { useState, Dispatch, SetStateAction } from 'react'
import { useRecoilState } from 'recoil'

import { dateFilter, DateFilterType } from '../recoil/date'

import Button from './Button'

import styled from '../styles/styled'

const Div = styled.div`
  flex: 1;
  padding: 1rem;
  border-left: 1px solid white;
  font-size: 1.2rem;
  color: white;
`

const Form = styled.form`
  color: white;
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
`

const Input = styled.input`
  margin-bottom: 0.5rem;
  color: black;
`

const ApplyButton = styled(Button)`
  font-size: 1.2rem;
  color: black;
`

const Separator = styled.div`
  position: relative;
  font-size: 1.2rem;
  color: white;
  margin-bottom: 0.5rem;

  &::before {
    content: '';
    position: absolute;
    width: 15%;
    height: 1px;
    border-top: 1px solid white;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }

  &::after {
    content: '';
    position: absolute;
    width: 15%;
    height: 1px;
    border-top: 1px solid white;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
`

interface Props {
  dateRange: string
  onSetActivePanel: Dispatch<SetStateAction<boolean>>
}

export default function CustomDateSelector({ dateRange, onSetActivePanel }: Props) {
  const [, setDateRange] = useRecoilState(dateFilter)
  const [startAt, setStartAt] = useState<string | null>(null)
  const [endAt, setEndAt] = useState<string | null>(null)

  return (
    <Div>
      <Form>
        <fieldset>
          <legend>Select date range</legend>
          <label htmlFor="from">from:</label>
          <Input
            id="from"
            type="date"
            placeholder="YYYY-MM-DD"
            onChange={e => {
              setStartAt(e.target.value)
            }}
          />
          <label htmlFor="to">to:</label>
          <Input
            id="to"
            type="date"
            placeholder="YYYY-MM-DD"
            onChange={e => {
              setEndAt(e.target.value)
            }}
          />
        </fieldset>
        <ApplyButton
          type="submit"
          title="Apply"
          onClick={e => {
            e.preventDefault()
            if (startAt && endAt) {
              setDateRange({
                filterType: DateFilterType.CUSTOM,
                range: {
                  startAt,
                  endAt,
                },
              })
              onSetActivePanel(false)
            }
          }}
          color="primary"
        />
      </Form>
      <Separator>current date range</Separator>
      {dateRange}
    </Div>
  )
}
