import {
  Action,
  ActionTree,
  Commit,
  Getter,
  GetterTree,
  Module,
  Mutation,
  MutationTree,
} from 'vuex'
import { RootState } from '~/store/interfaces'

export interface ToggleState {
  state: Record<string, boolean>
}

export enum ToggleGetterTypes {}

export enum ToggleMutationTypes {
  SET = 'SET',
  TOGGLE = 'TOGGLE',
}

export enum ToggleActionTypes {
  SET = 'SET',
  TOGGLE = 'TOGGLE',
}

type ToggleGetters = {
  [key in ToggleGetterTypes]: Getter<ToggleState, RootState>
}
type ToggleMutations = { [key in ToggleMutationTypes]: Mutation<ToggleState> }
type ToggleActions = {
  [key in ToggleActionTypes]: Action<ToggleState, RootState>
}

const state: () => ToggleState = () => ({
  state: {},
})

const getters: GetterTree<ToggleState, RootState> & ToggleGetters = {}

const mutations: MutationTree<ToggleState> & ToggleMutations = {
  [ToggleMutationTypes.SET]( state, { key, value }: { key: string, value: boolean }) {
    state.state[key] = value
  },
  [ToggleMutationTypes.TOGGLE](state, key: string) {
    state.state[key] = !state.state[key]
  },
}

const actions: ActionTree<ToggleState, RootState> & ToggleActions = {
  [ToggleActionTypes.SET]({ commit }: { commit: Commit }, payload: { key: boolean, value: boolean }) {
    commit(ToggleMutationTypes.SET, payload)
  },
  [ToggleActionTypes.TOGGLE]( { commit }: { commit: Commit }, key: boolean) {
    commit(ToggleMutationTypes.TOGGLE, key)
  },
}

const Toggle: Module<ToggleState, RootState> = {
  namespaced: true as const,
  state,
  getters,
  mutations,
  actions,
}

export default Toggle
