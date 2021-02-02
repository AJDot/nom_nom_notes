import AModel, { AModelAttributes } from 'Models/aModel'
import { Attribute } from '@vuex-orm/core'
import { FeatureState } from '~/enums/features'

type FeatureGateAttributes = {
  key: string
  name: string
  value: unknown
}

export type FeatureAttributes = {
  key: string
  state: FeatureState
  gates: FeatureGateAttributes | Array<FeatureGateAttributes>
}

export interface RFeature extends AModelAttributes, FeatureAttributes {
}

type FeatureFields = {
  [key in keyof FeatureAttributes]: Attribute
}

export default class Feature extends AModel implements RFeature {
  static entity = 'features'
  static primaryKey = 'key'

  static fields(): FeatureFields {
    return {
      ...super.fields(),
      key: this.string(null),
      state: this.string('off'),
      gates: this.attr(null),
    }
  }

  gates!: FeatureGateAttributes | Array<FeatureGateAttributes>
  key!: string
  state!: FeatureState
}
