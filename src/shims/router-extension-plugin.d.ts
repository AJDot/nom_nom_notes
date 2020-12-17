import { RouterExtension } from '~/router/routerExtension'
import { ModalStore } from '~/plugins/store/modals'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ComponentCustomProperties } from '@vue/runtime-core'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue'
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $routerExtension: RouterExtension
    $modal: ModalStore
  }
  export interface App {
    $routerExtension: RouterExtension
    $modal: ModalStore
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $routerExtension: RouterExtension
    $modal: ModalStore
  }

  interface VueConstructor {
    $routerExtension: RouterExtension
    $modal: ModalStore
  }
}
