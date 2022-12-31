import { BelongsToMany, HasMany, MorphMany } from '@vuex-orm/core'
import AModel from 'Models/aModel'
import { ArrayUtils } from '~/utils/arrayUtils'

export const StoreUtils = {
  async processIncluded(model: typeof AModel, included: Array<{ id: string, type: string }>, relationships?: Record<string, { data: Array<{ id: string, type: string }> }>): Promise<void> {
    if (relationships) {
      for (const key in relationships) {
        const relations: Record<PropertyKey, Array<{ id: string, type: string }>> = ArrayUtils.gatherBy<{ id: string, type: string }>(included, 'type', ['id'], ['attributes'])
        const field = model.getFields()[key]
        if (field instanceof HasMany) {
          const data = relationships[key].data.map(datum => relations[datum.type].find(d => d.id === datum.id))
          await field.related.insertOrUpdate({ data })
        } else if (field instanceof BelongsToMany) {
          const data = relationships[key].data.map(datum => relations[datum.type].find(d => d.id === datum.id))
          await field.related.insertOrUpdate({ data })
        } else if (field instanceof MorphMany) {
          const data = relationships[key].data.map(datum => relations[datum.type].find(d => d.id === datum.id))
          await field.related.insertOrUpdate({ data })
        }
      }
    } else {
      const relations: Record<PropertyKey, Array<{ type: string }>> = ArrayUtils.gatherBy<{ type: string }>(included, 'type', ['id'], ['attributes'])
      for (const type of Object.keys(relations)) {
        const field = model.getFields()[type]
        if (field instanceof HasMany) {
          await field.related.insertOrUpdate({ data: relations[type] })
        } else if (field instanceof BelongsToMany) {
          await field.related.insertOrUpdate({ data: relations[type] })
        }
      }
    }
  },
}
