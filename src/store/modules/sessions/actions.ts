import { Action, ActionTree } from 'vuex'
import { RootState, SessionsState } from '~/store/interfaces'
import RoutePath from '~/router/path'
import { plainAxiosInstance } from '~/backend/axios'
import { AxiosResponse } from 'axios'

export enum SessionActionTypes {
  CREATE = 'CREATE',
}

type SessionActions = {
  [key in SessionActionTypes]: Action<SessionsState, RootState>;
}

const actions: ActionTree<SessionsState, RootState> & SessionActions = {
  async [SessionActionTypes.CREATE](_store, payload: {email: string, password: string}): Promise<AxiosResponse> {
    return plainAxiosInstance
      .post(RoutePath.signin(), payload)
  },
}

export default actions
