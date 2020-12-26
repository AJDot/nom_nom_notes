export const BooleanUtils = {
  toggle(bool: boolean): boolean {
    return !bool
  },
  isStrictBoolean(anything: unknown): anything is boolean {
    return anything === true || anything === false
  },
}
