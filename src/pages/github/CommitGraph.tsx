import React from 'react'
import { useRecoilValue } from 'recoil'

import Chart from '../../components/Chart'

import { commitDataSelector } from '../../recoil/github'
import type { GithubReport } from '../../recoil/github'

interface Props {
  data: GithubReport[]
}

export default function CommitGraph({ data }: Props) {
  const commitData = useRecoilValue(commitDataSelector(data))

  const chartOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
          stacked: true,
        },
      ],
      xAxes: [
        {
          stacked: true,
        },
      ],
    },
  }

  return <Chart chartId="commitChart" chartType="bar" data={{ ...commitData }} chartOptions={chartOptions} />
}
