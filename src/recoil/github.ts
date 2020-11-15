import { selector } from 'recoil'
import { isNil, groupBy, toPairs, sum, head, last } from 'ramda'
import dayjs from 'dayjs'
import { schemePastel1 as colors } from 'd3-scale-chromatic'
import gql from 'graphql-tag'

import { dateRangeSelector } from './date'
import { normalize } from './githubHelpers'
import { graphqlRequest } from '../utils/api'

import type { GithubReportQuery } from '../generated/graphql'
import type { InnerRecoilDataType, Oneof, Property } from '../utils/typeHelper'

export type NormalizedGithubData = Oneof<InnerRecoilDataType<typeof githubSelector>>
export type GithubData = Property<Oneof<NormalizedGithubData>, 'data'>

const pageInfoFragment = gql`
  fragment pageInfo on PageInfo {
    hasNextPage
    endCursor
  }
`

const commitItemFragment = gql`
  fragment commitItem on Commit {
    author {
      email
    }
    committedDate
    message
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
    commits(first: 30) {
      nodes {
        commit {
          ...commitItem
        }
      }
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
  ${commitItemFragment}
  ${pullRequestFragment}
`

export const githubSelector = selector({
  key: 'GithubSelector',
  get: async ({ get }) => {
    const { startAt, endAt } = get(dateRangeSelector)

    const { search } = await graphqlRequest<GithubReportQuery>({
      query: QUERY,
      variables: {
        query: getSearchQuery(startAt, endAt),
      },
    })

    console.log(normalize(search, startAt, endAt))

    return normalize(search, startAt, endAt)
  },
})

export const commitDataSelector = selector({
  key: 'CommitData',
  get: ({ get }) => {
    const nodes = get(githubSelector)
    const pullRequests = nodes.flatMap(node =>
      node.data
        ? node.data.map(githubData => ({
            ...githubData,
          }))
        : []
    )

    const groupByRepository = groupBy(pullRequest => pullRequest.repository.name, pullRequests)

    const dates = nodes.map(node => node.date)

    const datasets = Object.keys(groupByRepository).map((repositoryName, i) => {
      const data = new Array(dates.length).fill(0)
      groupByRepository[repositoryName].forEach(pr => {
        pr.commits?.forEach(node => {
          const index = dates.findIndex(date => date === dayjs(node?.commit.committedDate).format('YYYY-MM-DD'))
          data[index] = data[index] + 1
        })
      })

      return {
        label: repositoryName,
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

export const contributionDataSelector = selector({
  key: 'ContributionData',
  get: ({ get }) => {
    const nodes = get(githubSelector)
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

export const topOfContributionProjectSelector = selector({
  key: 'TopOfContributionProject',
  get: ({ get }) => {
    const nodes = get(githubSelector)
    const commitsCountByRepository = new Map<string, number>()

    nodes
      .flatMap(node => (isNil(node.data) ? [] : toPairs(groupBy(githubData => githubData.repository.name, node.data))))
      .forEach(([repositoryName, commitHistory]) => {
        const commitsCount = sum(commitHistory.map(history => history.commits?.length ?? 0))
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
