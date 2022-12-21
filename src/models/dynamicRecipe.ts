import { Attribute, Fields } from '@vuex-orm/core'
import { Nameable } from 'Interfaces/modelInterfaces'
import AModel, { AModelAttributes } from 'Models/aModel'
import { Block } from '~/interfaces/blockInterfaces'

export type DynamicRecipeAttributes = Nameable

export interface RDynamicRecipe extends AModelAttributes, DynamicRecipeAttributes {
}

type DynamicRecipeFields = Fields & {
  [key in keyof DynamicRecipeAttributes]: Attribute
}

export default class DynamicRecipe extends AModel implements RDynamicRecipe {
  static entity = 'dynamicRecipes'

  static fields(): DynamicRecipeFields {
    return {
      ...super.fields(),
      name: this.string(''),
      blocks: this.attr(() => []),
    }
  }

  name!: string
  blocks!: Array<Block>
}
