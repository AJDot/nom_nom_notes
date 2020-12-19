export interface RRecord {
  id: string | undefined
  clientId: string | undefined
}

export interface Nameable {
  name: string | undefined
}

export interface Description {
  description: string | undefined
}

export interface Destroyable {
  markForDestruction(): void
  _destroy: boolean
  markedForDestruction: boolean
}

export interface Sortable {
  sortOrder: number
}

export interface BRecipe {
  recipeId: string | undefined
}

export interface Notable {
  note: string
}

export interface CookTime {
  cookTime: number
}

export type HasMany<P extends string, T> = {
  [key in P]: T[]
}
