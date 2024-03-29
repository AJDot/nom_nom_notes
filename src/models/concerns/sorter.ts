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

  reorder<T extends Sortable>(items: Array<T>, oldPosition: number, newPosition: number): void {
    const movedItem: T | undefined = items.find(s => s.sortOrder === oldPosition)
    if (!movedItem) return
    movedItem.sortOrder = newPosition
    items
      .filter(item => item !== movedItem)
      .sort((a, b) => {
        return a.sortOrder - b.sortOrder
      })
      .forEach((item, i) => {
        if (i >= newPosition) i += 1
        item.sortOrder = i
      })
  }
}
