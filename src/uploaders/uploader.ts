import { HttpMethod } from '~/utils/httpUtils'

export default class Uploader {
  url: string

  constructor(url: string) {
    this.url = url
  }

  async post<T = Record<string, unknown>>(options: { data: Record<string, string | Blob>, root?: string, contentType?: string | null }): Promise<Response> {
    return this.call<T>(HttpMethod.POST, options)
  }

  async patch(options: { data: Record<string, string | Blob>, root?: string, contentType?: string | null }): Promise<Response> {
    return this.call(HttpMethod.PATCH, options)
  }

  private async call<T = Record<string, unknown>>(method: HttpMethod, options: { data: Record<string, string | Blob>, root?: string, contentType?: string | null }): Promise<Response> {
    const formData = new FormData()
    for (const k in options.data) {
      formData.append(options.root ? `${options.root}[${k}]` : `${k}`, options.data[k])
    }
    const headers: HeadersInit = {}
    const contentType = options.hasOwnProperty('contentType') ? options.contentType : 'application/json'
    if (contentType) headers.contentType = contentType

    return fetch(this.url, {
      method,
      headers,
      credentials: "include",
      body: formData,
    })
  }
}
