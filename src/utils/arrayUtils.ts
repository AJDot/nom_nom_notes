import { InstanceUtils } from '~/utils/instanceUtils'

export const ArrayUtils = {
  sort<T>(arr: Array<T>, callback: (_a: T, _b: T) => number): Array<T> {
    return arr.slice().sort(callback)
  },
  wrap<T = unknown>(item: T | Array<T>): Array<T> {
    return InstanceUtils.toArray<T>(item)
  },
  toSentence<T = string>(array: T[], separator = ', ', lastSeparator = 'and', builder?: ((item: T) => string)): string {
    const getString = (item: T): string => {
      if (InstanceUtils.isFunction(builder)) {
        return builder(item)
      } else if (InstanceUtils.isString(item)) {
        return item
      } else {
        return (<{ toString: () => string }>item).toString()
      }
    }
    const lastIndex = array.length - 1
    const items = array.map(getString)
    switch (array.length) {
      case 0:
        return ''
      case 1:
        return getString(array[0])
      case 2:
        return `${getString(array[0])} ${lastSeparator} ${getString(array[1])}`
      default:
        return `${items.slice(0, lastIndex).join(separator)}${separator} ${lastSeparator} ${items[lastIndex]}`
    }
  },
}
