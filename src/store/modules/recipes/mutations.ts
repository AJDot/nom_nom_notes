import { Mutation, MutationTree } from 'vuex'
import Recipe from 'Models/recipe'
import { ArrayUtils } from '~/utils/arrayUtils'
import { RecipesState } from '~/store/interfaces'
import { RRecord } from 'Interfaces/model_interfaces'

export enum RecipeMutationTypes {
  SET = 'SET',
  ADD = 'ADD',
}

type RecipeMutations = { [key in RecipeMutationTypes]: Mutation<RecipesState> }

const mutations: MutationTree<RecipesState> & RecipeMutations = {
  async [RecipeMutationTypes.SET](state, recipes: RRecord[]) {
    recipes = ArrayUtils.wrap(recipes)
    await Recipe.insert({
      data: {
        id: 'abc',
        name: '123',
      },
    })
    // delete all recipes that don't match the incoming ids
    Recipe.query()
      .where((recipe: Recipe) => {
        return !recipes.some((r) => r.id === recipe.id)
      })
      .get()
      .forEach((recipe) => recipe.$delete())
    await Recipe.insertOrUpdate({ data: recipes })
  },
  async [RecipeMutationTypes.ADD](state, recipes: RRecord | Array<RRecord>) {
    await Recipe.insertOrUpdate({ data: recipes })
  },
}

export default mutations
