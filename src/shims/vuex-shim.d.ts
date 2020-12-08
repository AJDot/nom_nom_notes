import { Store } from 'vuex'
import { RecipesState, RootState, SessionsState } from '~/store/interfaces'
import { FlashState } from '~/store/modules/flash'
import { StoreModuleType } from '~/store'

declare module '@vue/runtime-core' {
  // Declare your own store states.

  interface ModuleStates {
    [StoreModuleType.Flash]: FlashState
    [StoreModuleType.Recipes]: RecipesState
    [StoreModuleType.Session]: SessionsState
  }

  interface ComponentCustomProperties {
    $store: Store<RootState & ModuleStates>
  }
}
