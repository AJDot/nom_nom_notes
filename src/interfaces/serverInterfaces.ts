export interface ServerRecordData<T = Record<string, unknown>> {
  id: string
  type: string
  attributes: T
  relationships: Record<PropertyKey, any>
}

export interface ServerRecordResponse<U, T = ServerRecordData<U>> {
  data: T
  included: Array<any>
  error?: any
}
