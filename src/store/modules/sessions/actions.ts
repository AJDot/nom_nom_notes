import { Action, ActionTree } from 'vuex'
import { AuthPath } from '~/router/path'
import { StoreModulePath } from '~/store'
import { RootState, SessionsState } from '~/store/interfaces'
import { UserActionTypes } from '~/store/modules/users/actions'
import { UserMutationTypes } from '~/store/modules/users/mutations'
import { AbilityActionTypes } from '../ability/actions'

export enum SessionActionTypes {
  CREATE = 'CREATE',
  DESTROY = 'DESTROY',
}

type SessionActions = {
  [key in SessionActionTypes]: Action<SessionsState, RootState>
}

const actions: ActionTree<SessionsState, RootState> & SessionActions = {
  async [SessionActionTypes.CREATE]({
    commit,
    dispatch,
    rootState,
  }, payload: { email: string, password: string }): Promise<Response> {
    const response = await fetch(AuthPath.base() + AuthPath.signin(), {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload)
    })
    if (!response.ok) return response

    await dispatch(StoreModulePath.Users + UserActionTypes.FETCH_CURRENT, null, { root: true })
    dispatch(StoreModulePath.Ability + AbilityActionTypes.FETCH, { user: rootState.users.current }, { root: true })
    return response
  },
  async [SessionActionTypes.DESTROY]({ commit, dispatch, rootState }): Promise<Response> {
    const response = await fetch(AuthPath.base() + AuthPath.signout(), {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
    commit(StoreModulePath.Users + UserMutationTypes.UNSET_CURRENT, null, { root: true })
    dispatch(StoreModulePath.Ability + AbilityActionTypes.FETCH, { user: rootState.users.current }, { root: true })
    return response
  },
}

export default actions
