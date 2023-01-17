import { Attribute } from '@vuex-orm/core'
import { Description, Sortable } from 'Interfaces/modelInterfaces'
import AModel, { AModelAttributes, AModelFields } from 'Models/aModel'

export type StepAttributes = AModelAttributes & Description & Sortable

export interface RStep extends StepAttributes {
}

type StepFields = AModelFields & {
  [key in keyof StepAttributes]: Attribute
}

export default class Step extends AModel implements RStep {
  static entity = 'Step'
  static modelName = 'Step'

  static fields(): StepFields {
    return {
      ...super.fields(),
      recipeId: this.string(null),
      description: this.string(''),
      sortOrder: this.number(0),
    }
  }

  id!: string
  description: string | undefined
  recipeId: string | undefined
  sortOrder!: number
}
