<template>
  <div>
    <dropdown :state="dropdownState" @close="hideResults">
      <template #control>
        <a-input ref="search" v-model="q" :id="id" type="search" @keyup="search" @keydown.enter.prevent="select(currentResult)" placeholder="Search..." class="mt-1" @keydown.prevent.down="down" @keydown.prevent.up="up" @blur="(makeCurrent(null))" />
      </template>
      <ul>
        <template v-if="hasResults">
          <dropdown-item v-for="(item, i) in results.flat()" @click="select(item)" :class="{ 'select-blue': item === currentResult }" :aria-current="(item === currentResult)" :data-select="`item-${i}`">
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
import { SearchResult, USearcher } from 'Interfaces/searchInterfaces'
import { defineComponent, nextTick } from 'vue'
import { USelector } from '~/interfaces/selectInterfaces'
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
  },
  emits: {
    select: null,
  },
  data(): Data {
    return {
      q: '',
      dropdownState: false,
      selector: new Selector<SearchResult<unknown>[][]>()
    }
  },
  computed: {
    results: {
      get(): Array<Array<SearchResult<unknown>>> {
        return this.selector.collections
      },
      set(collections: Array<Array<SearchResult<unknown>>>) {
        this.selector.collections = collections
      }
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
  methods: {
    async search(evt: KeyboardEvent): Promise<void> {
      if (['ArrowUp', 'ArrowDown', 'Enter'].includes(evt.key)) return

      if (this.q) {
        await Promise.all(this.searchers.map(searcher => searcher.search(this.q)))
        this.setResults(this.searchers.map(searcher => searcher.results))
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
      this.$emit('select', { data: item });
      (<InstanceType<typeof AInput>>this.$refs.search).$el.focus()
    },
    down(evt: KeyboardEvent) {
      this.selector.down()
      this.currentScrollIntoView()
    },
    up(evt: KeyboardEvent) {
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
    }
  },
  created() {
    if (!this.searchers.length) {
      console[import.meta.env.DEV ? 'error' : 'warn']('Searcher must be provided')
    }
  },
})
</script>
