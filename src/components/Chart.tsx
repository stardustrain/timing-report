import React, { useRef, useEffect } from 'react'
import type { ChartOptions, ChartType } from 'chart.js'
import { clone } from 'ramda'

import { initializeChart, updateChart } from '../utils/chart'

interface Props<T> {
  chartId: string
  chartType: ChartType
  data: {
    xAxis: string[]
    datasets: T[]
  }
  chartOptions: ChartOptions
}

export default function Chart<T>({ chartId, chartType, data, chartOptions }: Props<T>) {
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (chartRef.current === null) {
      chartRef.current = initializeChart(chartId, chartType, chartOptions)
    }

    if (data.datasets?.length === 0) {
      return
    }

    const clonedCommitData = clone(data)

    updateChart({
      chart: chartRef.current,
      labels: clonedCommitData.xAxis,
      data: clonedCommitData.datasets,
      isUpdateLabels: true,
    })

    // eslint-disable-next-line
  }, [data])

  return <canvas id={chartId} style={{ display: data.datasets?.length === 0 ? 'none' : 'block' }} />
}
