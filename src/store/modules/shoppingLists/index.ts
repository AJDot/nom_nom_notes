import { Module } from 'vuex'
import { ShoppingListsState, RootState } from '~/store/interfaces'
import actions from '~/store/modules/shoppingLists/actions'
import getters from '~/store/modules/shoppingLists/getters'
import mutations from '~/store/modules/shoppingLists/mutations'
import state from '~/store/modules/shoppingLists/state'

const shoppingLists: Module<ShoppingListsState, RootState> = {
  namespaced: true as const,
  state,
  getters,
  mutations,
  actions,
}

export default shoppingLists
