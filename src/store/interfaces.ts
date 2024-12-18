import { ShoppingListItem } from 'Interfaces/shoppingListInterfaces'
import ShoppingList from 'Models/shoppingList'
import User from 'Models/user'
import { TAppAbility } from '~/appAbility'
import { FlashState } from '~/store/modules/flash'
import { LoadingState } from '~/store/modules/loading'
import { ModalState } from '~/store/modules/modal'

export interface RecipesState {
}

export interface DynamicRecipesState {
}

export interface TagsState {
}

export interface SessionsState {
}

export interface UsersState {
  current: User | null
  fetchCurrentPromise: Promise<unknown> | null
}

export interface SignupsState {
}

export interface FeaturesState {
}

export interface AbilityState {
  ability: TAppAbility
}

export interface ShoppingListsState {
  current: ShoppingList | null
  selectedItems: ShoppingListItem[]
}

export enum StoreModuleType {
  Session = 'sessions',
  Features = 'features',
  Users = 'users',
  Flash = 'flash',
  Modal = 'modal',
  Loading = 'loading',
  Recipes = 'recipes',
  DynamicRecipes = 'dynamicRecipes',
  Tags = 'tags',
  Ability = 'ability',
  ShoppingLists = 'shoppingLists',
}

export interface RootState {
  [StoreModuleType.Flash]: FlashState
  [StoreModuleType.Session]: SessionsState
  [StoreModuleType.Modal]: ModalState
  [StoreModuleType.Loading]: LoadingState
  [StoreModuleType.Recipes]: RecipesState
  [StoreModuleType.DynamicRecipes]: DynamicRecipesState
  [StoreModuleType.Tags]: TagsState
  [StoreModuleType.Users]: UsersState
  [StoreModuleType.Ability]: AbilityState
  [StoreModuleType.ShoppingLists]: ShoppingListsState
}
