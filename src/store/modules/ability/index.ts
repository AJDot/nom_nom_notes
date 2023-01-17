import { Module } from 'vuex'
import { AbilityState, RootState } from '~/store/interfaces'
import actions from '~/store/modules/ability/actions'
import getters from '~/store/modules/ability/getters'
import mutations from '~/store/modules/ability/mutations'
import state from '~/store/modules/ability/state'

const ability: Module<AbilityState, RootState> = {
  namespaced: true as const,
  state,
  getters,
  mutations,
  actions,
}

export default ability
