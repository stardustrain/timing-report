import type { RecoilValueReadOnly } from 'recoil'

export type InnerRecoilDataType<T> = T extends RecoilValueReadOnly<infer U> ? U : never
export type Oneof<T> = T extends (infer U)[] ? U : never
export type Property<T, K extends keyof T> = T[K]
