import { Module } from 'vuex'
import { RecipesState, RootState } from '~/store/interfaces'
import state from '~/store/modules/recipes/state'
import getters from '~/store/modules/recipes/getters'
import mutations from '~/store/modules/recipes/mutations'
import actions from '~/store/modules/recipes/actions'

const recipes: Module<RecipesState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

export default recipes
