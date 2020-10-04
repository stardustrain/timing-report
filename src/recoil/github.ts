import { selectorFamily } from 'recoil'
import { isNil, groupBy, toPairs, sum, head, last } from 'ramda'
import dayjs from 'dayjs'
import { schemePastel1 as colors } from 'd3-scale-chromatic'
import gql from 'graphql-tag'

import { graphqlRequest } from '../utils/api'

import type { GithubReportQuery, ResultNodeFragment, PullRequestFragment } from '../generated/graphql'

type Repository = {
  name: string
  owner: string
}

export type GithubData = {
  date: string
  additions: number
  author: string
  closed: boolean
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

const pageInfoFragment = gql`
  fragment pageInfo on PageInfo {
    hasNextPage
    endCursor
  }
`

const pullRequestFragment = gql`
  fragment pullRequest on PullRequest {
    createdAt
    closed
    title
    additions
    deletions
    state
    author {
      login
    }
    commits {
      totalCount
    }
    repository {
      name
      owner {
        login
      }
    }
  }
`

const resultNodeFragment = gql`
  fragment resultNode on SearchResultItem {
    __typename
    ... on PullRequest {
      ...pullRequest
    }
  }
`

const getSearchQuery = (startAt: string, endAt: string) => `author:stardustrain created:${startAt}..${endAt}`

const QUERY = gql`
  query GithubReport($query: String!) {
    search(query: $query, type: ISSUE, first: 100) {
      pageInfo {
        ...pageInfo
      }
      issueCount
      edges {
        cursor
        node {
          ...resultNode
        }
      }
    }
  }
  ${pageInfoFragment}
  ${resultNodeFragment}
  ${pullRequestFragment}
`

type ResultNodePullRequestFragment = { __typename: 'PullRequest' } & PullRequestFragment

const isPullrequestNode = (node?: ResultNodeFragment | null): node is ResultNodePullRequestFragment =>
  !!(node?.__typename && node.__typename === 'PullRequest')

export const githubSelector = selectorFamily({
  key: 'GithubSelector',
  get: ({ startAt, endAt }: { startAt: string; endAt: string }) => async () => {
    const { search } = await graphqlRequest<GithubReportQuery>({
      query: QUERY,
      variables: {
        query: getSearchQuery(startAt, endAt),
      },
    })

    if (isNil(search?.edges)) {
      return []
    }

    const dateRange = dayjs(endAt).diff(startAt, 'd') + 1
    const dates = new Array(dateRange).fill(null).map((_, index) => dayjs(startAt).add(index, 'd').format('YYYY-MM-DD'))

    const pullRequests = search.edges.flatMap(edge => (isPullrequestNode(edge?.node) && edge?.node ? [edge.node] : []))
    const groupByDate = groupBy(node => dayjs(node.createdAt).format('YYYY-MM-DD'), pullRequests)

    return dates.map(date => ({
      date,
      data: isNil(groupByDate[date])
        ? null
        : groupByDate[date].map(pullRequest => ({
            date: dayjs(pullRequest.createdAt).format('YYYY-MM-DD'),
            additions: pullRequest.additions,
            author: pullRequest.author?.login ?? '',
            closed: pullRequest.closed,
            commits: pullRequest.commits.totalCount,
            createdAt: dayjs(pullRequest.createdAt).format('YYYY-MM-DD'),
            deletions: pullRequest.deletions,
            repository: {
              name: pullRequest.repository.name,
              owner: pullRequest.repository.owner.login,
            },
            state: pullRequest.state,
            title: pullRequest.title,
          })),
    }))
  },
})

export const commitDataSelector = selectorFamily({
  key: 'CommitData',
  get: (nodes: GithubReport[]) => () => {
    const flattendData = nodes.flatMap(node =>
      node.data
        ? node.data.map(githubData => ({
            ...githubData,
          }))
        : []
    )

    const groupByRepository = groupBy(data => data.repository.name, flattendData)

    const dates = nodes.map(node => node.date)

    const datasets = Object.keys(groupByRepository).map((key, i) => {
      const data = new Array(dates.length).fill(0)

      groupByRepository[key].forEach(pr => {
        const index = dates.findIndex(date => date === pr.date)
        data[index] = data[index] + pr.commits
      })

      return {
        label: key,
        data,
        backgroundColor: colors[i],
      }
    })

    console.log(datasets)

    return {
      xAxis: dates.map(date => dayjs(date).format('YY-MM-DD ddd')),
      datasets,
    }
  },
})

export const contributionDataSelector = selectorFamily({
  key: 'ContributionData',
  get: (nodes: GithubReport[]) => () => {
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

const getCommitsCount = (commitHistory: GithubData[]) => sum(commitHistory.map(history => history.commits))

export const topOfContributionProjectSelector = selectorFamily({
  key: 'TopOfContributionProject',
  get: (nodes: GithubReport[]) => () => {
    const commitsCountByRepository = new Map<string, number>()

    nodes
      .flatMap(node => (isNil(node.data) ? [] : toPairs(groupBy(githubData => githubData.repository.name, node.data))))
      .forEach(([repositoryName, commitHistory]) => {
        const commitsCount = getCommitsCount(commitHistory)
        commitsCountByRepository.set(repositoryName, (commitsCountByRepository.get(repositoryName) ?? 0) + commitsCount)
      })

    const sortedCommitsCount = Array.from(commitsCountByRepository.entries()).sort(
      ([, aCount], [, bCount]) => bCount - aCount
    )
    const data = sortedCommitsCount.map<number>(last)

    return {
      xAxis: sortedCommitsCount.map<string>(head),
      datasets: [
        {
          data,
          backgroundColor: data.map((_, index) => colors[index]),
        },
      ],
    }
  },
})
