import { AxiosResponse } from 'axios'
import { Action, ActionContext, ActionTree } from 'vuex'
import { AbilityRules } from '~/appAbility'
import { securedAxiosInstance } from '~/backend/axios'
import { ApiPath } from '~/router/path'
import { AbilityState, RootState } from '~/store/interfaces'
import { AbilityMutationTypes } from '~/store/modules/ability/mutations'

export enum AbilityActionTypes {
  FETCH = 'FETCH',
}

type AbilityActions = {
  [key in AbilityActionTypes]: Action<AbilityState, RootState>
}

const actions: ActionTree<AbilityState, RootState> & AbilityActions = {
  async [AbilityActionTypes.FETCH]({ commit }: ActionContext<AbilityState, RootState>, { user }) {
    const response: AxiosResponse<AbilityRules> = await securedAxiosInstance.get(ApiPath.base() + ApiPath.currentAbility(), { params: { user_id: user?.clientId } })

    commit(AbilityMutationTypes.SET, response.data)
    return response
  },
}

export default actions
