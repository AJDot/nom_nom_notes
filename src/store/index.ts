import VuexORM from '@vuex-orm/core'
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import database from '~/store/database'
import { RootState } from '~/store/interfaces'
import features from '~/store/modules/features'
import flash from '~/store/modules/flash'
import interfaces from '~/store/modules/interfaces'
import loading from '~/store/modules/loading'
import modal from '~/store/modules/modal'
import recipes from '~/store/modules/recipes'
import sessions from '~/store/modules/sessions'
import signups from '~/store/modules/signups'
import tags from '~/store/modules/tags'
import users from '~/store/modules/users'
import utils from '~/store/modules/utils'
import ability from './modules/ability'
import dynamicRecipes from './modules/dynamicRecipes'
import shoppingLists from './modules/shoppingLists'

// define injection key
export const stateKey: InjectionKey<Store<RootState>> = Symbol('state')

export enum StoreModulePath {
  Root = '',
  Users = 'users/',
  Recipes = 'recipes/',
  DynamicRecipes = 'dynamicRecipes/',
  Tags = 'tags/',
  Session = 'sessions/',
  Signup = 'signups/',
  Flash = 'flash/',
  Modal = 'modal/',
  Loading = 'loading/',
  Features = 'features/',
  Interfaces = 'interfaces/',
  Toggle = 'toggle/',
  Choice = 'choice/',
  Ability = 'ability/',
  Mode = 'mode/',
  ShoppingLists = 'shoppingLists/',
  Utils = 'utils/',
  Math = 'math/',
}

export const store = createStore<RootState>({
  plugins: [VuexORM.install(database)],
  modules: {
    users,
    recipes,
    dynamicRecipes,
    tags,
    signups,
    sessions,
    flash,
    modal,
    loading,
    features,
    interfaces,
    ability,
    shoppingLists,
    utils,
  },
  state: {} as RootState,
  mutations: {},
  actions: {},
})
