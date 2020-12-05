import jqXHR = JQuery.jqXHR

export interface Response {
  data: object
}

export interface ModelData {
  id: string
  type: string
  attributes: object
}

export interface ModelResponse<T = ModelData> {
  data: T
}

export type ServerData<T = Response> = [T, string, jqXHR]
