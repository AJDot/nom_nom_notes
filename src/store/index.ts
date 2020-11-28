import { createStore, Store } from 'vuex'
import recipes from '~/store/modules/recipes'
import { RootState } from '~/store/interfaces'
import { InjectionKey } from 'vue'

// define injection key
export const stateKey: InjectionKey<Store<RootState>> = Symbol()

export const store = createStore<RootState>({
  modules: {
    recipes: recipes,
  },
  state: {
  },
  mutations: {},
  actions: {},
})
