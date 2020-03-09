import { useEffect } from 'react'

interface EventObject {
  name: string
  callback: (e: any) => void
}

export default function(events: EventObject[], target: Document | Window = document) {
  useEffect(() => {
    events.forEach(({ name, callback }) => {
      target.addEventListener(name, callback)
    })

    return () => {
      events.forEach(({ name, callback }) => {
        target.removeEventListener(name, callback)
      })
    }
    // eslint-disable-next-line
  }, [])
}
