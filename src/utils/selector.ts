import { USelector } from './../interfaces/selectInterfaces'

export default class Selector<Collections extends unknown[][]> implements USelector<Collections> {
  current: Collections[number][number] | null = null

  // eslint-disable-next-line no-useless-constructor
  constructor(private _collections: Collections = [] as unknown as Collections) {
  }

  get currentIndex(): number | null {
    if (!this.current) return null

    return this.collections.reduce((all, items) => all.concat(items), []).indexOf(this.current)
  }

  get collections(): Collections {
    return this._collections
  }

  set collections(value: Collections) {
    this.current = null
    this._collections = value
  }

  set(index: number | null): this['current'] {
    if (index === null) {
      this.current = null
    } else {
      const allItems = this.collections.reduce((all, items) => all.concat(items), [])
      this.current = allItems[index % allItems.length]
    }
    return this.current
  }

  up(): this['current'] {
    return this.step(-1)
  }

  down(): this['current'] {
    return this.step(1)
  }

  private step(dx: number): this['current'] {
    let index = this.collections.reduce((sum, items) => sum + items.length, 0)
    if (this.currentIndex !== null) {
      index += this.currentIndex + dx
    }

    return this.set(index)
  }
}
