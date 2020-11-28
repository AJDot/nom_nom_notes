import { MutationTree } from 'vuex'
import { PersistenceState } from '~/store/interfaces'
import Recipe from 'Models/recipe'

const mutations: MutationTree<PersistenceState<Recipe>> = {
  set(state, recipes) {
    state.all = recipes
  },
  add(state, recipes: Array<Recipe>) {
    recipes.forEach(recipe => {
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
