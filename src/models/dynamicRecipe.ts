import { Attribute } from '@vuex-orm/core'
import { HasOne, Nameable } from 'Interfaces/modelInterfaces'
import AModel, { AModelAttributes, AModelFields } from 'Models/aModel'
import { Block } from '~/interfaces/blockInterfacesGeneral'
import FileUpload from './fileUpload'
import User from './user'

export type DynamicRecipeAttributes = AModelAttributes & Nameable & {
  blocks: Array<Block>
  attachments: Array<FileUpload>
} &
  HasOne<'owner', User>

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
      ownerId: this.string(null),
      owner: this.belongsTo(User, 'ownerId', 'clientId')
    }
  }

  name!: string
  blocks!: Array<Block>
  attachments!: Array<FileUpload>
  ownerId!: string
  owner!: User

  $toJson(): Record<string, unknown> {
    const json = super.$toJson()
    delete json.owner
    return json
  }
}
