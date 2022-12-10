import { SearchOptions, SearchResult, USearcher } from 'Interfaces/searchInterfaces'
import { KeysOfType } from 'Interfaces/utilInterfaces'
import { securedAxiosInstance } from '~/backend/axios'
import { AxiosResponse } from 'axios'
import { ServerData, ServerResponse } from 'Interfaces/serverInterfaces'
import { ObjectUtils } from '~/utils/objectUtils'

function getValue<T, V>(item: T, getter: KeysOfType<T, V> | ((item: T, options: { q: string }) => V), options: { q: string }): V {
  if (getter instanceof Function) {
    return getter(item, options)
  } else {
    return item[getter] as unknown as V
  }
}

export default class Searcher<T, V> implements USearcher<T> {
  results: Array<SearchResult<T>> = []

  constructor(private options: SearchOptions<T, V>) {
  }

  async search(q = ''): Promise<void> {
    if (this.options.endpoint) {
      // search against API
      const response: AxiosResponse<ServerResponse<T, Array<ServerData<T>>>> = await securedAxiosInstance.get(
        this.options.endpoint,
        {
          params: {
            query: Object.assign({},
              this.options.query,
              { term: q, },
            ),
          },
        })
      this.results = response.data.data.map(item => {
        const obj = ObjectUtils.combine(item, 'id', 'attributes') as T
        return {
          type: getValue(this.options, 'type', { q }),
          label: getValue(obj, this.options.label, { q }),
          value: getValue(obj, this.options.valueString, { q }),
          raw: obj,
        }
      })
    } else {
      // search locally
      this.results = this.options.collection.reduce((agg, item) => {
        const valueString: string = getValue(item, this.options.valueString, { q })
        if (valueString.match(q)) {
          agg.push({
            type: getValue(this.options, 'type', { q }),
            label: getValue(item, this.options.label, { q }),
            value: getValue(item, this.options.valueString, { q }),
            raw: item,
          })
        }
        return agg
      }, [] as Searcher<T, V>['results'])
    }
  }
}
