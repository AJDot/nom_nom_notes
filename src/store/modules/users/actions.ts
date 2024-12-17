import { Collection } from '@vuex-orm/core'
import User from 'Models/user'
import { Action, ActionContext, ActionTree } from 'vuex'
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
  async [UserActionTypes.FETCH_CURRENT]({ commit, state }: ActionContext<UsersState, RootState>) {
    if (state.fetchCurrentPromise) return state.fetchCurrentPromise

    const actionPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(
          ApiPath.base() + ApiPath.currentUser(),
          {
            method: 'GET',
            credentials: "include", // include cookies on cross-origin requests
            headers: { "Content-Type": "application/json" },
          }
        )
        if (!response.ok) {
          commit(UserMutationTypes.UNSET_CURRENT)
          commit(UserMutationTypes.SET_FETCH_CURRENT_PROMISE, null)
          return resolve(response)
        }

        const responseClone = response.clone()
        const json = await response.json()
        const userData = { id: json.data.id, ...json.data.attributes }
        const updateResponse: Record<string, Collection<User>> = await User.insertOrUpdate<typeof User>({ data: userData }) as Record<string, Collection<User>>
        commit(UserMutationTypes.SET_CURRENT, updateResponse[User.entity][0])
        commit(UserMutationTypes.SET_FETCH_CURRENT_PROMISE, null)
        resolve(responseClone)
      } catch (e: any) {
        Logger.error(e.message)
        reject(e)
      }
    })

    commit(UserMutationTypes.SET_FETCH_CURRENT_PROMISE, actionPromise)
    return actionPromise
  },
}

export default actions
