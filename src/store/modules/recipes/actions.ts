import { ActionContext, ActionTree } from 'vuex'
import { RecipesState, RootState } from '~/store/interfaces'
import Recipe from 'Models/recipe'
import AjaxRequest from '~/services/ajaxRequest'
import Path from '~/router/path'
import { Response } from 'Interfaces/server_interfaces'

interface RecipeResponse extends Response {
  recipe: Recipe
}

interface RecipesResponse extends Response {
  recipes: Array<Recipe>
}

const actions: ActionTree<RecipesState, RootState> = {
  async fetch({ commit }: ActionContext<RecipesState, RootState>, id: string) {
    const [result, statusText, xhr] = await new AjaxRequest({
      url: Path.apiBase() + Path.recipe(id),
      type: 'GET',
      dataType: 'json',
    }).send<RecipeResponse>()
    commit('add', new Recipe(result.recipe))
    return [result, statusText, xhr]
  },
  async fetchAll({ commit }: ActionContext<RecipesState, RootState>) {
    const [result, statusText, xhr] = await new AjaxRequest({
      url: Path.apiBase() + Path.recipes(),
      type: 'GET',
      dataType: 'json',
    }).send<RecipesResponse>()
    commit('set', result.recipes.map(x => new Recipe(x)))
    return [result, statusText, xhr]
  },
  async findOrFetch({ commit, getters, dispatch }: ActionContext<RecipesState, RootState>, id: string) {
    const recipe = getters.find(id)
    if (recipe) {
      return Promise.resolve(recipe)
    } else {
      return dispatch('fetch', id)
    }
  },
}

export default actions
