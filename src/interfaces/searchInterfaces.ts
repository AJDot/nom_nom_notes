import { KeysOfType } from 'Interfaces/utilInterfaces'

export type SearchType = 'result' | 'command'

export interface SearchOptions<T, V> {
  type: SearchType
  label: KeysOfType<T, string> | ((item: T, options: { q: string }) => string)
  value: KeysOfType<T, V> | ((item: T, options: { q: string }) => V)
  valueString: KeysOfType<T, string> | ((item: T, options: { q: string }) => string)
  collection: Array<T>
  endpoint?: string
  query?: Record<PropertyKey, any>
}

export interface SearchResult<V, Type extends SearchType = SearchType> {
  type: Type
  label: string
  value: string
  raw: V
}

export interface USearcher<T> {
  readonly results: Array<SearchResult<T>>
  search(q: string): Promise<void>
}

export interface SearchDirectorOptions<T> {
  searchers: Array<USearcher<T>>
}

export interface USearchDirector<T> {
  readonly results: Array<USearcher<T>['results']>
  search(q: string): Promise<void>
}