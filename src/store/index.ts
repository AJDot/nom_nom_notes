import { createStore, Store } from 'vuex'
import { RootState } from '~/store/interfaces'
import { InjectionKey } from 'vue'
import recipes from '~/store/modules/recipes'
import sessions from '~/store/modules/sessions'

// define injection key
export const stateKey: InjectionKey<Store<RootState>> = Symbol()

export enum StoreModuleTypes {
  Root = '',
  Recipes = 'recipes/',
  Session = 'sessions/',
}

export const store = createStore<RootState>({
  modules: {
    recipes,
    sessions,
  },
  state: {} as RootState,
  mutations: {},
  actions: {},
})
