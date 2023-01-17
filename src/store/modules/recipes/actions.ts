import { AxiosResponse } from 'axios'
import { ServerRecordData, ServerRecordResponse } from 'Interfaces/serverInterfaces'
import Recipe, { RecipeAttributes } from 'Models/recipe'
import { Action, ActionContext, ActionTree } from 'vuex'
import { securedAxiosInstance } from '~/backend/axios'
import { ApiPath } from '~/router/path'
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
      const response: AxiosResponse<ServerRecordResponse<RecipeAttributes>> = await securedAxiosInstance.get(ApiPath.base() + ApiPath.recipe(id))
      if (!response.data) throw new Error('Recipe not found')

      commit(RecipeMutationTypes.ADD, {
        id: response.data.data.id,
        ...response.data.data.attributes,
      })
      const recipe = Recipe.find(response.data.data.attributes.clientId!)!
      await StoreUtils.processIncluded(recipe, response.data.included, response.data.data.relationships)
      return response
    } catch (err) {
      throw err
    }
  },
  async [RecipeActionTypes.FETCH_ALL]({ commit }: ActionContext<RecipesState, RootState>) {
    const response: AxiosResponse<ServerRecordResponse<RecipeAttributes, Array<ServerRecordData<RecipeAttributes>>>> = await securedAxiosInstance.get(ApiPath.base() + ApiPath.recipes())
    commit(
      RecipeMutationTypes.SET,
      response.data.data.map((x) => {
        return { id: x.id, ...x.attributes }
      }),
    )
    await Promise.all(response.data.data.map(datum => {
      return StoreUtils.processIncluded(Recipe.find(datum.attributes.clientId!)!, response.data.included, datum.relationships)
    }))
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
  async [RecipeActionTypes.CREATE](_store: ActionContext<RecipesState, RootState>, recipe: Recipe): Promise<AxiosResponse<ServerRecordResponse<RecipeAttributes>>> {
    const response: AxiosResponse<ServerRecordResponse<RecipeAttributes>> = await securedAxiosInstance.post(ApiPath.base() + ApiPath.recipes(), {
      recipe: recipe.$toJson(),
    })
    recipe.id = response.data.data.id
    await recipe.$update({ data: { id: recipe.id, ...response.data.data.attributes } })
    return response
  },
  async [RecipeActionTypes.UPDATE](_store: ActionContext<RecipesState, RootState>, recipe: Recipe): Promise<AxiosResponse<ServerRecordResponse<RecipeAttributes>>> {
    const response: AxiosResponse<ServerRecordResponse<RecipeAttributes>> = await securedAxiosInstance.patch(ApiPath.base() + ApiPath.recipe(recipe.clientId), {
      recipe: recipe.$toJson(),
    })

    if (!response.data.error) {
      await recipe.save()
    }
    return response
  },
  async [RecipeActionTypes.DESTROY](_store: ActionContext<RecipesState, RootState>, recipe: Recipe): Promise<AxiosResponse<ServerRecordResponse<RecipeAttributes>>> {
    const response: AxiosResponse<ServerRecordResponse<RecipeAttributes>> = await securedAxiosInstance.delete(ApiPath.base() + ApiPath.recipe(recipe.clientId))
    await recipe.$delete()
    return response
  },
}

export default actions
