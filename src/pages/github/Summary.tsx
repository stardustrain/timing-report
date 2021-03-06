import React from 'react'
import { useRecoilValue } from 'recoil'
import { cond, any, equals, always, T, pipe, converge, concat, head, tail, toUpper } from 'ramda'
import Chart from '../../components/Chart'

import { dateRangeSelector } from '../../recoil/date'
import { getDateRange } from '../../utils/date'
import { topOfContributionProjectSelector } from '../../recoil/github'

import styled, { bp } from '../../styles/styled'
import type { NormalizedGithubData } from '../../recoil/github'

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

const getSummary = (reports: NormalizedGithubData[]) =>
  reports
    .flatMap(report => report.data ?? [])
    .reduce(
      (acc, data) => {
        ;['additions', 'deletions'].forEach(key => {
          acc[key] += data[key]
        })
        acc.commits += data.commits?.length ?? 0

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

interface Props {
  data: NormalizedGithubData[]
}

export default function Summary({ data }: Props) {
  const { startAt, endAt } = useRecoilValue(dateRangeSelector)
  const topOfContribution = useRecoilValue(topOfContributionProjectSelector)
  const summary = getSummary(data)

  const commitsPerDay = getCommitsPerDay(summary.commits, getDateRange(startAt, endAt))

  const chartOptions = {
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
  }

  return (
    <Section>
      <h2>Summary</h2>
      <div>
        <ChartContainer>
          <div>Top of contribution</div>
          <Chart
            chartId="topOfContributionChart"
            chartType="horizontalBar"
            data={{ ...topOfContribution }}
            chartOptions={chartOptions}
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
