import { Action, ActionContext, ActionTree } from 'vuex'
import { RecipesState, RootState } from '~/store/interfaces'
import Recipe, { RecipeAttributes } from 'Models/recipe'
import RoutePath from '~/router/path'
import { ServerData, ServerResponse } from 'Interfaces/server_interfaces'
import { RecipeMutationTypes } from '~/store/modules/recipes/mutations'
import { securedAxiosInstance } from '~/backend/axios'
import { AxiosResponse } from 'axios'
import { StoreUtils } from '~/utils/storeUtils'

export enum RecipeActionTypes {
  FETCH = 'FETCH',
  FETCH_ALL = 'FETCH_ALL',
  FIND_OR_FETCH = 'FIND_OR_FETCH',
  CREATE = 'CREATE',
  DESTROY = 'DESTROY',
}

type RecipeActions = {
  [key in RecipeActionTypes]: Action<RecipesState, RootState>;
}

const actions: ActionTree<RecipesState, RootState> & RecipeActions = {
  async [RecipeActionTypes.FETCH]({ commit }: ActionContext<RecipesState, RootState>, id: string) {
    const response: AxiosResponse<ServerResponse<RecipeAttributes>> = await securedAxiosInstance.get(RoutePath.apiBase() + RoutePath.recipe(id))

    commit(RecipeMutationTypes.ADD, {
      id: response.data.data.id,
      ...response.data.data.attributes,
    })
    await StoreUtils.processIncluded(Recipe, response.data.included)
    return response
  },
  async [RecipeActionTypes.FETCH_ALL]({ commit }: ActionContext<RecipesState, RootState>) {
    const response: AxiosResponse<ServerResponse<RecipeAttributes, Array<ServerData>>> = await securedAxiosInstance.get(RoutePath.apiBase() + RoutePath.recipes())
    commit(
      RecipeMutationTypes.SET,
      response.data.data.map((x) => {
        return { id: x.id, ...x.attributes }
      }),
    )
    await StoreUtils.processIncluded(Recipe, response.data.included)
    return response
  },
  async [RecipeActionTypes.FIND_OR_FETCH]({ dispatch }: ActionContext<RecipesState, RootState>, id: string): Promise<Recipe | null> {
    const recipe = Recipe.find(id)
    if (recipe) {
      return Promise.resolve(recipe)
    } else {
      await dispatch(RecipeActionTypes.FETCH, id)
      return Promise.resolve(Recipe.find(id))
    }
  },
  async [RecipeActionTypes.CREATE](_store: ActionContext<RecipesState, RootState>, recipe: Recipe): Promise<AxiosResponse<ServerResponse<RecipeAttributes>>> {
    const response: AxiosResponse<ServerResponse<RecipeAttributes>> = await securedAxiosInstance.post(RoutePath.apiBase() + RoutePath.recipes(), {
      recipe: recipe.$toJson(),
    })
    await recipe.$update({ data: response.data.data.attributes })
    return response
  },
  async [RecipeActionTypes.DESTROY](_store: ActionContext<RecipesState, RootState>, recipe: Recipe): Promise<AxiosResponse<ServerResponse<RecipeAttributes>>> {
    const response: AxiosResponse<ServerResponse<RecipeAttributes>> = await securedAxiosInstance.delete(RoutePath.apiBase() + RoutePath.recipe(recipe.clientId))
    await recipe.$delete()
    return response
  },
}

export default actions
