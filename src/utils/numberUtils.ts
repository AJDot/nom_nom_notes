export const NumberUtils = {
  isInteger(val: unknown): val is boolean {
    return this.toIntOrNull(val) !== null
  },
  toIntOrNull(val: unknown): number | null {
    const int = parseInt(val as string, 10)
    if (isNaN(int)) {
      return null
    }
    return int
  },
}
