import { Hash, KeysOfType } from 'Interfaces/utilInterfaces'

export interface SearchResult<T> {
  label: string
  value: string
  raw: T
}

export interface USearcher<T> {
  results: Array<SearchResult<T>>
  search(q: string): Promise<void>
}

export interface SearchOptions<T, V> {
  label: KeysOfType<T, string> | ((item: T) => string)
  value: KeysOfType<T, V> | ((item: T) => V)
  valueString: KeysOfType<T, string> | ((item: T) => string)
  collection: Array<T>
  endpoint?: string
  query?: Hash
}
