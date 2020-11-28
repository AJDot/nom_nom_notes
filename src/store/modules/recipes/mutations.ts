import { MutationTree } from 'vuex'
import Recipe from 'Models/recipe'
import { ArrayUtils } from '~/utils/arrayUtils'
import { RecipesState } from '~/store/interfaces'

const mutations: MutationTree<RecipesState> = {
  set(state, recipes) {
    state.all = recipes
  },
  add(state, recipes: Recipe | Array<Recipe>) {
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
