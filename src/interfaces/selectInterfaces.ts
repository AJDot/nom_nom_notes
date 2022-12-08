export interface USelector<Collections extends any[][]> {
  current: Collections[number][number] | null
  currentIndex: number | null
  collections: Collections
  down(): this['current']
  up(): this['current']
  set(index: number | null): this['current']
}