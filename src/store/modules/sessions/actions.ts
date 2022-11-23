import { Action, ActionTree } from 'vuex'
import { RootState, SessionsState } from '~/store/interfaces'
import { ApiPath } from '~/router/path'
import { plainAxiosInstance, securedAxiosInstance } from '~/backend/axios'
import { AxiosResponse } from 'axios'
import { SessionMutationTypes } from '~/store/modules/sessions/mutations'
import { HttpStatusCode } from '~/utils/httpUtils'
import { UserActionTypes } from '~/store/modules/users/actions'
import { UserMutationTypes } from '~/store/modules/users/mutations'
import { StoreModulePath } from '~/store'

export enum SessionActionTypes {
  CREATE = 'CREATE',
  DESTROY = 'DESTROY',
}

type SessionActions = {
  [key in SessionActionTypes]: Action<SessionsState, RootState>;
}

const actions: ActionTree<SessionsState, RootState> & SessionActions = {
  async [SessionActionTypes.CREATE]({
    commit,
    dispatch,
  }, payload: { email: string, password: string }): Promise<AxiosResponse> {
    const response = await plainAxiosInstance.post(ApiPath.signin(), payload)
    if (response.data.csrf) {
      commit(SessionMutationTypes.SIGN_IN, response.data.csrf)
      dispatch(StoreModulePath.Users + UserActionTypes.FETCH_CURRENT, null, { root: true })
    }
    return response
  },
  async [SessionActionTypes.DESTROY]({ commit }): Promise<AxiosResponse> {
    const response = await securedAxiosInstance.delete(ApiPath.signin())
    if (response.status === HttpStatusCode.Ok) {
      commit(SessionMutationTypes.SIGN_OUT)
      commit(StoreModulePath.Users + UserMutationTypes.UNSET_CURRENT, null, { root: true })
    }
    return response
  },
}

export default actions
