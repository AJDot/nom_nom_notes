import { Attribute } from '@vuex-orm/core'
import AModel, { AModelAttributes, AModelFields } from 'Models/aModel'
import { FeatureState } from '~/enums/features'
import { store, StoreModulePath } from '~/store'
import { FeatureActionTypes } from '~/store/modules/features/actions'

type FeatureGateAttributes = {
  key: string
  name: string
  value: unknown
}

export type FeatureAttributes = AModelAttributes & {
  key: string
  state: FeatureState
  gates: FeatureGateAttributes | Array<FeatureGateAttributes>
}

export interface RFeature extends FeatureAttributes {
}

type FeatureFields = AModelFields & {
  [key in keyof FeatureAttributes]: Attribute
}

type FeatureKey = 'signup'

export default class Feature extends AModel implements RFeature {
  static entity = 'Feature'
  static modelName = 'Feature'
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

  static async isOn(key: FeatureKey): Promise<boolean> {
    // Fetch feature if not in front end database
    if (!Feature.isPresent(key)) await Feature.fetch(key)
    return Feature.find(key)?.state === FeatureState.On
  }

  static async isOff(key: FeatureKey): Promise<boolean> {
    if (!Feature.isPresent(key)) await Feature.fetch(key)
    const feature = await Feature.find(key)
    // consider off if not able to be fetched
    return !feature ||
      feature.state === FeatureState.Off ||
      // TODO: Features: Support +FeatureState.Conditional+
      feature.state === FeatureState.Conditional
  }

  static isPresent(key: FeatureKey): boolean {
    return Boolean(Feature.find(key))
  }

  static async fetch(key: FeatureKey): Promise<void> {
    await store.dispatch(StoreModulePath.Features + FeatureActionTypes.FETCH, { key: key })
  }
}
