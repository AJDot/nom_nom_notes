import { Action, ActionContext, ActionTree } from 'vuex'
import { FeaturesState, RootState } from '~/store/interfaces'
import { AxiosResponse } from 'axios'
import { ServerRecordResponse } from 'Interfaces/serverInterfaces'
import { securedAxiosInstance } from '~/backend/axios'
import { ApiPath } from '~/router/path'
import { FeatureAttributes } from 'Models/feature'
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
      const response: AxiosResponse<ServerRecordResponse<FeatureAttributes>> = await securedAxiosInstance.get(ApiPath.feature(key))

      commit(FeatureMutationTypes.ADD, response.data)
      return response
    } catch (err) {
      commit(FeatureMutationTypes.ADD, { key, state: "off" })
    }
  }
}

export default actions
