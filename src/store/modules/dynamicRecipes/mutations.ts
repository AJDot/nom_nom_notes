import { Mutation, MutationTree } from 'vuex'
import DynamicRecipe from 'Models/dynamicRecipe'
import { ArrayUtils } from '~/utils/arrayUtils'
import { DynamicRecipesState } from '~/store/interfaces'
import { RRecord } from 'Interfaces/modelInterfaces'

export enum DynamicRecipeMutationTypes {
  SET = 'SET',
  ADD = 'ADD',
}

type DynamicRecipeMutations = { [key in DynamicRecipeMutationTypes]: Mutation<DynamicRecipesState> }

const mutations: MutationTree<DynamicRecipesState> & DynamicRecipeMutations = {
  async [DynamicRecipeMutationTypes.SET](state, dynamicRecipes: RRecord[]) {
    dynamicRecipes = ArrayUtils.wrap(dynamicRecipes)
    // delete all recipes that don't match the incoming ids
    DynamicRecipe.query()
      .where((dynamicRecipe: DynamicRecipe) => {
        return !dynamicRecipes.some((r) => r.clientId === dynamicRecipe.clientId)
      })
      .get()
      .forEach((dynamicRecipe) => dynamicRecipe.$delete())
    await DynamicRecipe.insertOrUpdate({ data: dynamicRecipes })
  },
  async [DynamicRecipeMutationTypes.ADD](state, dynamicRecipes: RRecord | Array<RRecord>) {
    await DynamicRecipe.insertOrUpdate({ data: dynamicRecipes })
  },
}

export default mutations
