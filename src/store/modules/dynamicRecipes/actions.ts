import { AxiosResponse } from 'axios'
import { ServerData, ServerResponse } from 'Interfaces/serverInterfaces'
import DynamicRecipe, { DynamicRecipeAttributes } from 'Models/dynamicRecipe'
import { Action, ActionContext, ActionTree } from 'vuex'
import { securedAxiosInstance } from '~/backend/axios'
import { ApiPath } from '~/router/path'
import { DynamicRecipesState, RootState } from '~/store/interfaces'
import { DynamicRecipeMutationTypes } from '~/store/modules/dynamicRecipes/mutations'
import { StoreUtils } from '~/utils/storeUtils'

export enum DynamicRecipeActionTypes {
  FETCH = 'FETCH',
  FETCH_ALL = 'FETCH_ALL',
  FIND_OR_FETCH = 'FIND_OR_FETCH',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DESTROY = 'DESTROY',
}

type DynamicRecipeActions = {
  [key in DynamicRecipeActionTypes]: Action<DynamicRecipesState, RootState>
}

const actions: ActionTree<DynamicRecipesState, RootState> & DynamicRecipeActions = {
  async [DynamicRecipeActionTypes.FETCH]({ commit }: ActionContext<DynamicRecipesState, RootState>, id: string) {
    try {
      const response: AxiosResponse<ServerResponse<DynamicRecipeAttributes>> = await securedAxiosInstance.get(ApiPath.base() + ApiPath.dynamicRecipe(id))
      if (!response.data) throw new Error('Dynamic Recipe not found')

      commit(DynamicRecipeMutationTypes.ADD, {
        id: response.data.data.id,
        ...response.data.data.attributes,
      })
      await StoreUtils.processIncluded(DynamicRecipe, response.data.included, response.data.data.relationships)
      return response
    } catch (err) {
      throw err
    }
  },
  async [DynamicRecipeActionTypes.FETCH_ALL]({ commit }: ActionContext<DynamicRecipesState, RootState>) {
    const response: AxiosResponse<ServerResponse<DynamicRecipeAttributes, Array<ServerData>>> = await securedAxiosInstance.get(ApiPath.base() + ApiPath.dynamicRecipes())
    commit(
      DynamicRecipeMutationTypes.SET,
      response.data.data.map((x) => {
        return { id: x.id, ...x.attributes }
      }),
    )
    await Promise.all(response.data.data.map(datum => StoreUtils.processIncluded(DynamicRecipe, response.data.included, datum.relationships)))
    return response
  },
  async [DynamicRecipeActionTypes.FIND_OR_FETCH]({ dispatch }: ActionContext<DynamicRecipesState, RootState>, id: string): Promise<DynamicRecipe | null> {
    const dynamicRecipe = DynamicRecipe.find(id)
    if (dynamicRecipe) {
      return Promise.resolve(dynamicRecipe)
    } else {
      await dispatch(DynamicRecipeActionTypes.FETCH, id)
      return Promise.resolve(DynamicRecipe.find(id))
    }
  },
  async [DynamicRecipeActionTypes.CREATE](_store: ActionContext<DynamicRecipesState, RootState>, dynamicRecipe: DynamicRecipe): Promise<AxiosResponse<ServerResponse<DynamicRecipeAttributes>>> {
    const response: AxiosResponse<ServerResponse<DynamicRecipeAttributes>> = await securedAxiosInstance.post(ApiPath.base() + ApiPath.dynamicRecipes(), {
      dynamicRecipe: dynamicRecipe.$toJson(),
    })
    dynamicRecipe.id = response.data.data.id
    await dynamicRecipe.$insertOrUpdate({ data: { id: dynamicRecipe.id, ...response.data.data.attributes } })
    return response
  },
  async [DynamicRecipeActionTypes.UPDATE](_store: ActionContext<DynamicRecipesState, RootState>, dynamicRecipe: DynamicRecipe): Promise<AxiosResponse<ServerResponse<DynamicRecipeAttributes>>> {
    const response: AxiosResponse<ServerResponse<DynamicRecipeAttributes>> = await securedAxiosInstance.patch(ApiPath.base() + ApiPath.dynamicRecipe(dynamicRecipe.clientId), {
      dynamicRecipe: dynamicRecipe.$toJson(),
    })

    if (!response.data.error) {
      await dynamicRecipe.save()
    }
    return response
  },
  async [DynamicRecipeActionTypes.DESTROY](_store: ActionContext<DynamicRecipesState, RootState>, dynamicRecipe: DynamicRecipe): Promise<AxiosResponse<ServerResponse<DynamicRecipeAttributes>>> {
    const response: AxiosResponse<ServerResponse<DynamicRecipeAttributes>> = await securedAxiosInstance.delete(ApiPath.base() + ApiPath.dynamicRecipe(dynamicRecipe.clientId))
    await dynamicRecipe.$delete()
    return response
  },
}

export default actions
