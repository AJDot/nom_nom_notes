import Recipe from 'Models/recipe'

export interface RootState {
  recipes: RecipesState
}

export interface PersistenceState<T> {
  all: Array<T>
}

export type RecipesState = PersistenceState<Recipe>

export interface SessionsState {
  csrf: string | null
  signedIn: boolean | null
}
