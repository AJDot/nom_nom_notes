export interface Hash<T = any> {
  [key: string]: T
  [key: number]: T
}

export type KeysOfType<T, TProp> = { [K in keyof T]: T[K] extends TProp ? K : never }[keyof T]