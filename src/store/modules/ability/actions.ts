import { Action, ActionContext, ActionTree } from 'vuex'
import { AbilityRules } from '~/appAbility'
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
    const response = await fetch(ApiPath.base() + ApiPath.currentAbility() + '?' + new URLSearchParams({ user_id: user?.clientId.toString() }), {
      headers: {"Content-Type": "application/json"},
    })
    if (!response.ok) return response

    const json: AbilityRules = await response.json()
    commit(AbilityMutationTypes.SET, json)
    return response
  },
}

export default actions
