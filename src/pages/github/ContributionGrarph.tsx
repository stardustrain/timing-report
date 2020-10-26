import React from 'react'
import { useRecoilValue } from 'recoil'

import Chart from '../../components/Chart'

import { contributionDataSelector } from '../../recoil/github'

export default function ContributionGrarph() {
  const contributionData = useRecoilValue(contributionDataSelector)

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
