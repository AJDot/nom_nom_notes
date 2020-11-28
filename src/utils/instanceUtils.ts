export const InstanceUtils = {
  isPresent(instance: any): boolean {
    if (instance === null || instance === undefined) {
      return false
    } else if (instance instanceof Array) {
      return instance.length > 0
    } else if (this.isObject(instance)) {
      return Object.keys(instance).length > 0
    } else if (this.isBoolean(instance)) {
      return instance
    } else if (this.isString(instance)) {
      return instance.length > 0
    } else {
      return false
    }
  },
  toArray(instance: any) {
    if (this.isPresent(instance)) {
      return (instance instanceof Array) ? instance : [instance]
    } else return []
  },
  isObject(instance: any) {
    return typeof instance === 'object'
  },
  isBoolean(instance: any) {
    return typeof instance === 'boolean'
  },
  isString(instance: any) {
    return typeof instance === 'string'
  },
  isFunction(instance: any) {
    return typeof instance === 'function'
  },
}
