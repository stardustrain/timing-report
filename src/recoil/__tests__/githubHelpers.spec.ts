import { normalize, isValidPullrequestNode, getFormattedDatesByDateRange } from '../githubHelpers'

import fixture from './fixtures/githubFixture.json'

describe('githubHelpers.ts', () => {
  describe('isValidPullrequestNode(node?: Maybe<ResultNodeFragment>): ResultNodePullRequestFragment[]', () => {
    test('should return array includes Pullrequest type node if node is not nullish and node type is PullRequest.', () => {
      expect(isValidPullrequestNode({ __typename: 'PullRequest', nodes: [] })).toEqual([
        {
          __typename: 'PullRequest',
          nodes: [],
        },
      ])
    })

    test('should return empty array if node is nullish and node type is not PullRequest.', () => {
      expect(isValidPullrequestNode()).toEqual([])
      expect(isValidPullrequestNode({ __typename: 'Issue' })).toEqual([])
    })
  })

  describe('getFormattedDatesByDateRange(startAt: string, endAt: string): string[]', () => {
    test('should return array include formatted date to YYYY-MM-DD by received date range.', () => {
      expect(getFormattedDatesByDateRange('2020-11-11', '2020-11-12')).toEqual(['2020-11-11', '2020-11-12'])
      expect(getFormattedDatesByDateRange('2020-11-07', '2020-11-12')).toEqual([
        '2020-11-07',
        '2020-11-08',
        '2020-11-09',
        '2020-11-10',
        '2020-11-11',
        '2020-11-12',
      ])
    })
  })

  describe('normalize(searchResult: SearchResult): NormalizedGithubData[]', () => {
    test('should empty array if search > edges is nullish.', () => {
      expect(
        // @ts-expect-error
        normalize({
          pageInfo: {
            hasNextPage: false,
            endCursor: null,
          },
          issueCount: 0,
          edges: null,
        })
      ).toEqual([])

      expect(
        // @ts-expect-error
        normalize({
          pageInfo: {
            hasNextPage: false,
            endCursor: null,
          },
          issueCount: 0,
        })
      ).toEqual([])
    })

    test('should return normalized github data if search > edges is not nullish.', () => {
      // @ts-ignore
      expect(normalize(fixture.data.search, '2020-09-20', '2020-09-30')).toEqual([
        {
          date: '2020-09-20',
          data: null,
        },
        {
          date: '2020-09-21',
          data: [
            {
              additions: 4,
              author: 'stardustrain',
              closed: true,
              commits: [
                {
                  commit: {
                    author: {
                      name: 'stardustrain',
                      email: 'kthanterran@gmail.com',
                    },
                    committedDate: '2020-09-21T11:28:11Z',
                    message: 'GQ-141 Add cors setting for *.odkmedia.dev',
                  },
                },
                {
                  commit: {
                    author: {
                      name: 'stardustrain',
                      email: 'kthanterran@gmail.com',
                    },
                    committedDate: '2020-09-22T07:23:23Z',
                    message: 'GQ-141 Fix regex pattern',
                  },
                },
              ],
              createdAt: '2020-09-21',
              deletions: 0,
              repository: {
                name: 'odc-frontend-graphql',
                owner: 'odkmedia',
              },
              state: 'MERGED',
              title: 'GQ-141 Add cors setting for *.odkmedia.dev',
            },
          ],
        },
        {
          date: '2020-09-22',
          data: [
            {
              createdAt: '2020-09-22',
              closed: true,
              title: 'GQ-69 Add curation cache',
              additions: 62,
              deletions: 19,
              state: 'MERGED',
              author: 'stardustrain',
              commits: [
                {
                  commit: {
                    author: {
                      name: 'stardustrain',
                      email: 'kthanterran@gmail.com',
                    },
                    committedDate: '2020-09-22T09:19:20Z',
                    message: 'GQ-69 Add curation cache',
                  },
                },
                {
                  commit: {
                    author: {
                      name: 'stardustrain',
                      email: 'kthanterran@gmail.com',
                    },
                    committedDate: '2020-09-22T09:19:20Z',
                    message: 'GQ-69 Remove dataloader',
                  },
                },
                {
                  commit: {
                    author: {
                      name: 'stardustrain',
                      email: 'kthanterran@gmail.com',
                    },
                    committedDate: '2020-09-23T03:10:20Z',
                    message: 'GQ-69 Fix SafeRedisCache to set cache without default expiration time',
                  },
                },
              ],
              repository: {
                name: 'odc-frontend-graphql',
                owner: 'odkmedia',
              },
            },
            {
              createdAt: '2020-09-22',
              closed: true,
              title: 'Fix release version',
              additions: 1,
              deletions: 1,
              state: 'MERGED',
              author: 'stardustrain',
              commits: [
                {
                  commit: {
                    author: {
                      name: 'stardustrain',
                      email: 'kthanterran@gmail.com',
                    },
                    committedDate: '2020-09-22T07:38:19Z',
                    message: 'Fix release version',
                  },
                },
              ],
              repository: {
                name: 'odc-frontend',
                owner: 'odkmedia',
              },
            },
          ],
        },
        {
          date: '2020-09-23',
          data: null,
        },
        {
          date: '2020-09-24',
          data: [
            {
              createdAt: '2020-09-24',
              closed: true,
              title: 'GQ-135 Add unit test setting',
              additions: 3330,
              deletions: 53,
              state: 'MERGED',
              author: 'stardustrain',
              commits: [
                {
                  commit: {
                    author: {
                      name: 'stardustrain',
                      email: 'kthanterran@gmail.com',
                    },
                    committedDate: '2020-09-24T14:40:02Z',
                    message: 'GQ-135 Add jest settings',
                  },
                },
                {
                  commit: {
                    author: {
                      name: 'stardustrain',
                      email: 'kthanterran@gmail.com',
                    },
                    committedDate: '2020-09-24T14:40:46Z',
                    message: 'GQ-135 Add test case for rest middleware and misc.ts',
                  },
                },
                {
                  commit: {
                    author: {
                      name: 'stardustrain',
                      email: 'kthanterran@gmail.com',
                    },
                    committedDate: '2020-09-25T06:15:49Z',
                    message: 'GQ-135 Fix ip check logic',
                  },
                },
                {
                  commit: {
                    author: {
                      name: 'stardustrain',
                      email: 'kthanterran@gmail.com',
                    },
                    committedDate: '2020-09-25T06:21:45Z',
                    message: 'GQ-135 Fix to split unit testing',
                  },
                },
                {
                  commit: {
                    author: {
                      name: 'stardustrain',
                      email: 'kthanterran@gmail.com',
                    },
                    committedDate: '2020-09-25T06:28:44Z',
                    message: 'GQ-135 Fix getPageNumber',
                  },
                },
              ],
              repository: {
                name: 'odc-frontend-graphql',
                owner: 'odkmedia',
              },
            },
          ],
        },
        {
          date: '2020-09-25',
          data: [
            {
              createdAt: '2020-09-25',
              closed: true,
              title: 'FE-658 Fix notification logic',
              additions: 8,
              deletions: 3,
              state: 'MERGED',
              author: 'stardustrain',
              commits: [
                {
                  commit: {
                    author: {
                      name: 'stardustrain',
                      email: 'kthanterran@gmail.com',
                    },
                    committedDate: '2020-09-25T03:53:35Z',
                    message: 'FE-658 Fix notification logic',
                  },
                },
              ],
              repository: {
                name: 'waluigi.js',
                owner: 'odkmedia',
              },
            },
          ],
        },
        {
          date: '2020-09-26',
          data: null,
        },
        {
          date: '2020-09-27',
          data: [
            {
              createdAt: '2020-09-27',
              closed: true,
              title: 'resolve #4 Add GitHub report page',
              additions: 7314,
              deletions: 3337,
              state: 'MERGED',
              author: 'stardustrain',
              commits: [
                {
                  commit: {
                    author: {
                      name: 'stardustrain',
                      email: 'kthanterran@gmail.com',
                    },
                    committedDate: '2020-03-16T02:16:25Z',
                    message: '[WIP] Add github report page',
                  },
                },
                {
                  commit: {
                    author: {
                      name: 'stardustrain',
                      email: 'kthanterran@gmail.com',
                    },
                    committedDate: '2020-07-19T05:11:25Z',
                    message: 'Fix broken codes',
                  },
                },
                {
                  commit: {
                    author: {
                      name: 'stardustrain',
                      email: 'kthanterran@gmail.com',
                    },
                    committedDate: '2020-07-29T01:25:01Z',
                    message: '[WIP] Add github report page - commit, contribution graph',
                  },
                },
                {
                  commit: {
                    author: {
                      name: 'stardustrain',
                      email: 'kthanterran@gmail.com',
                    },
                    committedDate: '2020-09-27T12:27:15Z',
                    message: 'resolve #4 Add contribution, commit graph',
                  },
                },
              ],
              repository: {
                name: 'timing-report',
                owner: 'stardustrain',
              },
            },
          ],
        },
        {
          date: '2020-09-28',
          data: null,
        },
        {
          date: '2020-09-29',
          data: [
            {
              createdAt: '2020-09-29',
              closed: true,
              title: 'resolve #8 Add responsive at sidebar',
              additions: 224,
              deletions: 73,
              state: 'MERGED',
              author: 'stardustrain',
              commits: [
                {
                  commit: {
                    author: {
                      name: 'stardustrain',
                      email: 'kthanterran@gmail.com',
                    },
                    committedDate: '2020-09-27T13:56:54Z',
                    message: 'Add breakpoints',
                  },
                },
                {
                  commit: {
                    author: {
                      name: 'stardustrain',
                      email: 'kthanterran@gmail.com',
                    },
                    committedDate: '2020-09-29T08:13:57Z',
                    message: 'resolve #8 Add responsive style to Sidebar',
                  },
                },
              ],
              repository: {
                name: 'timing-report',
                owner: 'stardustrain',
              },
            },
          ],
        },
        {
          date: '2020-09-30',
          data: null,
        },
      ])
    })
  })
})
