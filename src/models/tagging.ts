import { Attribute } from '@vuex-orm/core'
import { BTag, BTaggable } from 'Interfaces/modelInterfaces'
import AModel, { AModelAttributes, AModelFields } from 'Models/aModel'

export type TaggingAttributes = AModelAttributes & BTaggable & BTag

export interface RTagging extends TaggingAttributes {
}

type TaggingFields = AModelFields & {
  [key in keyof TaggingAttributes]: Attribute
}

export default class Tagging extends AModel implements RTagging {
  static entity = 'Tagging'
  static modelName = 'Tagging'

  static primaryKey = ['tagId', 'taggableId']

  static fields(): TaggingFields {
    return {
      ...super.fields(),
      tagId: this.string(null),
      taggableId: this.string(null),
      taggableType: this.string(null),
    }
  }

  id!: string
  tagId!: string
  taggableId!: string
  taggableType!: string
}
