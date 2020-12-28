import { Hash } from 'Interfaces/utilInterfaces'

export interface ServerData<T = Record<string, unknown>> {
  id: string
  type: string
  attributes: T
  relationships: Hash
}

export interface ServerResponse<U, T = ServerData<U>> {
  data: T
  included: Array<any>
  error?: any
}
