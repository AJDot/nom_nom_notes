import { Attribute } from '@vuex-orm/core'
import { HasMany, HasOne, Nameable } from 'Interfaces/modelInterfaces'
import AModel, { AModelAttributes, AModelFields } from 'Models/aModel'
import { Block } from '~/interfaces/blockInterfacesGeneral'
import FileUpload from './fileUpload'
import Tag from './tag'
import Tagging from './tagging'
import User from './user'

export type DynamicRecipeAttributes = AModelAttributes & Nameable & {
  blocks: Array<Block>
  attachments: Array<FileUpload>
} &
  HasOne<'owner', User> &
  HasMany<'taggings', Tagging> &
  HasMany<'tags', Tag>

export interface RDynamicRecipe extends DynamicRecipeAttributes {
}

type DynamicRecipeFields = AModelFields & {
  [key in keyof DynamicRecipeAttributes]: Attribute
}

export default class DynamicRecipe extends AModel implements RDynamicRecipe {
  static entity = 'DynamicRecipe'

  static fields(): DynamicRecipeFields {
    return {
      ...super.fields(),
      name: this.string(''),
      blocks: this.attr(() => []),
      attachments: this.morphMany(FileUpload, 'attachableId', 'attachableType'),
      ownerId: this.string(''),
      owner: this.belongsTo(User, 'ownerId', 'clientId'),
      taggings: this.morphMany(Tagging, 'taggableId', 'taggableType'),
      tags: this.belongsToMany(Tag, Tagging, 'taggableId', 'tagId'),
    }
  }

  name!: string
  blocks!: Array<Block>
  attachments!: Array<FileUpload>
  ownerId!: string
  owner!: User
  taggings!: Array<Tagging>
  tags!: Array<Tag>

  $toJson(): Record<string, unknown> {
    const json = super.$toJson()
    delete json.owner
    return json
  }
}
