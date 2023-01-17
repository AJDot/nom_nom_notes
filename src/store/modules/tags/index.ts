import { Module } from 'vuex'
import { RootState, TagsState } from '~/store/interfaces'
import actions from '~/store/modules/tags/actions'
import getters from '~/store/modules/tags/getters'
import mutations from '~/store/modules/tags/mutations'
import state from '~/store/modules/tags/state'

const tags: Module<TagsState, RootState> = {
  namespaced: true as const,
  state,
  getters,
  mutations,
  actions,
}

export default tags
