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

export interface ScaleState {
  scale: string
}

export enum ScaleGetterTypes {}

export enum ScaleMutationTypes {
  SET = 'SET',
  RESET = 'RESET',
}

export enum ScaleActionTypes {
  SET = 'SET',
}

type ScaleGetters = {
  [key in ScaleGetterTypes]: Getter<ScaleState, RootState>;
}
type ScaleMutations = { [key in ScaleMutationTypes]: Mutation<ScaleState> }
type ScaleActions = {
  [key in ScaleActionTypes]: Action<ScaleState, RootState>;
}

const state: () => ScaleState = () => ({
  scale: '1',
})

const getters: GetterTree<ScaleState, RootState> & ScaleGetters = {}

const mutations: MutationTree<ScaleState> & ScaleMutations = {
  [ScaleMutationTypes.SET](state, scale: string) {
    state.scale = scale
  },
  [ScaleMutationTypes.RESET](state) {
    state.scale = '1'
  },
}

const actions: ActionTree<ScaleState, RootState> & ScaleActions = {
  [ScaleActionTypes.SET]({ commit }: { commit: Commit }, scale: string) {
    commit(ScaleMutationTypes.SET, scale)
  },
}

const scale: Module<ScaleState, RootState> = {
  namespaced: true as const,
  state,
  getters,
  mutations,
  actions,
}

export default scale
