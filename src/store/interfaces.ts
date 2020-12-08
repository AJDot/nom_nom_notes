import { FlashState } from '~/store/modules/flash'

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
}

export interface RootState {
  [StoreModuleType.Flash]: FlashState
  [StoreModuleType.Recipes]: RecipesState
  [StoreModuleType.Session]: SessionsState
}
