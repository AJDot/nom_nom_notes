import { Module } from 'vuex'
import { DynamicRecipesState, RootState } from '~/store/interfaces'
import actions from '~/store/modules/dynamicRecipes/actions'
import getters from '~/store/modules/dynamicRecipes/getters'
import mutations from '~/store/modules/dynamicRecipes/mutations'
import state from '~/store/modules/dynamicRecipes/state'

const dynamicRecipes: Module<DynamicRecipesState, RootState> = {
  namespaced: true as const,
  state,
  getters,
  mutations,
  actions,
}

export default dynamicRecipes
