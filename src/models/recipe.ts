import { Fields, Model } from '@vuex-orm/core'
import { Nameable, RRecord } from 'Interfaces/model_interfaces'

export type RecipeAttributes = Nameable

export interface RRecipe extends RRecord, RecipeAttributes {
  cookTime: number
}

export default class Recipe extends Model implements RRecipe {
  static entity = 'recipes'

  static fields(): Fields {
    return {
      id: this.attr(null),
      name: this.string(''),
      description: this.string(''),
      cookTime: this.number(0),
      note: this.string(''),
    }
  }

  id!: string
  name: string | undefined
  cookTime!: number
}
