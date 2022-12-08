export interface ServerData<T = Record<string, unknown>> {
  id: string
  type: string
  attributes: T
  relationships: Record<PropertyKey, any>
}

export interface ServerResponse<U, T = ServerData<U>> {
  data: T
  included: Array<any>
  error?: any
}
