import { print } from 'graphql'
import { mergeLeft } from 'ramda'

import FireStore from './FireStore'

import type { DocumentNode } from 'graphql'

interface GetDataParams {
  collection: string
  readonly startAt: string
  readonly endAt: string
}

export const getData = async ({ collection, startAt, endAt }: GetDataParams) => {
  const db = FireStore.getInstance()
  const data: firebase.firestore.DocumentData = []

  const collectionRef = db.collection(collection)
  const snapshot = await collectionRef.orderBy('date').startAt(startAt).endAt(endAt).get()

  snapshot.forEach(doc => {
    data.push(doc.data())
  })
  return data
}

interface RequestParams {
  url: string
  method: 'GET' | 'POST'
  header?: { [key: string]: string }
  body?: any
}

export const request = async <T>({ url, method = 'GET', header, body }: RequestParams): Promise<T> => {
  const response = await fetch(url, {
    method,
    headers: mergeLeft(
      {
        'Content-Type': 'application/json',
      },
      header ?? {}
    ),
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    throw new Error('Request error')
  }

  return response.json()
}

type GraphqlRequestParams = {
  query: DocumentNode
  variables?: { [key: string]: string | number | boolean }
}

type GraphqlResponse<T> = {
  data: T
} & {
  errors: { [key: string]: string }
}

export const graphqlRequest = async <T>({ query, variables }: GraphqlRequestParams): Promise<T> => {
  const response = await request<GraphqlResponse<T>>({
    url: 'https://api.github.com/graphql',
    method: 'POST',
    header: {
      Authorization: `bearer ${process.env.REACT_APP_GITHUB_API_KEY}`,
    },
    body: {
      query: print(query),
      variables: JSON.stringify(variables ?? {}),
    },
  })

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors))
  }

  return response.data
}
