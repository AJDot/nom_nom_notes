import { Module } from 'vuex'
import { SignupsState, RootState } from '~/store/interfaces'
import state from '~/store/modules/signups/state'
import getters from '~/store/modules/signups/getters'
import mutations from '~/store/modules/signups/mutations'
import actions from '~/store/modules/signups/actions'

const signups: Module<SignupsState, RootState> = {
  namespaced: true as const,
  state,
  getters,
  mutations,
  actions,
}

export default signups
