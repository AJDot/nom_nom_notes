import { Attribute } from '@vuex-orm/core'
import { HasMany, Nameable } from 'Interfaces/modelInterfaces'
import AModel, { AModelAttributes, AModelFields } from 'Models/aModel'
import Recipe from 'Models/recipe'
import RecipeCategory from 'Models/recipeCategory'

export type CategoryAttributes = AModelAttributes &
  Nameable &
  HasMany<'recipeCategories', RecipeCategory> &
  HasMany<'recipes', Recipe>

export interface RCategory extends CategoryAttributes {
}

type CategoryFields = AModelFields & {
  [key in keyof CategoryAttributes]: Attribute
}

export default class Category extends AModel implements RCategory {
  static entity = 'categories'

  static fields(): CategoryFields {
    return {
      ...super.fields(),
      name: this.string(''),
      recipeCategories: this.hasMany(RecipeCategory, 'recipeId'),
      recipes: this.belongsToMany(Recipe, RecipeCategory, 'categoryId', 'recipeId'),
    }
  }

  id!: string
  name!: string
  recipeCategories: Array<RecipeCategory> = []
  recipes: Array<Recipe> = []
}
