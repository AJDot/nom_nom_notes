import VuexORM from '@vuex-orm/core'
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import database from '~/store/database'
import { RootState } from '~/store/interfaces'
import categories from '~/store/modules/categories'
import features from '~/store/modules/features'
import flash from '~/store/modules/flash'
import interfaces from '~/store/modules/interfaces'
import loading from '~/store/modules/loading'
import modal from '~/store/modules/modal'
import recipes from '~/store/modules/recipes'
import sessions from '~/store/modules/sessions'
import signups from '~/store/modules/signups'
import users from '~/store/modules/users'
import dynamicRecipes from './modules/dynamicRecipes'

// define injection key
export const stateKey: InjectionKey<Store<RootState>> = Symbol('state')

export enum StoreModulePath {
  Root = '',
  Users = 'users/',
  Recipes = 'recipes/',
  DynamicRecipes = 'dynamicRecipes/',
  Categories = 'categories/',
  Session = 'sessions/',
  Signup = 'signups/',
  Flash = 'flash/',
  Modal = 'modal/',
  Loading = 'loading/',
  Features = 'features/',
  Interfaces = 'interfaces/',
  Toggle = 'toggle/',
  Choice = 'choice/',
}

export const store = createStore<RootState>({
  plugins: [VuexORM.install(database)],
  modules: {
    users,
    recipes,
    dynamicRecipes,
    categories,
    signups,
    sessions,
    flash,
    modal,
    loading,
    features,
    interfaces,
  },
  state: {} as RootState,
  mutations: {},
  actions: {},
})
