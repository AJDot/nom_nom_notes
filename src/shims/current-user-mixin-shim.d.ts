import { User } from "~/models/user"

import Vue from "vue"
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    currentUser: User | null
  }
}