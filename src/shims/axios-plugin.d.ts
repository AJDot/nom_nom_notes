import _Vue from 'vue'
import Axios, { AxiosInstance, AxiosStatic } from 'axios'

export function AxiosPlugin<AxiosPluginOptions>(Vue: typeof _Vue, _options?: AxiosPluginOptions): void {
  // do stuff with options
  Vue.prototype.$http = Axios
}

export class AxiosPluginOptions {
  // add stuff
  plain: AxiosInstance
  secure: AxiosInstance
}

// eslint-disable-next-line no-redeclare
export class AxiosStatic {
  plain: AxiosInstance
  secure: AxiosInstance
}

declare module 'vue/types/vue' {
  interface Vue {
    $http: AxiosStatic
  }
}
