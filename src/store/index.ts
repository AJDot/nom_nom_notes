import { createStore, Store } from 'vuex'
import { RootState } from '~/store/interfaces'
import { InjectionKey } from 'vue'
import recipes from '~/store/modules/recipes'
import sessions from '~/store/modules/sessions'
import flash from '~/store/modules/flash'
import VuexORM from '@vuex-orm/core'
import database from '~/store/database'

// define injection key
export const stateKey: InjectionKey<Store<RootState>> = Symbol('state')

export enum StoreModulePath {
  Root = '',
  Recipes = 'recipes/',
  Session = 'sessions/',
  Flash = 'flash/',
}

export const store = createStore<RootState>({
  plugins: [VuexORM.install(database)],
  modules: {
    recipes,
    sessions,
    flash,
  },
  state: {} as RootState,
  mutations: {},
  actions: {},
})
