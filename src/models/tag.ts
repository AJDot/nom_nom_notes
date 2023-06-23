import { Attribute } from '@vuex-orm/core'
import { HasMany, Nameable } from 'Interfaces/modelInterfaces'
import AModel, { AModelAttributes, AModelFields } from 'Models/aModel'
import Recipe from 'Models/recipe'
import Tagging from 'Models/tagging'

export type TagAttributes = AModelAttributes &
Nameable &
HasMany<'taggings', Tagging> &
HasMany<'taggables', Recipe>

export interface RTag extends TagAttributes {
}

type TagFields = AModelFields & {
  [key in keyof TagAttributes]: Attribute
}

export default class Tag extends AModel implements RTag {
  static entity = 'Tag'
  static modelName = 'Tag'

  static fields(): TagFields {
    return {
      ...super.fields(),
      name: this.string(''),
      taggings: this.hasMany(Tagging, 'tagId'),
      taggables: this.morphToMany(Recipe, Tagging, 'tagId', 'taggableId', 'taggableType'),
    }
  }

  id!: string
  name!: string
  taggings: Array<Tagging> = []
  taggables: Array<Recipe> = []
}
