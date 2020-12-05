import { Action, ActionContext, ActionTree } from 'vuex'
import { RecipesState, RootState } from '~/store/interfaces'
import Recipe from 'Models/recipe'
import AjaxRequest from '~/services/ajaxRequest'
import Path from '~/router/path'
import { ModelData, ModelResponse } from 'Interfaces/server_interfaces'
import { StoreModuleTypes } from '~/store'
import { RecipeMutationTypes } from '~/store/modules/recipes/mutations'

export enum RecipeActionTypes {
  FETCH = 'FETCH',
  FETCH_ALL = 'FETCH_ALL',
  FIND_OR_FETCH = 'FIND_OR_FETCH',
}

type RecipeActions = { [key in RecipeActionTypes]: Action<RecipesState, RootState> }

const actions: ActionTree<RecipesState, RootState> & RecipeActions = {
  async [RecipeActionTypes.FETCH]({ commit }: ActionContext<RecipesState, RootState>, id: string) {
    const [result, statusText, xhr] = await new AjaxRequest({
      url: Path.apiBase() + Path.recipe(id),
      type: 'GET',
      dataType: 'json',
    }).send<ModelResponse>()
    commit(RecipeMutationTypes.ADD, new Recipe({ id: result.data.id, ...result.data.attributes }))
    return [result, statusText, xhr]
  },
  async [RecipeActionTypes.FETCH_ALL]({ commit }: ActionContext<RecipesState, RootState>) {
    const [result, statusText, xhr] = await new AjaxRequest({
      url: Path.apiBase() + Path.recipes(),
      type: 'GET',
      dataType: 'json',
    }).send<ModelResponse<ModelData[]>>()
    commit(RecipeMutationTypes.SET, result.data.map(x => new Recipe({ id: x.id, ...x.attributes })))
    return [result, statusText, xhr]
  },
  async [RecipeActionTypes.FIND_OR_FETCH]({
                                            commit,
                                            getters,
                                            dispatch,
                                          }: ActionContext<RecipesState, RootState>, id: string) {
    const recipe = getters.find(id)
    if (recipe) {
      return Promise.resolve(recipe)
    } else {
      return dispatch(StoreModuleTypes.Recipes + RecipeActionTypes.FETCH, id)
    }
  },
}

export default actions
