import { Mutation, MutationTree } from 'vuex'
import { SessionsState } from '~/store/interfaces'

export enum SessionMutationTypes {
}

type SessionMutations = {
  [key in SessionMutationTypes]: Mutation<SessionsState>;
}

const mutations: MutationTree<SessionsState> & SessionMutations = {
}

export default mutations
