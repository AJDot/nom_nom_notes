import { Fields } from '@vuex-orm/core'
import { Description } from 'Interfaces/model_interfaces'
import AModel, { AModelAttributes } from 'Models/aModel'

export type StepAttributes = Description

export interface RStep extends AModelAttributes, StepAttributes {
}

export default class Step extends AModel implements RStep {
  static entity = 'steps'

  static fields(): Fields {
    return {
      ...super.fields(),
      recipeId: this.string(null),
      description: this.string(''),
    }
  }

  id!: string
  description: string | undefined
  recipeId: string | undefined
}
