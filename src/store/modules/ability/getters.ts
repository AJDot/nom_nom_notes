import { Getter, GetterTree } from 'vuex'
import { AbilityState, RootState } from '~/store/interfaces'

export enum AbilityGetterTypes {}

type AbilityGetters = {
  [key in AbilityGetterTypes]: Getter<AbilityState, RootState>
}

const getters: GetterTree<AbilityState, RootState> & AbilityGetters = {}

export default getters
