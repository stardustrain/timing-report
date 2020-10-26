import React from 'react'

import DateFilter from './DateFilter'

import styled, { bp } from '../styles/styled'

const StyledHeader = styled.header`
  padding: 1.2rem 0 1.2rem 15rem;
  background-color: rgba(0, 0, 0, 0.12);
  width: 100%;
  border-bottom: 1px solid #bdbdbd;

  ${bp.mq[bp.BreakPoint.MEDIUM]} {
    padding-left: 0;
  }
`

export default function Header() {
  return (
    <StyledHeader>
      <DateFilter />
    </StyledHeader>
  )
}
