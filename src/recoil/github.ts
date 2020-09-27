import { selectorFamily } from 'recoil'
import { isNil, groupBy, flatten } from 'ramda'
import dayjs from 'dayjs'
import { schemePastel1 } from 'd3-scale-chromatic'

import { getData } from '../utils/api'

type Repository = {
  name: string
  owner: string
}

export type GithubData = {
  additions: number
  author: string
  closed: true
  commits: number
  createdAt: string
  deletions: number
  repository: Repository
  state: string
  title: string
}

export type GithubReport = {
  date: string
  data: GithubData[] | null
}

export const githubSelector = selectorFamily({
  key: 'GithubSelector',
  get: ({ startAt, endAt }: { startAt: string; endAt: string }) => async () => {
    const nodes = (await getData({
      collection: 'github',
      startAt,
      endAt,
    })) as GithubReport[]

    return nodes
  },
})

export const commitDataSelector = selectorFamily({
  key: 'CommitData',
  get: (nodes: GithubReport[]) => () => {
    const colors = schemePastel1
    const validData = flatten(
      nodes
        .filter(node => !isNil(node.data))
        .map(({ date, data }) =>
          data!.map(githubData => ({
            date,
            githubData,
          }))
        )
    )

    const groupByRepository = groupBy(data => data.githubData.repository.name, validData)

    const dates = nodes.map(node => node.date)

    const datasets = Object.keys(groupByRepository).map((key, i) => {
      const data = new Array(dates.length).fill(0)

      groupByRepository[key].forEach(pr => {
        const index = dates.findIndex(date => date === pr.date)
        data[index] = data[index] + pr.githubData.commits
      })

      return {
        label: key,
        data,
        backgroundColor: colors[i],
      }
    })

    return {
      xAxis: dates.map(date => dayjs(date).format('YY-MM-DD ddd')),
      datasets,
    }
  },
})

export const contributionDataSelector = selectorFamily({
  key: 'ContributionData',
  get: (nodes: GithubReport[]) => () => {
    const colors = schemePastel1
    const dates = nodes.map(node => dayjs(node.date).format('YY-MM-DD ddd'))
    const contributionDataByDate = nodes.map(node => {
      if (!node.data) {
        return {
          additions: 0,
          deletions: 0,
        }
      }

      return node.data.reduce(
        (acc, githubData) => {
          acc.additions += githubData.additions
          acc.deletions += githubData.deletions

          return acc
        },
        {
          additions: 0,
          deletions: 0,
        }
      )
    })

    const datasets = [
      {
        label: 'total',
        data: contributionDataByDate.map(({ additions, deletions }) => additions + deletions),
        borderColor: colors[2],
        backgroundColor: colors[2],
      },
      {
        label: 'additions',
        data: contributionDataByDate.map(data => data.additions),
        borderColor: colors[0],
        fill: false,
      },
      {
        label: 'deletions',
        data: contributionDataByDate.map(data => data.deletions),
        borderColor: colors[1],
        fill: false,
      },
    ]

    return {
      xAxis: dates,
      datasets,
    }
  },
})
