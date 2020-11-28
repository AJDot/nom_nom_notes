import { InstanceUtils } from '~/utils/instanceUtils'

export const ArrayUtils = {
  sort<T>(arr: Array<T>, callback: (a: T, b: T) => number): Array<T> {
    return arr.slice().sort(callback)
  },
  wrap(item: any): Array<any> {
    return InstanceUtils.toArray(item)
  }
}
