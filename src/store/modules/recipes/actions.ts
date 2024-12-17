import { ServerRecordData, ServerRecordResponse } from 'Interfaces/serverInterfaces'
import Recipe, { RecipeAttributes } from 'Models/recipe'
import { Action, ActionContext, ActionTree } from 'vuex'
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
    const response = await fetch(ApiPath.base() + ApiPath.recipe(id), {
      headers: { "Content-Type": "application/json" },
    })
    const responseClone = response.clone()
    const json: ServerRecordResponse<RecipeAttributes> = await response.json()
    if (!json) throw new Error('Recipe not found')

    commit(RecipeMutationTypes.ADD, {
      id: json.data.id,
      ...json.data.attributes,
    })
    const recipe = Recipe.find(json.data.attributes.clientId!)!
    await StoreUtils.processIncluded(recipe, json.included, json.data.relationships)
    return responseClone
  },
  async [RecipeActionTypes.FETCH_ALL]({ commit }: ActionContext<RecipesState, RootState>) {
    const response = await fetch(ApiPath.base() + ApiPath.recipes(), {
      headers: { "Content-Type": "application/json" },
    })
    const responseClone = response.clone()
    const json: ServerRecordResponse<RecipeAttributes, Array<ServerRecordData<RecipeAttributes>>> = await response.json()
    commit(
      RecipeMutationTypes.SET,
      json.data.map((x) => {
        return { id: x.id, ...x.attributes }
      }),
    )
    await Promise.all(json.data.map(datum => {
      return StoreUtils.processIncluded(Recipe.find(datum.attributes.clientId!)!, json.included, datum.relationships)
    }))
    return responseClone
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
  async [RecipeActionTypes.CREATE](_store: ActionContext<RecipesState, RootState>, recipe: Recipe): Promise<Response> {
    const response = await fetch(ApiPath.base() + ApiPath.recipes(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ recipe: recipe.$toJson(), }),
    })
    console.log('a')
    if (!response.ok) return response

    const responseClone = response.clone()
    const json: ServerRecordResponse<RecipeAttributes> = await response.json()
    recipe.id = json.data.id
    await recipe.$update({ data: { id: recipe.id, ...json.data.attributes } })
    return responseClone
  },
  async [RecipeActionTypes.UPDATE](_store: ActionContext<RecipesState, RootState>, recipe: Recipe): Promise<Response> {
    const response = await fetch(ApiPath.base() + ApiPath.recipe(recipe.clientId), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ recipe: recipe.$toJson(), }),
    })
    if (!response.ok) return response

    const responseClone = response.clone()
    const json: ServerRecordResponse<RecipeAttributes> = await response.json()

    if (!json.error) {
      await recipe.save()
    }
    return responseClone
  },
  async [RecipeActionTypes.DESTROY](_store: ActionContext<RecipesState, RootState>, recipe: Recipe): Promise<Response> {
    const response = await fetch(ApiPath.base() + ApiPath.recipe(recipe.clientId), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
    if (!response.ok) return response

    await recipe.$delete()
    return response
  },
}

export default actions
