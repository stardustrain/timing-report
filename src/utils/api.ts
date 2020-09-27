import FireStore from './FireStore'

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
  body?: any
}

export const request = async <T>({ url, method = 'GET', body }: RequestParams): Promise<T> => {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_GITHUB_API_KEY}`,
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    throw Error('Request error')
  }

  return response.json()
}
