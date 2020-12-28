import { FlashState } from '~/store/modules/flash'
import { ModalState } from '~/store/modules/modal'
import { LoadingState } from '~/store/modules/loading'

export interface RecipesState {
}

export interface CategoriesState {
}

export interface SessionsState {
  csrf: string | null
  signedIn: boolean | null
}

export enum StoreModuleType {
  Session = 'sessions',
  Flash = 'flash',
  Modal = 'modal',
  Loading = 'loading',
  Recipes = 'recipes',
  Categories = 'categories',
}

export interface RootState {
  [StoreModuleType.Flash]: FlashState
  [StoreModuleType.Session]: SessionsState
  [StoreModuleType.Modal]: ModalState
  [StoreModuleType.Loading]: LoadingState
  [StoreModuleType.Recipes]: RecipesState
  [StoreModuleType.Categories]: CategoriesState
}
