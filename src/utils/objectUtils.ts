import { ArrayUtils } from '~/utils/arrayUtils'

export const ObjectUtils = {
  combine<T>(item: T, props: keyof T | Array<keyof T> = [], spreads: keyof T | Array<keyof T> = []): Record<PropertyKey, any> {
    const hash: Record<PropertyKey, any> = {}
    ArrayUtils.wrap(props).forEach(p => {
      Object.assign(hash, { [p]: item[p] })
    })
    ArrayUtils.wrap(spreads).forEach(s => {
      Object.assign(hash, item[s])
    })
    return hash
  },
  dig,
}

export function dig<T, P1 extends keyof T>(obj: T, ...prop1: any[]): T[P1] | undefined | null
export function dig<T, P1 extends keyof T, P2 extends keyof T[P1]>(obj: T, ...props: any[]): T[P1][P2] | undefined | null
export function dig<T, P1 extends keyof T, P2 extends keyof T[P1], P3 extends keyof T[P1][P2]>(obj: T, ...props: any[]): T[P1][P2][P3] | undefined | null
export function dig<T>(obj: T, ...props: any[]): any {
  return obj && props.reduce(
    (result, prop) => {
      if (result === undefined || result === null) return result
      return result[prop]
    },
    obj as any
  )
}
