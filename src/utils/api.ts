interface RequestParams {
  url: string
  method: 'GET' | 'POST'
  body?: any
}

export const request = async <T>({ url, method = 'GET', body }: RequestParams): Promise<T> => {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer 51f081dcb088d6666e76e29c5c72bfa41f3cb695',
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    throw Error('Request error')
  }

  return response.json()
}

export const query = `
query {
  search(query: "author:stardustrain created:2020-02-24..2020-02-26", type: ISSUE, first:100) {
    issueCount
    nodes {
      __typename
      ... on PullRequest {
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
    }
  }
}`
