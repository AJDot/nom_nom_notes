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

export interface LoadingState {
  loading: boolean
  count: number
}

export enum LoadingGetterTypes {}

export enum LoadingMutationTypes {
  SET = 'SET',
}

export enum LoadingActionTypes {
  SET = 'SET',
}

type LoadingGetters = {
  [key in LoadingGetterTypes]: Getter<LoadingState, RootState>
}
type LoadingMutations = { [key in LoadingMutationTypes]: Mutation<LoadingState> }
type LoadingActions = {
  [key in LoadingActionTypes]: Action<LoadingState, RootState>
}

const state: () => LoadingState = () => ({
  count: 0,
  loading: false,
})

const getters: GetterTree<LoadingState, RootState> & LoadingGetters = {}

const mutations: MutationTree<LoadingState> & LoadingMutations = {
  [LoadingMutationTypes.SET](state, loading: boolean) {
    if (loading) {
      state.count++
      state.loading = true
    } else if (state.count > 0) {
      state.count--
      state.loading = state.count > 0
    }
  },
}

const actions: ActionTree<LoadingState, RootState> & LoadingActions = {
  [LoadingActionTypes.SET]({ commit }: { commit: Commit }, loading: boolean) {
    commit(LoadingMutationTypes.SET, loading)
  },
}

const loading: Module<LoadingState, RootState> = {
  namespaced: true as const,
  state,
  getters,
  mutations,
  actions,
}

export default loading
