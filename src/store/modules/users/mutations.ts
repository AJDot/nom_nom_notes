import { Collection } from '@vuex-orm/core'
import { RRecord } from 'Interfaces/modelInterfaces'
import User from 'Models/user'
import { Mutation, MutationTree } from 'vuex'
import { UsersState } from '~/store/interfaces'

export enum UserMutationTypes {
  SET_CURRENT = 'SET_CURRENT',
  UNSET_CURRENT = 'UNSET_CURRENT',
}

type UserMutations = { [key in UserMutationTypes]: Mutation<UsersState> }

const mutations: MutationTree<UsersState> & UserMutations = {
  async [UserMutationTypes.SET_CURRENT](state, user: User) {
    state.current = user
  },
  async [UserMutationTypes.UNSET_CURRENT](state) {
    state.current = null
  },
}

export default mutations
