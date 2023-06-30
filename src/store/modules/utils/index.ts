import {
  Action,
  ActionTree,
  Getter,
  GetterTree,
  Module,
  Mutation,
  MutationTree,
} from 'vuex'
import { RootState } from '~/store/interfaces'
import math from './modules/math'

export interface UtilState {}

export enum UtilGetterTypes {}

export enum UtilMutationTypes {}

export enum UtilActionTypes {}

type UtilGetters = {
  [key in UtilGetterTypes]: Getter<UtilState, RootState>
}

type UtilMutations = {
  [key in UtilMutationTypes]: Mutation<UtilState>
}

type UtilActions = {
  [key in UtilActionTypes]: Action<UtilState, RootState>
}

const state: () => UtilState = () => ({})

const getters: GetterTree<UtilState, RootState> & UtilGetters = {}

const mutations: MutationTree<UtilState> & UtilMutations = {}

const actions: ActionTree<UtilState, RootState> & UtilActions = {}

const utils: Module<UtilState, RootState> = {
  namespaced: true as const,
  modules: {
    math,
  },
  state,
  getters,
  mutations,
  actions,
}

export default utils
