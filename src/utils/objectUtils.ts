import { ArrayUtils } from '~/utils/arrayUtils'

export const ObjectUtils = {
  combine<T>(item: T, props: keyof T | Array<keyof T> = [], spreads: keyof T | Array<keyof T> = []): Record<PropertyKey, any> {
    const hash: Record<PropertyKey, any> = {}
    ArrayUtils.wrap(props).forEach(p => {
      Object.assign(hash, { [p]: item[p] })
    })
    ArrayUtils.wrap(spreads).forEach(s => {
      Object.assign(hash, item[s])
    })
    return hash
  },
}
