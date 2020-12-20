import { Fields, Model } from '@vuex-orm/core'
import { Destroyable, RRecord } from 'Interfaces/modelInterfaces'
import Guid from '~/utils/guid'

export type AModelAttributes = RRecord & Destroyable

export default abstract class AModel extends Model implements AModelAttributes {
  id!: string
  clientId!: string
  _destroy!: boolean
  abstract klass: typeof Model

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

  async save(): Promise<void> {
    if (this.markedForDestruction) await this.$delete()
    else {
      /**
       * Wish I could just call this.$save()
       * or this.$update(this.$toJson())
       * or this.$update({data: this.$toJson()})
       * but all seems to not update the object in the store
       * Instead, must call the static method to update the object
       */
      if (!this.klass) throw new Error('klass is undefined!')
      if (!this.$id) throw new Error('$id is undefined!')
      await this.klass.update({ where: this.$id, data: this.$toJson() })
    }
  }
}
