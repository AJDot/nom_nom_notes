import { ServerRecordResponse } from 'Interfaces/serverInterfaces'
import ShoppingList, { ShoppingListAttributes } from 'Models/shoppingList'
import { Action, ActionContext, ActionTree } from 'vuex'
import { ApiPath } from '~/router/path'
import { RootState, ShoppingListsState } from '~/store/interfaces'
import { ShoppingListMutationTypes } from '~/store/modules/shoppingLists/mutations'
import { StoreUtils } from '~/utils/storeUtils'

export enum ShoppingListActionTypes {
  FETCH = 'FETCH',
  FIND_OR_FETCH = 'FIND_OR_FETCH',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  CONFIRM_SELECTED = 'CONFIRM_SELECTED',
}

type ShoppingListActions = {
  [key in ShoppingListActionTypes]: Action<ShoppingListsState, RootState>
}

const actions: ActionTree<ShoppingListsState, RootState> & ShoppingListActions = {
  async [ShoppingListActionTypes.FETCH]({ commit, state }: ActionContext<ShoppingListsState, RootState>) {
    const response = await fetch(ApiPath.base() + ApiPath.shoppingLists(), {
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    })
    const responseClone = response.clone()
    const json: ServerRecordResponse<ShoppingListAttributes> = await response.json()
    if (!json) throw new Error('Shopping List not found')

    commit(ShoppingListMutationTypes.ADD, {
      id: json.data.id,
      ...json.data.attributes,
    })
    const shoppingList = ShoppingList.find(json.data.attributes.clientId!)!
    await StoreUtils.processIncluded(shoppingList, json.included, json.data.relationships)
    state.current = shoppingList
    return responseClone
  },
  async [ShoppingListActionTypes.FIND_OR_FETCH]({ dispatch }: ActionContext<ShoppingListsState, RootState>, userId: string): Promise<ShoppingList | null> {
    const shoppingList = ShoppingList.query().where({ userId }).first()
    if (shoppingList) {
      return Promise.resolve(shoppingList)
    } else {
      await dispatch(ShoppingListActionTypes.FETCH)
      return Promise.resolve(ShoppingList.query().where({ userId }).first())
    }
  },
  async [ShoppingListActionTypes.CREATE](_store: ActionContext<ShoppingListsState, RootState>, shoppingList: ShoppingList): Promise<Response> {
    const response = await fetch(ApiPath.base() + ApiPath.shoppingLists(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ shoppingList: shoppingList.$toJson() }),
    })
    const responseClone = response.clone()
    const json: ServerRecordResponse<ShoppingListAttributes> = await response.json()
    shoppingList.id = json.data.id
    await shoppingList.$insertOrUpdate({ data: { id: shoppingList.id, ...json.data.attributes } })
    return responseClone
  },
  async [ShoppingListActionTypes.UPDATE](store: ActionContext<ShoppingListsState, RootState>, shoppingList: ShoppingList): Promise<Response> {
    const response = await fetch(ApiPath.base() + ApiPath.shoppingList(shoppingList.clientId), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ shoppingList: shoppingList.$toJson() }),
    })
    const responseClone = response.clone()
    const json: ServerRecordResponse<ShoppingListAttributes> = await response.json()

    if (!json.error) {
      await shoppingList.save()
      await shoppingList.selfClass.update({ where: shoppingList.primaryKey, data: { items: shoppingList.items } })
      await StoreUtils.processIncluded(shoppingList, json.included, json.data.relationships)
    }
    return responseClone
  },
  async [ShoppingListActionTypes.CONFIRM_SELECTED](store: ActionContext<ShoppingListsState, RootState>) {
    if (!store.state.current) {
      await store.dispatch(ShoppingListActionTypes.FETCH)
    }
    store.commit(ShoppingListMutationTypes.CONFIRM_SELECTED)
    const response = await store.dispatch(ShoppingListActionTypes.UPDATE, store.state.current)
    const responseClone = response.clone()
    const json: ServerRecordResponse<ShoppingListAttributes> = await response.json()
    if (!response.ok) return response

    if (!json.error) {
      store.commit(ShoppingListMutationTypes.CLEAR_SELECTED)
    }
    return responseClone
  },
}

export default actions
