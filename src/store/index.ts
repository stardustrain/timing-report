import { createContext } from 'react'
import { types } from 'mobx-state-tree'

import Github from './Github'

const RootStore = types.model({
  github: Github,
})

export const rootStore = RootStore.create({
  github: {
    nodes: [],
    state: 'done',
  },
})

export const rootContext = createContext(rootStore)
export const Provider = rootContext.Provider
