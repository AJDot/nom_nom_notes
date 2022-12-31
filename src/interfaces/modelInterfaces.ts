/**
 * "R" = Record
 * "B" = BelongsTo
 */
import { Uploader } from 'Interfaces/imageInterfaces'

export interface RRecord extends ClientIdable {
  id: string | undefined
}

export interface ClientIdable {
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

export interface BCategory {
  categoryId: string | undefined
}

export interface Notable {
  note: string
}

export interface CookTime {
  cookTime: number
}

export type HasOne<K extends string, T> = {
  [key in K]: T
}

export type HasMany<K extends string, T> = {
  [key in K]: T[]
}

export type HasUploader<K extends string> = HasOne<K, Uploader>
