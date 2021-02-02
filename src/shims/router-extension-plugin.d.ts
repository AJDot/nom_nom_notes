import { RouterExtension } from '~/router/routerExtension'
import { ModalStore } from '~/plugins/store/modals'
import { Flipper } from '~/plugins/flipper'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ComponentCustomProperties } from '@vue/runtime-core'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue'
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $routerExtension: RouterExtension
    $modal: ModalStore
    $flipper: Flipper
  }
  export interface App {
    $routerExtension: RouterExtension
    $modal: ModalStore
    $flipper: Flipper
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $routerExtension: RouterExtension
    $modal: ModalStore
    $flipper: Flipper
  }

  interface VueConstructor {
    $routerExtension: RouterExtension
    $modal: ModalStore
    $flipper: Flipper
  }
}
