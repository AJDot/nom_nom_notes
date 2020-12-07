export interface ServerData<T = Record<string, unknown>> {
  id: string
  type: string
  attributes: T
}

export interface ServerResponse<U, T = ServerData<U>> {
  data: T
}
