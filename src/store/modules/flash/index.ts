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
  // because sometimes you need to persist flash across a router path change
  hold: boolean
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
  hold: false,
})

const getters: GetterTree<FlashState, RootState> & FlashGetters = {}

const mutations: MutationTree<FlashState> & FlashMutations = {
  [FlashMutationTypes.SET](state, { flash, hold }: { flash: FlashHash, hold: boolean }) {
    state.flash = flash
    state.trigger = true
    state.hold = hold
  },
  [FlashMutationTypes.RESET](state) {
    if (state.hold) {
      state.hold = false
    } else {
      state.flash = {}
      state.trigger = false
    }
  },
  [FlashMutationTypes.CLOSE](state) {
    state.flash = {}
    state.trigger = true
  },
}

const actions: ActionTree<FlashState, RootState> & FlashActions = {
  [FlashActionTypes.SET](
    { commit }: { commit: Commit },
    { flash, hold }: { flash: FlashHash, hold: boolean },
  ) {
    commit(FlashMutationTypes.SET, { flash, hold })
  },
}

const flash: Module<FlashState, RootState> = {
  namespaced: true as const,
  state,
  getters,
  mutations,
  actions,
}

export default flash
