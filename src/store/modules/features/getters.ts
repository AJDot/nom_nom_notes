import { Getter, GetterTree } from 'vuex'
import { FeaturesState, RootState } from '~/store/interfaces'

export enum FeatureGetterTypes {
}

type FeatureGetters = {
  [key in FeatureGetterTypes]: Getter<FeaturesState, RootState>;
}

const getters: GetterTree<FeaturesState, RootState> & FeatureGetters = {
}

export default getters
