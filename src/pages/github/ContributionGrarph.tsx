import React from 'react'
import { useRecoilValue } from 'recoil'

import Chart from '../../components/Chart'

import { contributionDataSelector } from '../../recoil/github'
import type { GithubReport } from '../../recoil/github'

interface Props {
  data: GithubReport[]
}

export default function ContributionGrarph({ data }: Props) {
  const contributionData = useRecoilValue(contributionDataSelector(data))

  const chartOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }

  return (
    <Chart chartId="contributionChart" chartType="line" data={{ ...contributionData }} chartOptions={chartOptions} />
  )
}
