import { Action, ActionTree, Commit, Getter, GetterTree, Module, Mutation, MutationTree } from 'vuex'
import { RootState } from '~/store/interfaces'

export interface ModeState {
  current: string | null
}

export enum ModeGetterTypes {}

export enum ModeMutationTypes {
  SET = 'SET',
  UNSET = 'UNSET',
}

export enum ModeActionTypes {
  SET = 'SET',
  UNSET = 'UNSET',
}

type ModeGetters = {
  [key in ModeGetterTypes]: Getter<ModeState, RootState>
}
type ModeMutations = { [key in ModeMutationTypes]: Mutation<ModeState> }
type ModeActions = {
  [key in ModeActionTypes]: Action<ModeState, RootState>
}

const state: () => ModeState = () => ({
  current: null,
})

const getters: GetterTree<ModeState, RootState> & ModeGetters = {}

const mutations: MutationTree<ModeState> & ModeMutations = {
  [ModeMutationTypes.SET](state, payload: string | null) {
    state.current = payload
  },
  [ModeMutationTypes.UNSET](state) {
    state.current = null
  },
}

const actions: ActionTree<ModeState, RootState> & ModeActions = {
  [ModeActionTypes.SET]({ commit }: { commit: Commit }, payload: { type: string, args: unknown[] } | null) {
    commit(ModeMutationTypes.SET, payload)
  },
  [ModeActionTypes.UNSET]({ commit }: { commit: Commit }) {
    commit(ModeMutationTypes.UNSET)
  },
}

const Mode: Module<ModeState, RootState> = {
  namespaced: true as const,
  state,
  getters,
  mutations,
  actions,
}

export default Mode
