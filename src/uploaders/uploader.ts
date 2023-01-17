import { AxiosResponse } from 'axios'
import { ServerRecordResponse } from 'Interfaces/serverInterfaces'
import { securedAxiosInstance } from '~/backend/axios'
import { HttpMethod } from '~/utils/httpUtils'

export default class Uploader {
  url: string

  constructor(url: string) {
    this.url = url
  }

  async post<T = Record<string, unknown>>(options: { data: Record<string, string | Blob>, root?: string }): Promise<AxiosResponse<ServerRecordResponse<T>>> {
    return this.call<T>(HttpMethod.POST, options)
  }

  async patch(options: { data: Record<string, string | Blob>, root?: string }): Promise<AxiosResponse<ServerRecordResponse<Record<string, unknown>>>> {
    return this.call(HttpMethod.PATCH, options)
  }

  private async call<T = Record<string, unknown>>(method: HttpMethod, options: { data: Record<string, string | Blob>, root?: string }): Promise<AxiosResponse<ServerRecordResponse<T>>> {
    const formData = new FormData()
    for (const k in options.data) {
      formData.append(options.root ? `${options.root}[${k}]` : `${k}`, options.data[k])
    }

    return securedAxiosInstance[method.toLowerCase()](this.url, formData, { headers: { 'Content-Type': 'application/json' } })
  }
}
