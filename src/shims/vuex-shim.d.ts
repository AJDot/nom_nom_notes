import { Store } from 'vuex'
import { RootState } from '~/store/interfaces'

declare module "@vue/runtime-core" {
  // Declare your own store states.

  interface ComponentCustomProperties {
    $store: Store<RootState>;
  }
}
