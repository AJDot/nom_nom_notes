<template>
  <div>
    <dropdown :state="dropdownState" @close="hideResults">
      <template #control>
        <a-input ref="search" v-model="q" :id="id" type="search" @keyup="search" @keydown.enter.prevent="select(currentResult)" placeholder="Search..." class="mt-1" @keydown.prevent.down="down" @keydown.prevent.up="up" @blur="(makeCurrent(null))" />
      </template>
      <ul>
        <template v-if="hasResults">
          <dropdown-item v-for="(item, i) in results" @click="select(item)" :class="{ 'select-blue': item === currentResult }" :aria-current="(item === currentResult)" :data-test="`item-${i}`">
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
  selector: USelector<SearchResult<never>>
}

export default defineComponent({
  name: 'Search',
  props: {
    searcher: {
      type: Object as () => USearcher<never>,
      required: true,
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
      selector: new Selector<SearchResult<never>>()
    }
  },
  computed: {
    results: {
      get(): Array<SearchResult<never>> {
        return this.selector.items
      },
      set(items: Array<SearchResult<never>>) {
        this.selector.items = items
      }
    },
    currentResult(): SearchResult<never> | null {
      return this.selector.current
    },
    currentIndex(): number | null {
      return this.selector.currentIndex
    },
    hasResults(): boolean {
      return Boolean(this.results.length)
    },
  },
  methods: {
    async search(evt: KeyboardEvent): Promise<void> {
      if (['ArrowUp', 'ArrowDown', 'Enter'].includes(evt.key)) return

      if (this.q) {
        await this.searcher.search(this.q)
        this.setResults(this.searcher.results)
        this.dropdownState = true
      } else {
        this.clearResults()
      }
    },
    setResults(results: Array<SearchResult<never>>) {
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
    async select(item: SearchResult<never> | null): Promise<void> {
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

      if (this.currentResult) {
        $(this.$el)
          .find(`[data-test="item-${this.currentIndex}"]`)
          .get(0)
          ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  },
})
</script>
