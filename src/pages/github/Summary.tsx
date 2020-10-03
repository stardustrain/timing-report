import React, { useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { cond, any, equals, always, T, pipe, converge, concat, head, tail, toUpper, clone } from 'ramda'
import Chart from 'chart.js'

import { dateSelector } from '../../recoil/date'
import { getDateRange } from '../../utils/date'
import { topOfContributionProjectSelector } from '../../recoil/github'
import { initializeChart, updateChart } from '../../utils/chart'

import styled, { bp } from '../../styles/styled'
import type { GithubReport } from '../../recoil/github'

const Section = styled.section`
  & > div {
    display: flex;
    justify-content: space-around;
    align-items: center;

    ${bp.mq[bp.BreakPoint.MEDIUM]} {
      display: block;
    }
  }
`

const FactorContainer = styled.div`
  display: inline-block;
  width: calc(70% - 1.5rem);

  ${bp.mq[bp.BreakPoint.MEDIUM]} {
    display: block;
    width: 100%;
  }
`

const Factors = styled.div`
  display: flex;
  justify-content: center;

  div {
    margin-right: 0.5rem;
    flex: 1 1 0;
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

const ChartContainer = styled.div`
  display: inline-block;
  width: 30%;
  vertical-align: middle;
  margin-right: 1.5rem;
  font-size: 1.4rem;
  color: rgba(0, 0, 0, 0.45);

  ${bp.mq[bp.BreakPoint.MEDIUM]} {
    display: block;
    width: 100%;
    text-align: left;
    margin-bottom: 1.5rem;

    canvas {
      display: none !important;
    }
  }
`

const ContributionText = styled.div`
  display: none;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.fbFont};
  margin-top: 0.5rem;

  ${bp.mq[bp.BreakPoint.MEDIUM]} {
    display: block;
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
  const barChart = useRef<Chart | null>(null)
  const { startAt, endAt } = useRecoilValue(dateSelector)
  const topOfContribution = useRecoilValue(topOfContributionProjectSelector(data))
  const summary = getSummary(data)

  const commitsPerDay = getCommitsPerDay(summary.commits, getDateRange(startAt, endAt))

  useEffect(() => {
    if (barChart.current === null) {
      barChart.current = initializeChart('contributionChart', 'horizontalBar', {
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
          xAxes: [
            {
              display: false,
            },
          ],
        },
      })
    }

    if (topOfContribution.datasets.length === 0) {
      return
    }

    const clonedTopOfContributionData = clone(topOfContribution)

    updateChart({
      chart: barChart.current,
      labels: clonedTopOfContributionData.xAxis,
      data: clonedTopOfContributionData.datasets,
      isUpdateLabels: true,
    })
    // eslint-disable-next-line
  }, [topOfContribution])

  return (
    <Section>
      <h2>Summary</h2>
      <div>
        <ChartContainer>
          <div>Top of contribution</div>
          <canvas
            id="contributionChart"
            style={{ display: topOfContribution.datasets.length === 0 ? 'none' : 'block' }}
          />
          <ContributionText>
            {head(topOfContribution.xAxis)}
            {' => '}
            {head(head(topOfContribution.datasets)?.data ?? [])} commits
          </ContributionText>
        </ChartContainer>
        <FactorContainer className="Summary">
          <Factors>
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
          </Factors>
        </FactorContainer>
      </div>
    </Section>
  )
}
