import { createStore, Store } from 'vuex'
import { RootState } from '~/store/interfaces'
import { InjectionKey } from 'vue'
import VuexORM from '@vuex-orm/core'
import database from '~/store/database'
import recipes from '~/store/modules/recipes'
import sessions from '~/store/modules/sessions'
import flash from '~/store/modules/flash'
import modal from '~/store/modules/modal'
import loading from '~/store/modules/loading'
import categories from '~/store/modules/categories'
import users from '~/store/modules/users'
import signups from '~/store/modules/signups'

// define injection key
export const stateKey: InjectionKey<Store<RootState>> = Symbol('state')

export enum StoreModulePath {
  Root = '',
  Users = 'users/',
  Recipes = 'recipes/',
  Categories = 'categories/',
  Session = 'sessions/',
  Signup = 'signups/',
  Flash = 'flash/',
  Modal = 'modal/',
  Loading = 'loading/',
}

export const store = createStore<RootState>({
  plugins: [VuexORM.install(database)],
  modules: {
    users,
    recipes,
    categories,
    signups,
    sessions,
    flash,
    modal,
    loading,
  },
  state: {} as RootState,
  mutations: {},
  actions: {},
})
