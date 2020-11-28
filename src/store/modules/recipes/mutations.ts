import { MutationTree } from 'vuex'
import { PersistenceState } from '~/store/interfaces'
import Recipe from 'Models/recipe'
import { ArrayUtils } from '~/utils/arrayUtils'

const mutations: MutationTree<PersistenceState<Recipe>> = {
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
