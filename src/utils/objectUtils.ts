import { Hash } from 'Interfaces/utilInterfaces'
import { ArrayUtils } from '~/utils/arrayUtils'

export const ObjectUtils = {
  combine<T>(item: T, props: keyof T | Array<keyof T> = [], spreads: keyof T | Array<keyof T> = []): Hash {
    const hash: Hash = {}
    ArrayUtils.wrap(props).forEach(p => {
      Object.assign(hash, { [p]: item[p] })
    })
    ArrayUtils.wrap(spreads).forEach(s => {
      Object.assign(hash, item[s])
    })
    return hash
  },
}
