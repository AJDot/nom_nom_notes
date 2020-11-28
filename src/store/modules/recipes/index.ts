import { Module } from 'vuex'
import Recipe from 'Models/recipe'
import { PersistenceState, RootState } from '~/store/interfaces'
import state from '~/store/modules/recipes/state'
import getters from '~/store/modules/recipes/getters'
import mutations from '~/store/modules/recipes/mutations'
import actions from '~/store/modules/recipes/actions'

const recipes: Module<PersistenceState<Recipe>, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

export default recipes
