import { FlashState } from '~/store/modules/flash'
import { ModalState } from '~/store/modules/modal'
import { LoadingState } from '~/store/modules/loading'
import User from 'Models/user'

export interface RecipesState {
}

export interface DynamicRecipesState {
}

export interface CategoriesState {
}

export interface SessionsState {
  csrf: string | null
  signedIn: boolean | null
}

export interface UsersState {
  current: User | null
}

export interface SignupsState {
}

export interface FeaturesState {
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
  Categories = 'categories',
}

export interface RootState {
  [StoreModuleType.Flash]: FlashState
  [StoreModuleType.Session]: SessionsState
  [StoreModuleType.Modal]: ModalState
  [StoreModuleType.Loading]: LoadingState
  [StoreModuleType.Recipes]: RecipesState
  [StoreModuleType.DynamicRecipes]: DynamicRecipesState
  [StoreModuleType.Categories]: CategoriesState
  [StoreModuleType.Users]: UsersState
}
