import { isNil, groupBy } from 'ramda'
import dayjs from 'dayjs'

import { githubDateFormat } from '../utils/date'

import type { Property } from '../utils/typeHelper'

import type { GithubReportQuery, PullRequestFragment, ResultNodeFragment, Maybe } from '../generated/graphql'

type SearchResult = Property<GithubReportQuery, 'search'>
type ResultNodePullRequestFragment = { __typename: 'PullRequest' } & PullRequestFragment

const isPullrequestNode = (node?: ResultNodeFragment | null): node is ResultNodePullRequestFragment =>
  !!(node?.__typename && node.__typename === 'PullRequest')
export const isValidPullrequestNode = (node?: Maybe<ResultNodeFragment>) => {
  if (isNil(node)) {
    return []
  }

  return isPullrequestNode(node) ? [node] : []
}

export const getFormattedDatesByDateRange = (startAt: string, endAt: string) => {
  const dateRange = dayjs(endAt).diff(startAt, 'd') + 1
  const result = []

  for (let i = 0; i < dateRange; i++) {
    result[i] = dayjs(startAt).add(i, 'd').format('YYYY-MM-DD')
  }

  return result
}

export const normalize = (searchResult: SearchResult, startAt: string, endAt: string) => {
  if (isNil(searchResult.edges)) {
    return []
  }

  const dates = getFormattedDatesByDateRange(startAt, endAt)

  const pullRequests = searchResult.edges.flatMap(edge => isValidPullrequestNode(edge?.node))
  const groupByDate = groupBy(node => githubDateFormat(node.createdAt), pullRequests)

  return dates.map(date => ({
    date,
    data: isNil(groupByDate[date])
      ? null
      : groupByDate[date].map(pullRequest => ({
          additions: pullRequest.additions,
          author: pullRequest.author?.login ?? '',
          closed: pullRequest.closed,
          commits: pullRequest.commits.nodes?.filter(node => node?.commit.author?.email === 'kthanterran@gmail.com'),
          createdAt: githubDateFormat(pullRequest.createdAt),
          deletions: pullRequest.deletions,
          repository: {
            name: pullRequest.repository.name,
            owner: pullRequest.repository.owner.login,
          },
          state: pullRequest.state,
          title: pullRequest.title,
        })),
  }))
}
