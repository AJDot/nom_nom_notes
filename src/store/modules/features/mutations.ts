import { Mutation, MutationTree } from 'vuex'
import { FeaturesState } from '~/store/interfaces'
import Feature, { RFeature } from 'Models/feature'
import { ArrayUtils } from '~/utils/arrayUtils'

export enum FeatureMutationTypes {
  ADD = 'ADD',
}

type FeatureMutations = { [key in FeatureMutationTypes]: Mutation<FeaturesState> }

const mutations: MutationTree<FeaturesState> & FeatureMutations = {
  async [FeatureMutationTypes.ADD](state, features: RFeature | RFeature[]) {
    features = ArrayUtils.wrap(features)
    await Feature.insertOrUpdate({ data: features })
  },
}

export default mutations
