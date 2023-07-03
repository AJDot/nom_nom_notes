export type KeysOfType<T, TProp> = { [K in keyof T]: T[K] extends TProp ? K : never }[keyof T]

export type Mutable<T> = { -readonly [K in keyof T]: T[K] }
