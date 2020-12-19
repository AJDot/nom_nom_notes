import { Sortable } from 'Interfaces/modelInterfaces'

export default class Sorter {
  isFirst(items: Array<Sortable>, item: Sortable): boolean {
    return this.sort(items)[0] === item
  }

  isLast(items: Array<Sortable>, item: Sortable): boolean {
    return this.sort(items)[items.length - 1] === item
  }

  moveUp(items: Array<Sortable>, item: Sortable): void {
    const sorted = this.sort(items)
    const thisIndex = sorted.indexOf(item)
    const thisSortOrder = item.sortOrder
    const otherItem = sorted[thisIndex - 1]
    item.sortOrder = otherItem.sortOrder
    otherItem.sortOrder = thisSortOrder
  }

  moveDown(items: Array<Sortable>, item: Sortable): void {
    const sorted = this.sort(items)
    const thisIndex = sorted.indexOf(item)
    const thisSortOrder = item.sortOrder
    const otherItem = sorted[thisIndex + 1]
    item.sortOrder = otherItem.sortOrder
    otherItem.sortOrder = thisSortOrder
  }

  sort(items: Array<Sortable>): Array<Sortable> {
    return items.slice().sort((a, b) => a.sortOrder - b.sortOrder)
  }
}
