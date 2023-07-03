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
import choice from './modules/choice'
import toggle from './modules/toggle'
import mode from './modules/mode'

export interface InterfaceState {}

export enum InterfaceGetterTypes {}

export enum InterfaceMutationTypes {}

export enum InterfaceActionTypes {}

type InterfaceGetters = {
  [key in InterfaceGetterTypes]: Getter<InterfaceState, RootState>
}

type InterfaceMutations = {
  [key in InterfaceMutationTypes]: Mutation<InterfaceState>
}

type InterfaceActions = {
  [key in InterfaceActionTypes]: Action<InterfaceState, RootState>
}

const state: () => InterfaceState = () => ({})

const getters: GetterTree<InterfaceState, RootState> & InterfaceGetters = {}

const mutations: MutationTree<InterfaceState> & InterfaceMutations = {}

const actions: ActionTree<InterfaceState, RootState> & InterfaceActions = {}

const interfaces: Module<InterfaceState, RootState> = {
  namespaced: true as const,
  modules: {
    toggle,
    choice,
    mode,
  },
  state,
  getters,
  mutations,
  actions,
}

export default interfaces
