import { AxiosResponse } from 'axios'
import { ServerRecordResponse } from 'Interfaces/serverInterfaces'
import ShoppingList, { ShoppingListAttributes } from 'Models/shoppingList'
import { Action, ActionContext, ActionTree } from 'vuex'
import { securedAxiosInstance } from '~/backend/axios'
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
    const response: AxiosResponse<ServerRecordResponse<ShoppingListAttributes>> = await securedAxiosInstance.get(ApiPath.base() + ApiPath.shoppingLists())
    if (!response.data) throw new Error('Shopping List not found')

    commit(ShoppingListMutationTypes.ADD, {
      id: response.data.data.id,
      ...response.data.data.attributes,
    })
    const shoppingList = ShoppingList.find(response.data.data.attributes.clientId!)!
    await StoreUtils.processIncluded(shoppingList, response.data.included, response.data.data.relationships)
    state.current = shoppingList
    return response
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
  async [ShoppingListActionTypes.CREATE](_store: ActionContext<ShoppingListsState, RootState>, shoppingList: ShoppingList): Promise<AxiosResponse<ServerRecordResponse<ShoppingListAttributes>>> {
    const response: AxiosResponse<ServerRecordResponse<ShoppingListAttributes>> = await securedAxiosInstance.post(ApiPath.base() + ApiPath.shoppingLists(), {
      shoppingList: shoppingList.$toJson(),
    })
    shoppingList.id = response.data.data.id
    await shoppingList.$insertOrUpdate({ data: { id: shoppingList.id, ...response.data.data.attributes } })
    return response
  },
  async [ShoppingListActionTypes.UPDATE](store: ActionContext<ShoppingListsState, RootState>, shoppingList: ShoppingList): Promise<AxiosResponse<ServerRecordResponse<ShoppingListAttributes>>> {
    const response: AxiosResponse<ServerRecordResponse<ShoppingListAttributes>> = await securedAxiosInstance.patch(ApiPath.base() + ApiPath.shoppingList(shoppingList.clientId), {
      shoppingList: shoppingList.$toJson(),
    })

    if (!response.data.error) {
      await shoppingList.save()
      await StoreUtils.processIncluded(shoppingList, response.data.included, response.data.data.relationships)
    }
    return response
  },
  async [ShoppingListActionTypes.CONFIRM_SELECTED](store: ActionContext<ShoppingListsState, RootState>) {
    if (!store.state.current) {
      await store.dispatch(ShoppingListActionTypes.FETCH)
    }
    store.commit(ShoppingListMutationTypes.CONFIRM_SELECTED)
    const response = await store.dispatch(ShoppingListActionTypes.UPDATE, store.state.current)
    if (!response.data.error) {
      store.commit(ShoppingListMutationTypes.CLEAR_SELECTED)
    }
    return response
  },
}

export default actions
