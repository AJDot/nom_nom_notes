import { Fields } from '@vuex-orm/core'
import { Description, Sortable } from 'Interfaces/model_interfaces'
import AModel, { AModelAttributes } from 'Models/aModel'

export type StepAttributes = Description & Sortable

export interface RStep extends AModelAttributes, StepAttributes {
}

export default class Step extends AModel implements RStep {
  static entity = 'steps'

  static fields(): Fields {
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
