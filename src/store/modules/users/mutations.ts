import User from 'Models/user'
import { Mutation, MutationTree } from 'vuex'
import { UsersState } from '~/store/interfaces'


export enum UserMutationTypes {
SET_CURRENT = 'SET_CURRENT',
UNSET_CURRENT = 'UNSET_CURRENT',
SET_FETCH_CURRENT_PROMISE = "SET_FETCH_CURRENT_PROMISE"
}

type UserMutations = { [key in UserMutationTypes]: Mutation<UsersState> }

const mutations: MutationTree<UsersState> & UserMutations = {
  async [UserMutationTypes.SET_CURRENT](state, user: User) {
    state.current = user
  },
  async [UserMutationTypes.UNSET_CURRENT](state) {
    state.current = null
  },
  [UserMutationTypes.SET_FETCH_CURRENT_PROMISE](state, promise) {
    state.fetchCurrentPromise = promise
  }
}

export default mutations
