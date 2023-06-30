import { Unit } from 'mathjs'
import { Action, ActionTree, Getter, GetterTree, Module, Mutation, MutationTree } from 'vuex'
import { RootState } from '~/store/interfaces'
import Math from '~/utils/math'

export interface MathState {
  madeUp: Unit[]
}

export enum MathGetterTypes {}

export enum MathMutationTypes {
  ADD_MADE_UP_UNIT = 'ADD_MADE_UP_UNIT',
}

export enum MathActionTypes {
}

type MathGetters = {
  [key in MathGetterTypes]: Getter<MathState, RootState>
}
type MathMutations = { [key in MathMutationTypes]: Mutation<MathState> }
type MathActions = {
  [key in MathActionTypes]: Action<MathState, RootState>
}

const state: () => MathState = () => ({
  madeUp: [],
})

const getters: GetterTree<MathState, RootState> & MathGetters = {}

const mutations: MutationTree<MathState> & MathMutations = {
  [MathMutationTypes.ADD_MADE_UP_UNIT](state, unitString: string) {
    state.madeUp.push(Math.createUnit(unitString))
  },
}

const actions: ActionTree<MathState, RootState> & MathActions = {
}

const math: Module<MathState, RootState> = {
  namespaced: true as const,
  state,
  getters,
  mutations,
  actions,
}

export default math
