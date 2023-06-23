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

export interface AbilityState {
  ability: TAppAbility
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
}
