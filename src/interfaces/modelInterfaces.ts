/**
 * "R" = Record
 * "B" = BelongsTo
 */
import { Uploader } from 'Interfaces/imageInterfaces'

export interface ClientIdable {
  clientId: string | undefined
}

export interface RRecord extends ClientIdable {
  id: string | undefined
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

export interface BTag {
  tagId: string | undefined
}

export interface BTaggable {
  taggableId: string | undefined
  taggableType: string | undefined
}

export interface Notable {
  note: string
}

export interface CookTime {
  cookTime: number
}

export type HasOne<K extends string, T> = { [key in K]: T } & { [key in `${K}Id`]: string }

export type HasMany<K extends string, T> = {
  [key in K]: T[]
}

export type HasUploader<K extends string> = { [key in K]: Uploader }
