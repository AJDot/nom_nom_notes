import { USelector } from './../interfaces/selectInterfaces'

export default class Selector<T> implements USelector<T> {
  current: T | null = null

  constructor(private _items: Array<T> = []) {
  }

  get currentIndex(): number | null {
    if (!this.current) return null

    return this.items.indexOf(this.current)
  }

  get items(): Array<T> {
    return this._items
  }

  set items(value: Array<T>) {
    this.current = null
    this._items = value
  }

  set(index: number | null): this['current'] {
    if (index === null) {
      this.current = null
    } else {
      this.current = this.items[index % this.items.length]
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
    let index = this.items.length
    if (this.current) index += this.items.indexOf(this.current) + dx
    return this.set(index)
  }
}
