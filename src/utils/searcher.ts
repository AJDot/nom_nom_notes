import { SearchOptions, SearchResult, USearcher } from 'Interfaces/searchInterfaces'
import { KeysOfType } from 'Interfaces/util_interfaces'
import { securedAxiosInstance } from '~/backend/axios'

function getValue<T, V>(item: T, getter: KeysOfType<T, V> | ((item: T) => V)): V {
  if (getter instanceof Function) {
    return getter(item)
  } else {
    return item[getter] as unknown as V
  }
}

export default class Searcher<T, V> implements USearcher {
  options: SearchOptions<T, V>

  constructor(options: SearchOptions<T, V>) {
    this.options = options
  }

  get results(): SearchResult[] {
    return this.options.collection.map(item => {
      return {
        label: getValue(item, this.options.label),
        value: getValue(item, this.options.valueString),
      }
    })
  }

  async search(q = ''): Promise<void> {
    if (this.options.endpoint) {
      const response = await securedAxiosInstance.get(
        this.options.endpoint,
        {
          params: {
            query: Object.assign({
              term: q,
            },
            this.options.query),
          },
        })
      console.log(response)
    }
  }
}
