import { Fields } from '@vuex-orm/core'
import AModel, { AModelAttributes } from 'Models/aModel'
import Attribute from '@vuex-orm/core/lib/attributes/Attribute'
import { BCategory, BRecipe } from 'Interfaces/modelInterfaces'

export type RecipeCategoryAttributes = BRecipe & BCategory

export interface RRecipeCategory extends AModelAttributes, RecipeCategoryAttributes {
}

type RecipeCategoryFields = Fields & {
  [key in keyof RecipeCategoryAttributes]: Attribute
}

export default class RecipeCategory extends AModel implements RRecipeCategory {
  static entity = 'recipeCategories'

  static fields(): RecipeCategoryFields {
    return {
      ...super.fields(),
      recipeId: this.string(null),
      categoryId: this.string(null),
    }
  }

  id!: string
  recipeId!: string
  categoryId!: string
}
