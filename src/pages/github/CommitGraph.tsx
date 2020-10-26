import React from 'react'
import { useRecoilValue } from 'recoil'

import Chart from '../../components/Chart'

import { commitDataSelector } from '../../recoil/github'

export default function CommitGraph() {
  const commitData = useRecoilValue(commitDataSelector)

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
