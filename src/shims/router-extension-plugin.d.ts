import { RouterExtension } from '~/router/routerExtension'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $routerExtension: RouterExtension
  }
  export interface App {
    $routerExtension: RouterExtension
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $routerExtension: RouterExtension
  }

  interface VueConstructor {
    $routerExtension: RouterExtension
  }
}
