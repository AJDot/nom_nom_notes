export const InstanceUtils = {
  isPresent(instance: unknown): boolean {
    if (instance === null || instance === undefined) {
      return false
    } else if (Array.isArray(instance)) {
      return instance.length > 0
    } else if (this.isObject(instance)) {
      return Object.keys(instance).length > 0
    } else if (this.isBoolean(instance)) {
      return instance
    } else if (this.isString(instance)) {
      return instance.length > 0
    } else if (this.isFunction(instance)) {
      return true
    } else {
      return false
    }
  },
  toArray<T = unknown>(instance: T | Array<T>): Array<T> {
    if (this.isPresent(instance)) {
      return instance instanceof Array ? instance : [instance]
    } else {
      return []
    }
  },
  isObject(instance: unknown): instance is Record<string, unknown> {
    return typeof instance === 'object'
  },
  isBoolean(instance: unknown): instance is boolean {
    return typeof instance === 'boolean'
  },
  isString(instance: unknown): instance is string {
    return typeof instance === 'string'
  },
  isFunction(
    instance: unknown,
  ): instance is (..._args: Array<unknown>) => unknown {
    return typeof instance === 'function'
  },
}
