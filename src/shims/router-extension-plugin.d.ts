import { Flipper } from '~/plugins/flipper'
import { ModalStore } from '~/plugins/store/modals'
import { RouterExtension } from '~/router/routerExtension'
import '@vue/runtime-core'

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
