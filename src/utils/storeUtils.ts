import { BelongsToMany, HasMany } from '@vuex-orm/core'
import AModel from 'Models/aModel'
import { ArrayUtils } from '~/utils/arrayUtils'

export const StoreUtils = {
  async processIncluded(model: typeof AModel, included: Array<{type: string}>): Promise<void> {
    const relations: Record<PropertyKey, Array<{type: string}>> = ArrayUtils.gatherBy<{type: string}>(included, 'type', ['id'], ['attributes'])
    for (const type of Object.keys(relations)) {
      const field = model.getFields()[type]
      if (field instanceof HasMany) {
        await field.related.insertOrUpdate({ data: relations[type] })
      } else if (field instanceof BelongsToMany) {
        await field.related.insertOrUpdate({ data: relations[type] })
      }
    }
  },
}
