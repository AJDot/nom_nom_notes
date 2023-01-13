import { Attribute } from '@vuex-orm/core'
import { Uploader } from 'Interfaces/imageInterfaces'
import { CookTime, Description, HasMany, HasOne, HasUploader, Nameable, Notable } from 'Interfaces/modelInterfaces'
import AModel, { AModelAttributes, AModelFields } from 'Models/aModel'
import Category from 'Models/category'
import Ingredient from 'Models/ingredient'
import RecipeCategory from 'Models/recipeCategory'
import Step from 'Models/step'
import User from 'Models/user'

export type RecipeAttributes = AModelAttributes & Nameable & Description & CookTime & Notable &
  HasMany<'steps', Step> &
  HasMany<'ingredients', Ingredient> &
  HasMany<'recipeCategories', RecipeCategory> &
  HasMany<'categories', Category> &
  HasUploader<'image'> &
  HasOne<'owner', User>

export interface RRecipe extends RecipeAttributes {
}

type RecipeFields = AModelFields & {
  [key in keyof RecipeAttributes]: Attribute
}

export default class Recipe extends AModel implements RRecipe {
  static entity = 'recipes'

  static fields(): RecipeFields {
    return {
      ...super.fields(),
      name: this.string(''),
      description: this.string('').nullable(),
      cookTime: this.number(0),
      note: this.string('').nullable(),
      steps: this.hasMany(Step, 'recipeId'),
      ingredients: this.hasMany(Ingredient, 'recipeId'),
      recipeCategories: this.hasMany(RecipeCategory, 'recipeId'),
      categories: this.belongsToMany(Category, RecipeCategory, 'recipeId', 'categoryId'),
      image: this.attr({}),
      ownerId: this.string(null),
      owner: this.belongsTo(User, 'ownerId', 'clientId')
    }
  }

  name!: string
  description!: string
  cookTime!: number
  note!: string
  steps!: Array<Step>
  ingredients!: Array<Ingredient>
  recipeCategories!: Array<RecipeCategory>
  categories!: Array<Category>
  image!: Uploader
  ownerId!: string
  owner!: User

  save(): Promise<void> {
    this.steps.forEach(x => x.save())
    this.ingredients.forEach(x => x.save())
    this.recipeCategories.forEach(x => x.save())
    return super.save()
  }

  $toJson(): Record<string, unknown> {
    const json = super.$toJson()
    // image handle independently for now
    delete json.image
    if (this.image.raw) {
      json.image = this.image.raw
    } else {
      delete json.image
    }
    delete json.owner
    return json
  }
}
