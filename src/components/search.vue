<template>
  <input
    v-model="q"
    type="search"
  >
  <ul>
    <li
      v-for="item in results"
      :key="item.value"
    >
      {{ item.label }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { SearchResult, USearcher } from 'Interfaces/searchInterfaces'

interface Data {
  q: string
}

export default defineComponent({
  name: 'Search',
  props: {
    searcher: {
      type: Object as () => USearcher,
      required: true,
    },
  },
  emits: {},
  data(): Data {
    return {
      q: '',
    }
  },
  computed: {
    results(): Array<SearchResult> {
      return this.searcher.results
    },
  },
  watch: {
    async q(newVal: string, oldVal: string) {
      if (newVal !== oldVal) {
        await this.searcher.search(newVal)
      }
    },
  },
})
</script>
