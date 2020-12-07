import { InstanceUtils } from '~/utils/instanceUtils'

export const ArrayUtils = {
  sort<T>(arr: Array<T>, callback: (_a: T, _b: T) => number): Array<T> {
    return arr.slice().sort(callback)
  },
  wrap<T = unknown>(item: T | Array<T>): Array<T> {
    return InstanceUtils.toArray<T>(item)
  },
}
