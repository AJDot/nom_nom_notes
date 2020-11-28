import { ServerData } from 'Interfaces/server_interfaces'

export default class AjaxRequest {
  private options: {}

  constructor(options = {}) {
    this.options = options
  }

  async send<T>(): Promise<ServerData<T>> {
    return new Promise((resolve, reject) => {
      $.ajax(this.options)
        .done(function (result, statusText, xhr) {
          resolve([result, statusText, xhr])
        })
        .fail(function (result, statusText, xhr) {
          reject([result, statusText, xhr])
        })
    })
  }
}
