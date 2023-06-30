import Recipe from 'Models/recipe'
import { Attribute } from '@vuex-orm/core'
import AModel, { AModelAttributes, AModelFields } from 'Models/aModel'
import DynamicRecipe from './dynamicRecipe'
import { HasMany } from 'Interfaces/modelInterfaces'

export type UserAttributes = AModelAttributes & {
  email: string
  username: string
} &
HasMany<'recipes', Recipe> &
HasMany<'dynamicRecipes', DynamicRecipe>

export interface RUser extends UserAttributes {
}

type UserFields = AModelFields & {
  [key in keyof UserAttributes]: Attribute
}

export default class User extends AModel implements RUser {
  static entity = 'User'
  static modelName = 'User'

  static fields(): UserFields {
    return {
      ...super.fields(),
      email: this.string(''),
      username: this.string(''),
      recipes: this.hasMany(Recipe, 'ownerId', 'clientId'),
      dynamicRecipes: this.hasMany(DynamicRecipe, 'ownerId', 'clientId'),
    }
  }

  email!: string
  username!: string
  recipes!: Array<Recipe>
  dynamicRecipes!: Array<DynamicRecipe>
}
