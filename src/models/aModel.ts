import { Fields, Model } from '@vuex-orm/core'
import { Destroyable, RRecord } from 'Interfaces/model_interfaces'
import Guid from '~/utils/guid'

export type AModelAttributes = RRecord & Destroyable

export default class AModel extends Model implements AModelAttributes {
  id!: string
  clientId!: string
  _destroy!: boolean

  static primaryKey = 'clientId'

  static fields(): Fields {
    return {
      ...super.fields(),
      id: this.attr(null),
      clientId: this.uid(() => Guid.create()),
      _destroy: this.boolean(false),
    }
  }

  markForDestruction(): void {
    this._destroy = true
  }

  get markedForDestruction(): boolean {
    return this._destroy
  }
}
