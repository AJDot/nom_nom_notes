import { AxiosResponse } from 'axios'
import { RootState, SignupsState } from '~/store/interfaces'
import { Action, ActionTree } from 'vuex'
import RoutePath from '~/router/path'
import { plainAxiosInstance } from '~/backend/axios'
import { StoreModulePath } from '~/store'
import { SessionMutationTypes } from '~/store/modules/sessions/mutations'
import { UserActionTypes } from '~/store/modules/users/actions'

export enum SignupActionTypes {
  CREATE = 'CREATE',
}

type SignupActions = {
  [key in SignupActionTypes]: Action<SignupsState, RootState>;
}

const actions: ActionTree<SignupsState, RootState> & SignupActions = {
  async [SignupActionTypes.CREATE]({
    commit,
    dispatch,
  }, payload: { email: string, password: string, passwordConfirmation: string, username: string }): Promise<AxiosResponse> {
    const response = await plainAxiosInstance.post(RoutePath.signup(), payload)
    if (response.data.csrf) {
      commit(StoreModulePath.Session + SessionMutationTypes.SIGN_IN, response.data.csrf, { root: true })
      dispatch(StoreModulePath.Users + UserActionTypes.FETCH_CURRENT, null, { root: true })
    }
    return response
  },
}

export default actions
