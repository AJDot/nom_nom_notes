import { ServerData } from 'Interfaces/server_interfaces'

export default class AjaxRequest {
  private options = {}

  constructor(options = {}) {
    this.options = options
  }

  async send<T>(): Promise<ServerData<T>> {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-undef
      $.ajax(this.options)
        .done(function(result, statusText, xhr) {
          resolve([result, statusText, xhr])
        })
        .fail(function(error) {
          reject(error)
        })
    })
  }
}
