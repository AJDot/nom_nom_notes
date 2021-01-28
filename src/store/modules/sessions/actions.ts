import { Action, ActionTree } from 'vuex'
import { RootState, SessionsState } from '~/store/interfaces'
import RoutePath from '~/router/path'
import { plainAxiosInstance, securedAxiosInstance } from '~/backend/axios'
import { AxiosResponse } from 'axios'
import { SessionMutationTypes } from '~/store/modules/sessions/mutations'
import { HttpStatusCode } from '~/utils/httpUtils'

export enum SessionActionTypes {
  CREATE = 'CREATE',
  DESTROY = 'DESTROY',
}

type SessionActions = {
  [key in SessionActionTypes]: Action<SessionsState, RootState>;
}

const actions: ActionTree<SessionsState, RootState> & SessionActions = {
  async [SessionActionTypes.CREATE](_store, payload: {email: string, password: string}): Promise<AxiosResponse> {
    return plainAxiosInstance
      .post(RoutePath.signin(), payload)
  },
  async [SessionActionTypes.DESTROY]({ commit }): Promise<AxiosResponse> {
    const response = await securedAxiosInstance.delete(RoutePath.signin())
    if (response.status === HttpStatusCode.Ok) {
      commit(SessionMutationTypes.SIGN_OUT)
    }
    return response
  },
}

export default actions
