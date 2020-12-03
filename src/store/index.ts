import { createStore, Store } from 'vuex'
import { RootState } from '~/store/interfaces'
import { InjectionKey } from 'vue'
import recipes from '~/store/modules/recipes'

// define injection key
export const stateKey: InjectionKey<Store<RootState>> = Symbol()

export enum StoreModuleTypes {
  Root = '',
  Recipes = 'recipes/',
}
export const store = createStore<RootState>({
  modules: {
    recipes,
  },
  state: {} as RootState,
  mutations: {},
  actions: {},
})
