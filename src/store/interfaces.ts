import { FlashState } from '~/store/modules/flash'
import { ModalState } from '~/store/modules/modal'
import { LoadingState } from '~/store/modules/loading'

export interface RecipesState {
}

export interface SessionsState {
  csrf: string | null
  signedIn: boolean | null
}

export enum StoreModuleType {
  Recipes = 'recipes',
  Session = 'sessions',
  Flash = 'flash',
  Modal = 'modal',
  Loading = 'loading',
}

export interface RootState {
  [StoreModuleType.Flash]: FlashState
  [StoreModuleType.Recipes]: RecipesState
  [StoreModuleType.Session]: SessionsState
  [StoreModuleType.Modal]: ModalState
  [StoreModuleType.Loading]: LoadingState
}
