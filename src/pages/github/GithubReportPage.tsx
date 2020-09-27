import React, { Suspense } from 'react'
import { useRecoilValue } from 'recoil'
import { Skeleton } from 'antd'

import { dateSelector, dateFilter, DateFilter } from '../../recoil/date'

import GithubReportGraph from './GithubReportGraph'

import styled from '../../styles/styled'

const H1 = styled.h1<{ isNotShowingDateRange: boolean }>`
  margin-bottom: ${({ isNotShowingDateRange }) => (isNotShowingDateRange ? '2rem' : '0.5rem')};
`

const P = styled.p`
  font-size: 1.5rem;
`

export default function GithubReportPage() {
  const selectedDateFilter = useRecoilValue(dateFilter)
  const { startAt, endAt } = useRecoilValue(dateSelector)

  const isNotShowingDateRange = selectedDateFilter === DateFilter.TODAY

  return (
    <div className="GithubReportPage">
      <H1 isNotShowingDateRange={isNotShowingDateRange}>Github report for {selectedDateFilter.toLowerCase()}</H1>
      {isNotShowingDateRange ? null : (
        <P>
          {startAt} ~ {endAt}
        </P>
      )}
      <Suspense fallback={<Skeleton />}>
        <GithubReportGraph />
      </Suspense>
    </div>
  )
}
