import React from 'react'
import { useRecoilValue } from 'recoil'
import { cond, any, equals, always, T, pipe, converge, concat, head, tail, toUpper } from 'ramda'

import { dateSelector } from '../../recoil/date'
import { getDateRange } from '../../utils/date'

import styled from '../../styles/styled'
import type { GithubReport } from '../../recoil/github'

const Section = styled.section`
  h2 {
    text-align: left;
  }
`

const Div = styled.div`
  display: flex;
  justify-content: center;

  div {
    margin-right: 0.5rem;
    flex: 1 1 0;
    text-align: left;
    font-size: 1.6rem;

    &:last-of-type {
      margin-right: 0;
    }

    & > div:first-of-type {
      font-size: 1.4rem;
      margin-bottom: 0.5rem;
      color: rgba(0, 0, 0, 0.45);
    }
  }
`

interface Props {
  data: GithubReport[]
}

const getSummary = (reports: GithubReport[]) =>
  reports
    .flatMap(report => report.data ?? [])
    .reduce(
      (acc, data) => {
        ['additions', 'deletions', 'commits'].forEach(key => {
          acc[key] += data[key]
        })

        return acc
      },
      {
        commits: 0,
        additions: 0,
        deletions: 0,
      }
    )

const getCommitsPerDay = cond<number, number>([
  [(...a) => any(equals(0), a), always(0)],
  [T, (commits, range) => commits / range],
])

const toUpperFirst = converge(concat, [pipe(head, toUpper), tail])

export default function Summary({ data }: Props) {
  const { startAt, endAt } = useRecoilValue(dateSelector)
  const summary = getSummary(data)

  const commitsPerDay = getCommitsPerDay(summary.commits, getDateRange(startAt, endAt))

  return (
    <Section>
      <h2>Summary</h2>
      <Div className="Summary">
        {Object.keys(summary).map(key => (
          <div key={key}>
            <div>{toUpperFirst(key)}</div>
            <div>{summary[key]}</div>
          </div>
        ))}
        <div>
          <div>Commits/d</div>
          <div>{commitsPerDay.toFixed(2)}</div>
        </div>
        <div>
          <div>Score</div>
          {/* TODO: Implement after decide to scoring standard */}
          <div>{} points</div>
        </div>
      </Div>
    </Section>
  )
}
