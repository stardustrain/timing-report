import React, { useEffect } from 'react'
import { observer } from 'mobx-react'

import useMst from 'src/hooks/useMst'

export default observer(function Github() {
  const { github } = useMst()

  console.log(github.node.forEach(n => console.log(n.author?.login)))

  useEffect(() => {
    github.fetchData()
    // eslint-disable-next-line
  }, [])

  return (
    <div className="Github">
      Github
      {github.node.map((n, i) => (
        <li key={n.repository.name + i}>{n.repository.name}</li>
      ))}
    </div>
  )
})
