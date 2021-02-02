import { Module } from 'vuex'
import { FeaturesState, RootState } from '~/store/interfaces'
import state from '~/store/modules/features/state'
import getters from '~/store/modules/features/getters'
import mutations from '~/store/modules/features/mutations'
import actions from '~/store/modules/features/actions'

const features: Module<FeaturesState, RootState> = {
  namespaced: true as const,
  state,
  getters,
  mutations,
  actions,
}

export default features
