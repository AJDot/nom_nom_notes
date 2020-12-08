import { AxiosInstance } from 'axios'

interface AxiosInstances {
  plain: AxiosInstance
  secured: AxiosInstance
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $http: AxiosInstances
  }
}
