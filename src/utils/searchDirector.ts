import { SearchDirectorOptions, SearchResult, USearchDirector } from '~/interfaces/searchInterfaces'

export default class SearchDirector<T> implements USearchDirector<T> {
  // eslint-disable-next-line no-useless-constructor
  constructor(private options: SearchDirectorOptions<T>) {
  }

  get results(): Array<Array<SearchResult<T>>> {
    return this.options.searchers.map(x => x.results)
  }

  async search(q = ''): Promise<void> {
    await Promise.all(this.options.searchers.map(x => x.search(q)))
  }
}
