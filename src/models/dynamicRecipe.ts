import { Attribute } from '@vuex-orm/core'
import { Nameable } from 'Interfaces/modelInterfaces'
import AModel, { AModelAttributes, AModelFields } from 'Models/aModel'
import { Block } from '~/interfaces/blockInterfacesGeneral'
import FileUpload from './fileUpload'

export type DynamicRecipeAttributes = AModelAttributes & Nameable & {
  blocks: Array<Block>
  attachments: Array<FileUpload>
}

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
      attachments: this.morphMany(FileUpload, 'attachableId', 'attachableType')
    }
  }

  name!: string
  blocks!: Array<Block>
  attachments!: Array<FileUpload>
}
