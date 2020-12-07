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
import { FlashHash } from 'Interfaces/flashInterfaces'

export interface FlashState {
  flash: FlashHash
  trigger: boolean
}

export enum FlashGetterTypes {}

export enum FlashMutationTypes {
  SET = 'SET',
  RESET = 'RESET',
  CLOSE = 'CLOSE',
}

export enum FlashActionTypes {
  SET = 'SET',
}

type FlashGetters = {
  [key in FlashGetterTypes]: Getter<FlashState, RootState>;
}
type FlashMutations = { [key in FlashMutationTypes]: Mutation<FlashState> }
type FlashActions = {
  [key in FlashActionTypes]: Action<FlashState, RootState>;
}

const state: () => FlashState = () => ({
  flash: {},
  trigger: true,
})

const getters: GetterTree<FlashState, RootState> & FlashGetters = {}

const mutations: MutationTree<FlashState> & FlashMutations = {
  [FlashMutationTypes.SET](state, { flash }: { flash: FlashHash }) {
    state.flash = flash
    state.trigger = true
  },
  [FlashMutationTypes.RESET](state) {
    state.flash = {}
    state.trigger = false
  },
  [FlashMutationTypes.CLOSE](state) {
    state.flash = {}
    state.trigger = true
  },
}

const actions: ActionTree<FlashState, RootState> & FlashActions = {
  [FlashActionTypes.SET](
    { commit }: { commit: Commit },
    { flash }: { flash: FlashHash },
  ) {
    commit(FlashMutationTypes.SET, { flash })
  },
}

const flash: Module<FlashState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

export default flash
