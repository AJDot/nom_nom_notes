import { RRecord } from 'Interfaces/modelInterfaces'
import { ShoppingListItem } from 'Interfaces/shoppingListInterfaces'
import ShoppingList from 'Models/shoppingList'
import { Mutation, MutationTree } from 'vuex'
import { ShoppingListsState } from '~/store/interfaces'
import { ArrayUtils } from '~/utils/arrayUtils'

export enum ShoppingListMutationTypes {
  SET = 'SET',
  ADD = 'ADD',
  CONFIRM_SELECTED = 'CONFIRM_SELECTED',
  CLEAR_SELECTED = 'CLEAR_SELECTED',
  SELECT_ITEM = 'SELECT_ITEM',
  UNSELECT_ITEM = 'UNSELECT_ITEM',
}

type ShoppingListMutations = { [key in ShoppingListMutationTypes]: Mutation<ShoppingListsState> }

const mutations: MutationTree<ShoppingListsState> & ShoppingListMutations = {
  async [ShoppingListMutationTypes.SET](state, shoppingLists: RRecord[]) {
    shoppingLists = ArrayUtils.wrap(shoppingLists)
    // delete all lists that don't match the incoming ids
    ShoppingList.query()
      .where((shoppingList: ShoppingList) => {
        return !shoppingLists.some((r) => r.clientId === shoppingList.clientId)
      })
      .get()
      .forEach((shoppingList) => shoppingList.$delete())
    await ShoppingList.insertOrUpdate({ data: shoppingLists })
  },
  async [ShoppingListMutationTypes.ADD](state, shoppingLists: RRecord | Array<RRecord>) {
    await ShoppingList.insertOrUpdate({ data: shoppingLists })
  },
  [ShoppingListMutationTypes.SELECT_ITEM](state, item: ShoppingListItem) {
    state.selectedItems.push(item)
  },
  [ShoppingListMutationTypes.UNSELECT_ITEM](state, id: string) {
    const item = state.selectedItems.find(x => x.id === id)
    if (item) {
      const index = state.selectedItems.indexOf(item)
      state.selectedItems.splice(index, 1)
    }
  },
  [ShoppingListMutationTypes.CONFIRM_SELECTED](state) {
    state.current?.items.push(...state.selectedItems)
  },
  [ShoppingListMutationTypes.CLEAR_SELECTED](state) {
    state.selectedItems = []
  },
}

export default mutations
