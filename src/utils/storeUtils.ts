import { Hash } from 'Interfaces/util_interfaces'
import { ArrayUtils } from '~/utils/arrayUtils'
import Recipe from 'Models/recipe'
import { HasMany } from '@vuex-orm/core'
import AModel from 'Models/aModel'

export const StoreUtils = {
  async processIncluded(model: typeof AModel, included: Array<{type: string}>): Promise<void> {
    const relations: Hash<Array<{type: string}>> = ArrayUtils.gatherBy<{type: string}>(included, 'type', ['id'], ['attributes'])
    for (const type of Object.keys(relations)) {
      const field = Recipe.getFields()[type]
      if (field instanceof HasMany) {
        await field.related.insertOrUpdate({ data: relations[type] })
      }
    }
  },
}
