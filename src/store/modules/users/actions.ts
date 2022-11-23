import { Action, ActionContext, ActionTree } from 'vuex'
import { UsersState, RootState } from '~/store/interfaces'
import { AxiosResponse } from 'axios'
import { ServerResponse } from 'Interfaces/serverInterfaces'
import { securedAxiosInstance } from '~/backend/axios'
import { ApiPath } from '~/router/path'
import { UserMutationTypes } from '~/store/modules/users/mutations'
import { UserAttributes } from 'Models/user'

export enum UserActionTypes {
  FETCH_CURRENT = 'FETCH_CURRENT',
}

type UserActions = {
  [key in UserActionTypes]: Action<UsersState, RootState>;
}

const actions: ActionTree<UsersState, RootState> & UserActions = {
  async [UserActionTypes.FETCH_CURRENT]({ commit }: ActionContext<UsersState, RootState>) {
    const response: AxiosResponse<ServerResponse<UserAttributes>> = await securedAxiosInstance.get(ApiPath.base() + ApiPath.currentUser())

    commit(UserMutationTypes.SET_CURRENT, {
      id: response.data.data.id,
      ...response.data.data.attributes,
    })
    return response
  },
}

export default actions
