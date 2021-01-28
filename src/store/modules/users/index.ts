import { Module } from 'vuex'
import { UsersState, RootState } from '~/store/interfaces'
import state from '~/store/modules/users/state'
import getters from '~/store/modules/users/getters'
import mutations from '~/store/modules/users/mutations'
import actions from '~/store/modules/users/actions'

const users: Module<UsersState, RootState> = {
  namespaced: true as const,
  state,
  getters,
  mutations,
  actions,
}

export default users
