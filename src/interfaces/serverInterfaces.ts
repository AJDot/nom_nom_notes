export interface ServerRecordData<T = Record<string, unknown>> {
  id: string
  type: string
  attributes: T
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  relationships: Record<PropertyKey, any>
}

export interface ServerRecordResponse<U, T = ServerRecordData<U>> {
  data: T
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  included: Array<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any
}
