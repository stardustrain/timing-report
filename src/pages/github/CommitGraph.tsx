import React, { useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { clone } from 'ramda'
import Chart from 'chart.js'

import { initializeChart, updateChart } from '../../utils/chart'

import { commitDataSelector } from '../../recoil/github'
import type { GithubReport } from '../../recoil/github'

interface Props {
  data: GithubReport[]
}

export default function CommitGraph({ data }: Props) {
  const barChart = useRef<Chart | null>(null)
  const commitData = useRecoilValue(commitDataSelector(data))

  useEffect(() => {
    if (barChart.current === null) {
      barChart.current = initializeChart('barChart', 'bar', {
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
      })
    }

    if (commitData.datasets.length === 0) {
      return
    }

    const clonedCommitData = clone(commitData)

    updateChart({
      chart: barChart.current,
      labels: clonedCommitData.xAxis,
      data: clonedCommitData.datasets,
      isUpdateLabels: true,
    })

    // eslint-disable-next-line
  }, [commitData])

  return <canvas id="barChart" style={{ display: commitData.datasets.length === 0 ? 'none' : 'block' }} />
}
