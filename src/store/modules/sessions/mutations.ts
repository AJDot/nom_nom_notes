import { Getter, MutationTree } from 'vuex'
import { SessionsState, RootState } from '~/store/interfaces'

export enum SessionMutationTypes {
}

type SessionMutations = { [key in SessionMutationTypes]: Getter<SessionsState, RootState> }

const mutations: MutationTree<SessionsState> & SessionMutations = {
}

export default mutations
