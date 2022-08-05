import { AxiosResponse } from 'axios'
import { ServerData, ServerResponse } from 'Interfaces/serverInterfaces'
import Recipe, { RecipeAttributes } from 'Models/recipe'
import { Action, ActionContext, ActionTree } from 'vuex'
import { securedAxiosInstance } from '~/backend/axios'
import RoutePath from '~/router/path'
import { RecipesState, RootState } from '~/store/interfaces'
import { RecipeMutationTypes } from '~/store/modules/recipes/mutations'
import { StoreUtils } from '~/utils/storeUtils'

export enum RecipeActionTypes {
  FETCH = 'FETCH',
  FETCH_ALL = 'FETCH_ALL',
  FIND_OR_FETCH = 'FIND_OR_FETCH',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DESTROY = 'DESTROY',
}

type RecipeActions = {
  [key in RecipeActionTypes]: Action<RecipesState, RootState>
}

const actions: ActionTree<RecipesState, RootState> & RecipeActions = {
  async [RecipeActionTypes.FETCH]({ commit }: ActionContext<RecipesState, RootState>, id: string) {
    try {
      const response: AxiosResponse<ServerResponse<RecipeAttributes>> = await securedAxiosInstance.get(RoutePath.apiBase() + RoutePath.recipe(id))
      if (!response.data) throw new Error('Recipe not found')

      commit(RecipeMutationTypes.ADD, {
        id: response.data.data.id,
        ...response.data.data.attributes,
      })
      await StoreUtils.processIncluded(Recipe, response.data.included)
      return response
    } catch (err) {
      throw err
    }
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
    recipe.id = response.data.data.id
    await recipe.$update({ data: { id: recipe.id, ...response.data.data.attributes } })
    return response
  },
  async [RecipeActionTypes.UPDATE](_store: ActionContext<RecipesState, RootState>, recipe: Recipe): Promise<AxiosResponse<ServerResponse<RecipeAttributes>>> {
    const response: AxiosResponse<ServerResponse<RecipeAttributes>> = await securedAxiosInstance.patch(RoutePath.apiBase() + RoutePath.recipe(recipe.clientId), {
      recipe: recipe.$toJson(),
    })

    if (!response.data.error) {
      await recipe.save()
    }
    return response
  },
  async [RecipeActionTypes.DESTROY](_store: ActionContext<RecipesState, RootState>, recipe: Recipe): Promise<AxiosResponse<ServerResponse<RecipeAttributes>>> {
    const response: AxiosResponse<ServerResponse<RecipeAttributes>> = await securedAxiosInstance.delete(RoutePath.apiBase() + RoutePath.recipe(recipe.clientId))
    await recipe.$delete()
    return response
  },
}

export default actions
