<template>
  <div class="relative">
    <dropdown
      :state="dropdownState"
      @close="hideResults"
    >
      <template #control>
        <a-input
          :id="id"
          ref="search"
          v-model="q"
          type="search"
          placeholder="Search..."
          :disabled="disabled"
          @keyup="search"
          @keydown.enter.prevent="select(currentResult)"
          @keydown.prevent.down="down"
          @keydown.prevent.up="up"
          @blur="(makeCurrent(null))"
        />
      </template>
      <ul>
        <template v-if="hasResults">
          <dropdown-item
            v-for="(item, i) in results.flat()"
            :key="item.value"
            :class="{ 'select-blue': item === currentResult }"
            :aria-current="(item === currentResult)"
            :data-select="`item-${i}`"
            @click="select(item)"
          >
            <dropdown-item-button>
              {{ item.label }}
            </dropdown-item-button>
          </dropdown-item>
        </template>
        <dropdown-item-empty v-else>
          No results found.
        </dropdown-item-empty>
      </ul>
    </dropdown>
  </div>
</template>

<script lang="ts">
import AInput from '@/structure/a-input.vue'
import { SearchResult, USearchDirector, USearcher } from 'Interfaces/searchInterfaces'
import { defineComponent, nextTick } from 'vue'
import { USelector } from 'Interfaces/selectInterfaces'
import SearcherDirector from '~/utils/searchDirector'
import Selector from '~/utils/selector'

interface Data {
  q: string
  dropdownState: boolean
  selector: USelector<SearchResult<unknown>[][]>
}

export default defineComponent({
  name: 'Search',
  props: {
    searcher: {
      type: Object as () => USearcher<unknown>,
      required: false,
      default: null,
    },
    searchers: {
      type: Array as () => Array<USearcher<unknown>>,
      required: false,
      default: (props) => props.searcher ? [props.searcher] : [],
    },
    id: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    select: null,
  },
  data(): Data {
    return {
      q: '',
      dropdownState: false,
      selector: new Selector<SearchResult<unknown>[][]>(),
    }
  },
  computed: {
    searchDirector(): USearchDirector<unknown> {
      return new SearcherDirector<unknown>({ searchers: this.searchers })
    },
    results: {
      get(): Array<Array<SearchResult<unknown>>> {
        return this.selector.collections
      },
      set(collections: Array<Array<SearchResult<unknown>>>) {
        this.selector.collections = collections
      },
    },
    currentResult(): SearchResult<unknown> | null {
      return this.selector.current
    },
    currentIndex(): number | null {
      return this.selector.currentIndex
    },
    hasResults(): boolean {
      return Boolean(this.results.some(items => items.length))
    },
  },
  created() {
    if (!this.searchers.length) {
      console[import.meta.env.DEV ? 'error' : 'warn']('Searcher must be provided')
    }
  },
  methods: {
    async search(evt: KeyboardEvent): Promise<void> {
      if (['ArrowUp', 'ArrowDown', 'Enter'].includes(evt.key)) return

      if (this.q) {
        await this.searchDirector.search(this.q)
        this.setResults(this.searchDirector.results)
        this.dropdownState = true
      } else {
        this.clearResults()
      }
    },
    setResults(results: Array<Array<SearchResult<unknown>>>) {
      this.results = results
      this.makeCurrent(0)
    },
    clearResults() {
      this.results = []
      this.hideResults()
      this.makeCurrent(null)
    },
    async hideResults(): Promise<void> {
      this.dropdownState = false
    },
    async select(item: SearchResult<unknown> | null): Promise<void> {
      if (!item) return

      this.q = ''
      this.hideResults()
      this.$emit('select', { data: item })
      const search = this.$refs.search as InstanceType<typeof AInput>
      search.$el.focus()
    },
    down(_evt: KeyboardEvent) {
      this.selector.down()
      this.currentScrollIntoView()
    },
    up(_evt: KeyboardEvent) {
      this.selector.up()
      this.currentScrollIntoView()
    },
    makeCurrent(index: number | null) {
      this.selector.set(index)
      this.currentScrollIntoView()
    },
    async currentScrollIntoView() {
      await nextTick()
      await nextTick() // two are necessary to make sure dropdown list is rendered

      if (this.currentResult && this.currentIndex) {
        $(this.$el)
          .find(`[data-select-id="item-${this.currentIndex}"]`)
          .get(0)
          ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    },
  },
})
</script>
