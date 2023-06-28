import { ShoppingListsState } from '~/store/interfaces'

const state: () => ShoppingListsState = () => ({
  current: null,
  selectedItems: [],
})

export default state
