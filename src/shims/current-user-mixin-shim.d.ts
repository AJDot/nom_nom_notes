import { User } from '~/models/user'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    currentUser: User | null
  }
}
