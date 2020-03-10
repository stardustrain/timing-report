import { types, flow } from 'mobx-state-tree'

import { request, query } from 'src/utils/api'

const Author = types.model({
  login: types.string,
})

const Commit = types.model({
  totalCount: types.number,
})

const Repository = types.model({
  owner: Author,
  name: types.string,
})

const Node = types.model({
  __typename: types.enumeration(['PullRequest', 'Issue']),
  createdAt: types.string,
  closed: types.boolean,
  title: types.string,
  additions: types.number,
  deletions: types.number,
  state: types.enumeration(['OPEN', 'MERGED', 'CLOSED']),
  author: Author,
  commits: Commit,
  repository: Repository,
})

const Github = types
  .model({
    nodes: types.array(Node),
    state: types.enumeration(['loading', 'done', 'error']),
  })
  .actions(self => ({
    fetchData: flow(function*() {
      self.state = 'loading'

      try {
        const res = yield request<GithubResponse>({
          url: 'https://api.github.com/graphql',
          method: 'POST',
          body: {
            query,
          },
        })
        self.nodes = res.data.search.nodes
        self.state = 'done'
      } catch {
        self.state = 'error'
      }
    }),
  }))
  .views(self => ({
    get node() {
      return self.nodes
    },
  }))

export default Github
