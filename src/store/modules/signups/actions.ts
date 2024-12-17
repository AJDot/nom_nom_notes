import { Action, ActionTree } from 'vuex'
import { AuthPath } from '~/router/path'
import { StoreModulePath } from '~/store'
import { RootState, SignupsState } from '~/store/interfaces'
import { UserActionTypes } from '~/store/modules/users/actions'
import { AbilityActionTypes } from '../ability/actions'

export enum SignupActionTypes {
  CREATE = 'CREATE',
}

type SignupActions = {
  [key in SignupActionTypes]: Action<SignupsState, RootState>
}

const actions: ActionTree<SignupsState, RootState> & SignupActions = {
  async [SignupActionTypes.CREATE]({
    commit,
    dispatch,
    rootState,
  }, payload: { email: string, password: string, passwordConfirmation: string, username: string }): Promise<Response> {
    const response = await fetch(AuthPath.base() + AuthPath.signup(), {
      method: 'POST',
      credentials: "include", // include cookies on cross-origin requests
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    await dispatch(StoreModulePath.Users + UserActionTypes.FETCH_CURRENT, null, { root: true })
    dispatch(StoreModulePath.Ability + AbilityActionTypes.FETCH, { user: rootState.users.current }, { root: true })
    return response
  },
}

export default actions
