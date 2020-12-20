import { CookTime, Description, HasMany, Nameable, Notable } from 'Interfaces/modelInterfaces'
import Step from 'Models/step'
import AModel, { AModelAttributes } from 'Models/aModel'
import Attribute from '@vuex-orm/core/lib/attributes/Attribute'
import Ingredient from 'Models/ingredient'

export type RecipeAttributes = Nameable & Description & CookTime & Notable &
HasMany<'steps', Step> &
HasMany<'ingredients', Ingredient>

export interface RRecipe extends AModelAttributes, RecipeAttributes {
}

type RecipeFields = {
  [key in keyof RecipeAttributes]: Attribute
}

export default class Recipe extends AModel implements RRecipe {
  static entity = 'recipes'

  static fields(): RecipeFields {
    return {
      ...super.fields(),
      name: this.string(''),
      description: this.string(''),
      cookTime: this.number(0),
      note: this.string(''),
      steps: this.hasMany(Step, 'recipeId'),
      ingredients: this.hasMany(Ingredient, 'recipeId'),
    }
  }

  klass = Recipe

  name: string | undefined
  description: string | undefined
  cookTime!: number
  note!: string
  steps: Array<Step> = []
  ingredients: Array<Ingredient> = []
}
