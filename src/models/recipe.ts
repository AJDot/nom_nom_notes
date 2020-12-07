import { Fields, Model } from '@vuex-orm/core'
import { Nameable, RRecord } from 'Interfaces/model_interfaces'

export type RecipeAttributes = Nameable

export interface RRecipe extends RRecord, RecipeAttributes {
}

export default class Recipe extends Model implements RRecipe {
  static entity = 'recipes'

  static fields(): Fields {
    return {
      id: this.attr(null),
      name: this.string(''),
      description: this.string(''),
      note: this.string(''),
    }
  }

  id: string | undefined
  name: string | undefined
}
