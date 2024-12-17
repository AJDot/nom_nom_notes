import { ServerRecordData, ServerRecordResponse } from 'Interfaces/serverInterfaces'
import DynamicRecipe, { DynamicRecipeAttributes } from 'Models/dynamicRecipe'
import { Action, ActionContext, ActionTree } from 'vuex'
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
    const response = await fetch(ApiPath.base() + ApiPath.dynamicRecipe(id), {
      headers: {"Content-Type": "application/json"}
    })
    const responseClone = response.clone()
    const json: ServerRecordResponse<DynamicRecipeAttributes> = await response.json()
    if (!json) throw new Error('Dynamic Recipe not found')

    commit(DynamicRecipeMutationTypes.ADD, {
      id: json.data.id,
      ...json.data.attributes,
    })
    const dynamicRecipe = DynamicRecipe.find(json.data.attributes.clientId!)!
    await StoreUtils.processIncluded(dynamicRecipe, json.included, json.data.relationships)
    return responseClone
  },
  async [DynamicRecipeActionTypes.FETCH_ALL]({ commit }: ActionContext<DynamicRecipesState, RootState>) {
    const response = await fetch(ApiPath.base() + ApiPath.dynamicRecipes(), {
      headers: {"Content-Type": "application/json"},
    })
    const responseClone = response.clone()
    const json: ServerRecordResponse<DynamicRecipeAttributes, Array<ServerRecordData<DynamicRecipeAttributes>>> = await response.json()
    commit(
      DynamicRecipeMutationTypes.SET,
      json.data.map((x) => {
        return { id: x.id, ...x.attributes }
      }),
    )
    await Promise.all(json.data.map(datum => {
      return StoreUtils.processIncluded(DynamicRecipe.find(datum.attributes.clientId!)!, json.included, datum.relationships)
    }))
    return responseClone
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
  async [DynamicRecipeActionTypes.CREATE](_store: ActionContext<DynamicRecipesState, RootState>, dynamicRecipe: DynamicRecipe): Promise<Response> {
    const response = await fetch(ApiPath.base() + ApiPath.dynamicRecipes(), {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify({ dynamicRecipe: dynamicRecipe.$toJson(), }),
    })
    if (!response.ok) return response

    const responseClone = response.clone()
    const json: ServerRecordResponse<DynamicRecipeAttributes> = await response.json()
    dynamicRecipe.id = json.data.id
    await dynamicRecipe.$insertOrUpdate({ data: { id: dynamicRecipe.id, ...json.data.attributes } })
    return responseClone
  },
  async [DynamicRecipeActionTypes.UPDATE](_store: ActionContext<DynamicRecipesState, RootState>, dynamicRecipe: DynamicRecipe): Promise<Response> {
    const response = await fetch(ApiPath.base() + ApiPath.dynamicRecipe(dynamicRecipe.clientId), {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify({ dynamicRecipe: dynamicRecipe.$toJson(), }),
    })
    const responseClone = response.clone()
    const json: ServerRecordResponse<DynamicRecipeAttributes> = await response.json()

    if (!json.error) {
      await dynamicRecipe.save()
      await StoreUtils.processIncluded(dynamicRecipe, json.included, json.data.relationships)
    }
    return responseClone
  },
  async [DynamicRecipeActionTypes.DESTROY](_store: ActionContext<DynamicRecipesState, RootState>, dynamicRecipe: DynamicRecipe): Promise<Response> {
    const response = await fetch(ApiPath.base() + ApiPath.dynamicRecipe(dynamicRecipe.clientId), { 
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      method: "DELETE" ,
    })
    if (!response.ok) return response

    await dynamicRecipe.$delete()
    return response
  },
}

export default actions
