import { useContext } from 'react'
import { rootContext } from 'src/store'

export default function() {
  const store = useContext(rootContext)
  if (store === null) {
    throw new Error('Root context is null')
  }

  return store
}
