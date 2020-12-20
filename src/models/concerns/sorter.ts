import { Sortable } from 'Interfaces/modelInterfaces'

export default class Sorter {
  isFirst<T extends Sortable>(items: Array<T>, item: T): boolean {
    return this.sort(items)[0] === item
  }

  isLast<T extends Sortable>(items: Array<T>, item: T): boolean {
    return this.sort(items)[items.length - 1] === item
  }

  moveUp<T extends Sortable>(items: Array<T>, item: T): void {
    const sorted = this.sort(items)
    const thisIndex = sorted.indexOf(item)
    const thisSortOrder = item.sortOrder
    const otherItem = sorted[thisIndex - 1]
    item.sortOrder = otherItem.sortOrder
    otherItem.sortOrder = thisSortOrder
  }

  moveDown<T extends Sortable>(items: Array<T>, item: T): void {
    const sorted = this.sort(items)
    const thisIndex = sorted.indexOf(item)
    const thisSortOrder = item.sortOrder
    const otherItem = sorted[thisIndex + 1]
    item.sortOrder = otherItem.sortOrder
    otherItem.sortOrder = thisSortOrder
  }

  sort<T extends Sortable>(items: Array<T>): Array<T> {
    return items.slice().sort((a, b) => a.sortOrder - b.sortOrder)
  }
}
