import { Mutation, MutationTree } from 'vuex'
import { AbilityState } from '~/store/interfaces'
import { AbilityRules } from '~/appAbility'

export enum AbilityMutationTypes {
  SET = 'SET',
}

type AbilityMutations = { [key in AbilityMutationTypes]: Mutation<AbilityState> }

const mutations: MutationTree<AbilityState> & AbilityMutations = {
  async [AbilityMutationTypes.SET](state, rules: AbilityRules) {
    state.ability.update(rules)
  },
}

export default mutations
