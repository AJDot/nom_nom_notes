import { Mutation, MutationTree } from 'vuex'
import User from 'Models/user'
import { UsersState } from '~/store/interfaces'
import { RRecord } from 'Interfaces/modelInterfaces'
import { Collection } from '@vuex-orm/core'
import { Hash } from 'Interfaces/utilInterfaces'

export enum UserMutationTypes {
  SET_CURRENT = 'SET_CURRENT',
  UNSET_CURRENT = 'UNSET_CURRENT',
}

type UserMutations = { [key in UserMutationTypes]: Mutation<UsersState> }

const mutations: MutationTree<UsersState> & UserMutations = {
  async [UserMutationTypes.SET_CURRENT](state, user: RRecord) {
    const response: Hash<Collection<User>> = await User.insertOrUpdate<typeof User>({ data: user }) as Hash<Collection<User>>
    state.current = response[User.entity][0]
  },
  async [UserMutationTypes.UNSET_CURRENT](state) {
    state.current = null
  },
}

export default mutations
