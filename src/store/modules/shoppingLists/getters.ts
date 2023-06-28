import { Getter, GetterTree } from 'vuex'
import { ShoppingListsState, RootState } from '~/store/interfaces'

export enum ShoppingListGetterTypes {}

type ShoppingListGetters = {
  [key in ShoppingListGetterTypes]: Getter<ShoppingListsState, RootState>;
}

const getters: GetterTree<ShoppingListsState, RootState> & ShoppingListGetters = {}

export default getters
