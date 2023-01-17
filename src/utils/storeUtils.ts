import { BelongsToMany, HasMany, MorphMany } from '@vuex-orm/core'
import AModel from 'Models/aModel'
import { ArrayUtils } from '~/utils/arrayUtils'

interface RDatum {
  id: string
  clientId: string
  type: string
}

export const StoreUtils = {
  async processIncluded(record: AModel, included: Array<RDatum>, relationships?: Record<string, { data: Array<RDatum> }>): Promise<void> {
    const model = record.selfClass
    if (relationships) {
      for (const key in relationships) {
        const relations: Record<PropertyKey, Array<RDatum>> = ArrayUtils.gatherBy<RDatum>(included, 'type', ['id'], ['attributes'])
        const field = model.getFields()[key]
        if (field instanceof HasMany) {
          const data = relationships[key].data.map(datum => relations[datum.type].find(d => d.id === datum.id))
          await field.related.insertOrUpdate({ data })
        } else if (field instanceof BelongsToMany) {
          const data = relationships[key].data.map(datum => relations[datum.type].find(d => d.id === datum.id))
          await field.related.insertOrUpdate({ data })
        } else if (field instanceof MorphMany) {
          const data = relationships[key].data.map(datum => relations[datum.type].find(d => d.id === datum.id))
          data.forEach(async datum => {
            if (datum) {
              if (record) {
                const attachedRecord = record[key].find(x => x.clientId === datum.clientId)
                if (attachedRecord) {
                  if (attachedRecord.markedForDestruction) {
                    const index = record[key].indexOf(attachedRecord)
                    record[key].splice(index, 1)
                    attachedRecord.$delete()
                  } else {
                    if (!attachedRecord.id) attachedRecord.id = datum.id
                    await field.related.insertOrUpdate({ data: datum })
                  }
                } else {
                  await field.related.insertOrUpdate({ data: datum })
                }
              } else {
                await field.related.insertOrUpdate({ data: datum })
              }
            }
          })
        }
      }
    } else {
      const relations: Record<PropertyKey, Array<RDatum>> = ArrayUtils.gatherBy<RDatum>(included, 'type', ['id'], ['attributes'])
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
