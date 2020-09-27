import Chart from 'chart.js'

export const addChartData = ({ chart, data, labels }: Omit<UpdateChartDataParams, 'isUpdateLabels'>) => {
  if (labels) {
    chart.data.labels = labels
  }

  chart.data.datasets = data
  chart.update()
}

export const removeChartData = ({ chart, isUpdateLabels }: Pick<UpdateChartDataParams, 'chart' | 'isUpdateLabels'>) => {
  if (isUpdateLabels) {
    chart.data.labels = []
  }

  chart.data.datasets = []
  chart.update()
}

interface UpdateChartDataParams {
  chart: Chart
  data: any[]
  labels?: (string | number)[]
  isUpdateLabels: boolean
}

export const updateChart = ({ chart, data, labels, isUpdateLabels }: UpdateChartDataParams) => {
  removeChartData({
    chart,
    isUpdateLabels,
  })
  addChartData({ chart, data, labels })
}

export const initializeChart = (
  canvasIdSelector: string,
  type: Chart.ChartConfiguration['type'],
  options?: Chart.ChartConfiguration['options']
) =>
  new Chart(canvasIdSelector, {
    type,
    options,
  })
