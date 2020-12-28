import { securedAxiosInstance } from '~/backend/axios'
import { AxiosResponse } from 'axios'
import { ServerResponse } from 'Interfaces/serverInterfaces'

export default class Uploader {
  url: string

  constructor(url: string) {
    this.url = url
  }

  async patch(options: { data: Record<string, string | Blob>, root?: string }): Promise<AxiosResponse<ServerResponse<Record<string, unknown>>>> {
    const formData = new FormData()
    for (const k in options.data) {
      formData.append(options.root ? `${options.root}[${k}]` : `${k}`, options.data[k])
    }

    return securedAxiosInstance.patch(this.url, formData)
  }
}
