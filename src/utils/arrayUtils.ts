import { InstanceUtils } from '~/utils/instanceUtils'
import { Hash } from 'Interfaces/utilInterfaces'
import { NumberUtils } from '~/utils/numberUtils'

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
  gatherBy<T extends Hash>(array: T[], key: string, props: string | Array<string> = [], spreads: string | Array<string> = []): Hash<Array<T>> {
    const gathered: Hash = {}
    ArrayUtils.wrap(array).forEach((item) => {
      const val = item[key]
      if (!gathered[val]) gathered[val] = []
      const hash: Hash = {}
      this.wrap(props).forEach(p => { hash[p] = item[p] })
      this.wrap(spreads).forEach(s => { Object.assign(hash, item[s]) })
      gathered[val].push(hash)
    })
    return gathered
  },
  remove<T>(items: T[], item: T): T[] {
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i] === item) items.splice(i, 1)
    }
    return items
  },
  add<T>(items: T[], item: T, position?: number): T[] {
    if (items.includes(item)) {
      if (position !== null) {
        this.move(items, item, position)
      } // don't do anything if included in array but no position provided
    } else {
      position = NumberUtils.isInteger(position) ? position : items.length
      items.splice(position, 0, item)
    }
    return items
  },
  toggle<T>(items: T[], item: T): T[] {
    if (items.includes(item)) {
      return this.remove(items, item)
    } else {
      return this.add(items, item)
    }
  },
  // if new index is greater than length then just add as last item
  moveIndex<T>(items: T[], oldIndex: number, newIndex: number): T[] {
    if (newIndex >= items.length) newIndex = items.length
    items.splice(newIndex, 0, items.splice(oldIndex, 1)[0])
    return items
  },
  move: function<T>(items: T[], item: T, newIndex: number = items.length): T[] {
    const oldIndex = items.indexOf(item)
    return this.moveIndex(items, oldIndex, newIndex)
  },
  moveUp: function<T>(items: T[], item: T): T[] {
    const oldIndex = items.indexOf(item)
    return this.moveIndex(items, oldIndex, oldIndex - 1)
  },
  moveDown: function<T>(items: T[], item: T): T[] {
    const oldIndex = items.indexOf(item)
    return this.moveIndex(items, oldIndex, oldIndex + 1)
  },
}
