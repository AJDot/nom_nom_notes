import { Getter, GetterTree } from 'vuex'
import { RootState, TagsState } from '~/store/interfaces'

export enum TagGetterTypes {}

type TagGetters = {
  [key in TagGetterTypes]: Getter<TagsState, RootState>
}

const getters: GetterTree<TagsState, RootState> & TagGetters = {}

export default getters
