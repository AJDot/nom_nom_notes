import { Attribute } from '@vuex-orm/core'
import { BCategory, BRecipe } from 'Interfaces/modelInterfaces'
import AModel, { AModelAttributes, AModelFields } from 'Models/aModel'

export type RecipeCategoryAttributes = AModelAttributes & BRecipe & BCategory

export interface RRecipeCategory extends RecipeCategoryAttributes {
}

type RecipeCategoryFields = AModelFields & {
  [key in keyof RecipeCategoryAttributes]: Attribute
}

export default class RecipeCategory extends AModel implements RRecipeCategory {
  static entity = 'recipeCategories'

  static primaryKey = ['recipeId', 'categoryId']

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
