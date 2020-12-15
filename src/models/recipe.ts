import { Fields } from '@vuex-orm/core'
import { Nameable } from 'Interfaces/model_interfaces'
import Step from 'Models/step'
import AModel, { AModelAttributes } from 'Models/aModel'

export type RecipeAttributes = Nameable

export interface RRecipe extends AModelAttributes, RecipeAttributes {
  cookTime: number
}

export default class Recipe extends AModel implements RRecipe {
  static entity = 'recipes'

  static fields(): Fields {
    return {
      ...super.fields(),
      name: this.string(''),
      description: this.string(''),
      cookTime: this.number(0),
      note: this.string(''),
      steps: this.hasMany(Step, 'recipeId'),
    }
  }

  name: string | undefined
  cookTime!: number
  steps!: Array<Step>
}
