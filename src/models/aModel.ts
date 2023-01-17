import { Attribute, Fields, Model } from '@vuex-orm/core'
import { ClientIdable, Destroyable } from 'Interfaces/modelInterfaces'
import Guid from '~/utils/guid'

export type AModelAttributes = ClientIdable
export type AModelComputed = Destroyable

export type AModelFields = Fields & {
  [key in keyof AModelAttributes | 'id']: Attribute
}

export default abstract class AModel extends Model implements AModelAttributes, AModelComputed {
  id!: string
  clientId!: string
  _destroy!: boolean

  static modelName: string
  static primaryKey: string | string[] = 'clientId'

  static fields(): AModelFields {
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

  unmarkForDestruction(): void {
    this._destroy = false
  }

  get markedForDestruction(): boolean {
    return this._destroy
  }

  async save(): Promise<void> {
    if (this.markedForDestruction) {
      await this.$delete()
    } else {
      /**
       * Wish I could just call this.$save()
       * or this.$update(this.$toJson())
       * or this.$update({data: this.$toJson()})
       * but all seems to not update the object in the store
       * Instead, must call the static method to update the object
       */
      if (this.primaryKey) {
        await this.selfClass.update({
          where: this.primaryKey,
          data: this.$toJson(),
        })
      } else {
        throw new Error('$id is undefined!')
      }
    }
  }

  get primaryKey(): never {
    return this.selfClass.getIdFromRecord(this) as never
  }

  get selfClass(): typeof Model {
    return this.$self()
  }
}
