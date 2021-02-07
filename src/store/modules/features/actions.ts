import { Action, ActionContext, ActionTree } from 'vuex'
import { FeaturesState, RootState } from '~/store/interfaces'
import { AxiosResponse } from 'axios'
import { ServerResponse } from 'Interfaces/serverInterfaces'
import { securedAxiosInstance } from '~/backend/axios'
import RoutePath from '~/router/path'
import { FeatureAttributes } from 'Models/feature'
import { FeatureMutationTypes } from '~/store/modules/features/mutations'

export enum FeatureActionTypes {
  FETCH = 'FETCH',
}

type FeatureActions = {
  [key in FeatureActionTypes]: Action<FeaturesState, RootState>;
}

const actions: ActionTree<FeaturesState, RootState> & FeatureActions = {
  async [FeatureActionTypes.FETCH]({ commit }: ActionContext<FeaturesState, RootState>, { key }: { key: string }) {
    const response: AxiosResponse<ServerResponse<FeatureAttributes>> = await securedAxiosInstance.get(RoutePath.apiBase() + RoutePath.feature(key))

    commit(FeatureMutationTypes.ADD, response.data)
    return response
  },
}

export default actions
