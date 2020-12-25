import { CookTime, Description, HasMany, Nameable, Notable } from 'Interfaces/modelInterfaces'
import Step from 'Models/step'
import AModel, { AModelAttributes } from 'Models/aModel'
import Attribute from '@vuex-orm/core/lib/attributes/Attribute'
import Ingredient from 'Models/ingredient'
import Category from 'Models/category'
import RecipeCategory from 'Models/recipeCategory'

export type RecipeAttributes = Nameable & Description & CookTime & Notable &
HasMany<'steps', Step> &
HasMany<'ingredients', Ingredient> &
HasMany<'recipeCategories', RecipeCategory> &
HasMany<'categories', Category>

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
      recipeCategories: this.hasMany(RecipeCategory, 'recipeId'),
      categories: this.belongsToMany(Category, RecipeCategory, 'recipeId', 'categoryId'),
    }
  }

  name: string | undefined
  description: string | undefined
  cookTime!: number
  note!: string
  steps: Array<Step> = []
  ingredients: Array<Ingredient> = []
  recipeCategories: Array<RecipeCategory> = []
  categories: Array<Category> = []

  save(): Promise<void> {
    this.steps.forEach(x => x.save())
    this.ingredients.forEach(x => x.save())
    return super.save()
  }
}
