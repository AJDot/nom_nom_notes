import { Fields } from '@vuex-orm/core'
import { HasMany, Nameable } from 'Interfaces/modelInterfaces'
import AModel, { AModelAttributes } from 'Models/aModel'
import Attribute from '@vuex-orm/core/lib/attributes/Attribute'
import RecipeCategory from 'Models/recipeCategory'
import Recipe from 'Models/recipe'

export type CategoryAttributes = Nameable &
HasMany<'recipeCategories', RecipeCategory> &
HasMany<'recipes', Recipe>

export interface RCategory extends AModelAttributes, CategoryAttributes {
}

type CategoryFields = Fields & {
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
  name: string | undefined
  recipeCategories: Array<RecipeCategory> = []
  recipes: Array<Recipe> = []
}
