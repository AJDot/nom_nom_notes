import { Collection } from '@vuex-orm/core'
import { AxiosResponse } from 'axios'
import { ServerRecordResponse } from 'Interfaces/serverInterfaces'
import User, { UserAttributes } from 'Models/user'
import { Action, ActionContext, ActionTree } from 'vuex'
import { securedAxiosInstance } from '~/backend/axios'
import { ApiPath } from '~/router/path'
import { RootState, UsersState } from '~/store/interfaces'
import { UserMutationTypes } from '~/store/modules/users/mutations'
import Logger from '~/utils/logger'

export enum UserActionTypes {
  FETCH_CURRENT = 'FETCH_CURRENT',
}

type UserActions = {
  [key in UserActionTypes]: Action<UsersState, RootState>
}

const actions: ActionTree<UsersState, RootState> & UserActions = {
  async [UserActionTypes.FETCH_CURRENT]({ commit }: ActionContext<UsersState, RootState>) {
    try {
      const response: AxiosResponse<ServerRecordResponse<UserAttributes>> = await securedAxiosInstance.get(ApiPath.base() + ApiPath.currentUser())
      const userData = { id: response.data.data.id, ...response.data.data.attributes }
      const updateResponse: Record<string, Collection<User>> = await User.insertOrUpdate<typeof User>({ data: userData }) as Record<string, Collection<User>>
      commit(UserMutationTypes.SET_CURRENT, updateResponse[User.entity][0])
      return response
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      Logger.error(e.message)
    }
  },
}

export default actions
