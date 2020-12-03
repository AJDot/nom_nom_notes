import { Mutation, MutationTree } from 'vuex'
import Recipe from 'Models/recipe'
import { ArrayUtils } from '~/utils/arrayUtils'
import { RecipesState } from '~/store/interfaces'

export enum RecipeMutationTypes {
  SET = 'SET',
  ADD = 'ADD',
}

type RecipeMutations = { [key in RecipeMutationTypes]: Mutation<RecipesState> }

const mutations: MutationTree<RecipesState> & RecipeMutations = {
  [RecipeMutationTypes.SET](state, recipes) {
    state.all = recipes
  },
  [RecipeMutationTypes.ADD](state, recipes: Recipe | Array<Recipe>) {
    ArrayUtils.wrap(recipes).forEach(recipe => {
      const foundRecipe = state.all.find(c => c.id === recipe.id)
      if (foundRecipe) {
        foundRecipe.loadFromModel(recipe)
      } else {
        state.all.push(recipe)
      }
    })
  },
}

export default mutations
