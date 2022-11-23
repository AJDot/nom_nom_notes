<template>
  <input
    ref="search"
    v-model="q"
    v-bind="$attrs"
    type="search"
    @keyup="search"
    @keydown.enter.prevent
  >
  <context-menu
    v-if="q"
    ref="menu"
    :display="menuEvent"
    :focus="false"
    :width="$refs.search"
    @close="hideResults"
  >
    <ul class="dropdown">
      <template v-if="hasResults">
        <li
          v-for="item in results"
          :key="item.value"
          class="dropdown-item"
          @click.capture="select(item)"
        >
          <button
            type="button"
            class="dropdown-btn"
          >
            {{ item.label }}
          </button>
        </li>
      </template>
      <li
        v-else
        class="dropdown-item"
      >
        No results found.
      </li>
    </ul>
  </context-menu>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue'
import { SearchResult, USearcher } from 'Interfaces/searchInterfaces'

interface Data {
  q: string
  results: Array<SearchResult<never>>
  menuEvent: KeyboardEvent | null
}

export default defineComponent({
  name: 'Search',
  props: {
    searcher: {
      type: Object as () => USearcher<never>,
      required: true,
    },
  },
  emits: {
    select: null,
  },
  data(): Data {
    return {
      q: '',
      results: [],
      menuEvent: null,
    }
  },
  computed: {
    hasResults(): boolean {
      return Boolean(this.results.length)
    },
  },
  methods: {
    async search(evt: KeyboardEvent): Promise<void> {
      await this.searcher.search(this.q)
      this.results = this.searcher.results
      this.showResults(evt)
    },
    showResults(evt: KeyboardEvent): void {
      this.menuEvent = evt
    },
    async hideResults(): Promise<void> {
      await nextTick()
      this.menuEvent = null
    },
    select(item: SearchResult<never>): void {
      this.q = ''
      this.$emit('select', { data: item })
    },
  },
})
</script>
