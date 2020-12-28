import { SearchOptions, SearchResult, USearcher } from 'Interfaces/searchInterfaces'
import { KeysOfType } from 'Interfaces/util_interfaces'
import { securedAxiosInstance } from '~/backend/axios'
import { AxiosResponse } from 'axios'
import { ServerData, ServerResponse } from 'Interfaces/serverInterfaces'
import { ObjectUtils } from '~/utils/objectUtils'

function getValue<T, V>(item: T, getter: KeysOfType<T, V> | ((item: T) => V)): V {
  if (getter instanceof Function) {
    return getter(item)
  } else {
    return item[getter] as unknown as V
  }
}

export default class Searcher<T, V> implements USearcher<T> {
  options: SearchOptions<T, V>
  results: Array<SearchResult<T>> = []

  constructor(options: SearchOptions<T, V>) {
    this.options = options
  }

  async search(q = ''): Promise<void> {
    if (this.options.endpoint) {
      // search against API
      const response: AxiosResponse<ServerResponse<T, Array<ServerData<T>>>> = await securedAxiosInstance.get(
        this.options.endpoint,
        {
          params: {
            query: Object.assign({
              term: q,
            },
            this.options.query),
          },
        })
      this.results = response.data.data.map(item => {
        const obj = ObjectUtils.combine(item, 'id', 'attributes') as T
        return {
          label: getValue(obj, this.options.label),
          value: getValue(obj, this.options.valueString),
          raw: obj,
        }
      })
    } else {
      // search locally
      this.results = this.options.collection.reduce((agg, item) => {
        const label: string = getValue(item, this.options.label)
        if (label.match(q)) {
          agg.push({
            label: label,
            value: getValue(item, this.options.valueString),
            raw: item,
          })
        }
        return agg
      }, [] as Searcher<T, V>['results'])
    }
  }
}
