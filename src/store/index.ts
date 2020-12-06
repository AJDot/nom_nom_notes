import { createStore, Store } from 'vuex'
import { RootState } from '~/store/interfaces'
import { InjectionKey } from 'vue'
import recipes from '~/store/modules/recipes'
import sessions from '~/store/modules/sessions'
import flash from '~/store/modules/flash'

// define injection key
export const stateKey: InjectionKey<Store<RootState>> = Symbol()

export enum StoreModuleType {
  Root = '',
  Recipes = 'recipes',
  Session = 'sessions',
  Flash = 'flash',
}

export enum StoreModulePath {
  Root = '',
  Recipes = 'recipes/',
  Session = 'sessions/',
  Flash = 'flash/',
}

export const store = createStore<RootState>({
  modules: {
    recipes,
    sessions,
    flash,
  },
  state: {} as RootState,
  mutations: {},
  actions: {},
})
