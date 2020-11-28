import jqXHR = JQuery.jqXHR

export interface Response {
  success: boolean;
}

export type ServerData<T = Response> = [T, string, jqXHR]
