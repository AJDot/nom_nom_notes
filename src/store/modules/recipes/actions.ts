import { ActionTree } from 'vuex'
import { PersistenceState, RootState } from '~/store/interfaces'
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

const actions: ActionTree<PersistenceState<Recipe>, RootState> = {
  async get({ commit }, id) {
    const [result, statusText, xhr] = await new AjaxRequest({
      url: Path.apiBase() + Path.recipe(id),
      type: 'GET',
      dataType: 'json',
    }).send<RecipeResponse>()
    commit('add', new Recipe(result.recipe))
  },
  async getAll({ commit }) {
    const [result, statusText, xhr] = await new AjaxRequest({
      url: Path.apiBase() + Path.recipes(),
      type: 'GET',
      dataType: 'json',
    }).send<RecipesResponse>()
    commit('set', result.recipes.map(x => new Recipe(x)))
  },
}

export default actions
