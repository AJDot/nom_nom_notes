import { FlashState } from '~/store/modules/flash'
import { ModalState } from '~/store/modules/modal'

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
}

export interface RootState {
  [StoreModuleType.Flash]: FlashState
  [StoreModuleType.Recipes]: RecipesState
  [StoreModuleType.Session]: SessionsState
  [StoreModuleType.Modal]: ModalState
}
