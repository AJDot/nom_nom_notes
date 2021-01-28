import { Mutation, MutationTree } from 'vuex'
import { SignupsState } from '~/store/interfaces'

export enum SignupMutationTypes {
}

type SignupMutations = {
  [key in SignupMutationTypes]: Mutation<SignupsState>;
}

const mutations: MutationTree<SignupsState> & SignupMutations = {
}

export default mutations
