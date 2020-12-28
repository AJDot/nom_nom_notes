import { Module } from 'vuex'
import { CategoriesState, RootState } from '~/store/interfaces'
import state from '~/store/modules/categories/state'
import getters from '~/store/modules/categories/getters'
import mutations from '~/store/modules/categories/mutations'
import actions from '~/store/modules/categories/actions'

const categories: Module<CategoriesState, RootState> = {
  namespaced: true as const,
  state,
  getters,
  mutations,
  actions,
}

export default categories
