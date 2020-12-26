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

export default class Searcher<T, V> implements USearcher {
  options: SearchOptions<T, V>
  results: Array<SearchResult> = []

  constructor(options: SearchOptions<T, V>) {
    this.options = options
  }

  async search(q = ''): Promise<void> {
    if (this.options.endpoint) {
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
        }
      })
    }
  }
}
