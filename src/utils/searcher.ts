import { AxiosResponse } from 'axios'
import { SearchOptions, SearchResult, USearcher } from 'Interfaces/searchInterfaces'
import { ServerRecordData, ServerRecordResponse } from 'Interfaces/serverInterfaces'
import { KeysOfType } from 'Interfaces/utilInterfaces'
import { securedAxiosInstance } from '~/backend/axios'
import { ObjectUtils } from '~/utils/objectUtils'
import { SearchOptionsEndpoint, SearchOptionsLocal } from './../interfaces/searchInterfaces'

function getValue<T, V>(item: T, getter: KeysOfType<T, V> | ((item: T, options: { q: string }) => V), options: { q: string }): V {
  if (getter instanceof Function) {
    return getter(item, options)
  } else {
    return item[getter] as unknown as V
  }
}

export default class Searcher<T> implements USearcher<T> {
  results: Array<SearchResult<T>> = []

  // eslint-disable-next-line no-useless-constructor
  constructor(private options: SearchOptions<T>) {
  }

  async search(q = ''): Promise<void> {
    if ('endpoint' in this.options) {
      return this.searchEndpoint(q, this.options)
    } else {
      return this.searchLocal(q, this.options)
    }
  }

  private async searchEndpoint(q = '', options: SearchOptionsEndpoint<T>): Promise<void> {
    const response: AxiosResponse<ServerRecordResponse<T, Array<ServerRecordData<T>>>> = await securedAxiosInstance.get(
      options.endpoint,
      {
        params: {
          query: Object.assign({},
            options.query,
            { term: q },
          ),
        },
      })
    this.results = response.data.data.map(item => {
      const obj = ObjectUtils.combine(item, 'id', 'attributes') as T
      return {
        type: getValue(options, 'type', { q }),
        label: getValue(obj, options.label, { q }),
        value: getValue(obj, options.valueString, { q }),
        raw: obj,
      }
    })
  }

  private async searchLocal(q = '', options: SearchOptionsLocal<T>): Promise<void> {
    const matcher: SearchOptionsLocal<T>['matcher'] = options.matcher ?? this.getDefaultLocalMatcher(options)
    const collection = typeof options.collection === 'function' ? options.collection() : options.collection
    this.results = collection.reduce((agg, item) => {
      if (matcher(item, q)) {
        agg.push({
          type: getValue(options, 'type', { q }),
          label: getValue(item, options.label, { q }),
          value: getValue(item, options.valueString, { q }),
          raw: item,
        })
      }
      return agg
    }, [] as Searcher<T>['results'])
  }

  private getDefaultLocalMatcher(options: SearchOptionsLocal<T>): (item: T, q: string) => boolean {
    return (item: T, q: string) => {
      const valueString: string = getValue(item, options.valueString, { q })
      return Boolean(valueString.match(q))
    }
  }
}
