import { Module } from 'vuex'
import { SessionsState, RootState } from '~/store/interfaces'
import state from '~/store/modules/sessions/state'
import getters from '~/store/modules/sessions/getters'
import mutations from '~/store/modules/sessions/mutations'
import actions from '~/store/modules/sessions/actions'

const sessions: Module<SessionsState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

export default sessions
