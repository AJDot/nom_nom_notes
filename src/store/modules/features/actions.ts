import { ServerRecordResponse } from 'Interfaces/serverInterfaces'
import { FeatureAttributes } from 'Models/feature'
import { Action, ActionContext, ActionTree } from 'vuex'
import { ApiPath } from '~/router/path'
import { FeaturesState, RootState } from '~/store/interfaces'
import { FeatureMutationTypes } from '~/store/modules/features/mutations'

export enum FeatureActionTypes {
  FETCH = 'FETCH',
}

type FeatureActions = {
  [key in FeatureActionTypes]: Action<FeaturesState, RootState>
}

const actions: ActionTree<FeaturesState, RootState> & FeatureActions = {
  async [FeatureActionTypes.FETCH]({ commit }: ActionContext<FeaturesState, RootState>, { key }: { key: string }) {
    try {
      const response = await fetch(ApiPath.feature(key), { headers: { "Content-Type": "application/json" } })
      if (!response.ok) return response

      const json: ServerRecordResponse<FeatureAttributes> = await response.json()
      commit(FeatureMutationTypes.ADD, json)
    } catch (err) {
      commit(FeatureMutationTypes.ADD, { key, state: 'off' })
    }
  },
}

export default actions
