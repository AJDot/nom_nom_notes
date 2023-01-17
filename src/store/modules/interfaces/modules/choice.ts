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

export interface ChoiceState {
  current: { type: string, args: any[] } | null
}

export enum ChoiceGetterTypes {}

export enum ChoiceMutationTypes {
  SET = 'SET',
  UNSET = 'UNSET'
}

export enum ChoiceActionTypes {
  SET = 'SET',
  UNSET = 'UNSET'
}

type ChoiceGetters = {
  [key in ChoiceGetterTypes]: Getter<ChoiceState, RootState>
}
type ChoiceMutations = { [key in ChoiceMutationTypes]: Mutation<ChoiceState> }
type ChoiceActions = {
  [key in ChoiceActionTypes]: Action<ChoiceState, RootState>
}

const state: () => ChoiceState = () => ({
  current: null,
})

const getters: GetterTree<ChoiceState, RootState> & ChoiceGetters = {}

const mutations: MutationTree<ChoiceState> & ChoiceMutations = {
  [ChoiceMutationTypes.SET](state, payload: { type: string, args: any[] } | null) {
    state.current = payload
  },
  [ChoiceMutationTypes.UNSET](state) {
    state.current = null
  },
}

const actions: ActionTree<ChoiceState, RootState> & ChoiceActions = {
  [ChoiceActionTypes.SET]({ commit }: { commit: Commit }, payload: { type: string, args: any[] } | null) {
    commit(ChoiceMutationTypes.SET, payload)
  },
  [ChoiceActionTypes.UNSET]({ commit }: { commit: Commit }) {
    commit(ChoiceMutationTypes.UNSET)
  },
}

const Choice: Module<ChoiceState, RootState> = {
  namespaced: true as const,
  state,
  getters,
  mutations,
  actions,
}

export default Choice
