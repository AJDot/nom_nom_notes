import { Hash, KeysOfType } from 'Interfaces/util_interfaces'

export interface SearchResult {
  label: string
  value: string
}

export interface USearcher {
  results: Array<SearchResult>
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
