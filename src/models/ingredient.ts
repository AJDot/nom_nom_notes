import { Attribute, Fields } from '@vuex-orm/core'
import { BRecipe, Description, Sortable } from 'Interfaces/modelInterfaces'
import AModel, { AModelAttributes } from 'Models/aModel'

export type IngredientAttributes = Description & Sortable & BRecipe

export interface RIngredient extends AModelAttributes, IngredientAttributes {
}

type IngredientFields = Fields & {
  [key in keyof IngredientAttributes]: Attribute
}

export default class Ingredient extends AModel implements RIngredient {
  static entity = 'ingredients'

  static fields(): IngredientFields {
    return {
      ...super.fields(),
      recipeId: this.string(null),
      description: this.string(''),
      sortOrder: this.number(0),
    }
  }

  id!: string
  description: string | undefined
  recipeId: string | undefined
  sortOrder!: number
}
