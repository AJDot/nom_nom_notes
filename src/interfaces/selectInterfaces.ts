export interface USelector<T> {
  current: T | null
  currentIndex: number | null
  items: Array<T>
  down(): this['current']
  up(): this['current']
  set(index: number | null): this['current']
}