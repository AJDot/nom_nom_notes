<template>
  <div>
    <dropdown :state="dropdownState" @close="hideResults">
      <template #control>
        <a-input ref="search" v-model="q" :id="id" type="search" @keyup="search" @keydown.enter.prevent="select(currentResult)" placeholder="Search..." class="mt-1" @keydown.down="down" @keydown.up="up" @blur="(currentResult = null)" />
      </template>
      <ul>
        <template v-if="hasResults">
          <dropdown-item v-for="item in results" @click="select(item)" :class="{ 'select-blue': item === currentResult }">
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
import { defineComponent } from 'vue'
import { SearchResult, USearcher } from 'Interfaces/searchInterfaces'
import AInput from '~/components/structure/a-input.vue'

interface Data {
  q: string
  results: Array<SearchResult<never>>
  currentResult: SearchResult<never> | null
  dropdownState: boolean
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
      results: [],
      dropdownState: false,
      currentResult: null,
    }
  },
  computed: {
    hasResults(): boolean {
      return Boolean(this.results.length)
    },
  },
  methods: {
    async search(evt: KeyboardEvent): Promise<void> {
      if (['ArrowUp', 'ArrowDown', 'Enter'].includes(evt.key)) return

      if (this.q) {
        await this.searcher.search(this.q)
        this.results = this.searcher.results
        this.dropdownState = true
        this.makeCurrent(0)
      } else {
        this.hideResults()
        this.makeCurrent(null)
      }
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
      const length = this.results.length
      let index = length
      if (this.currentResult) {
        index += this.results.indexOf(this.currentResult) + 1
      }
      this.makeCurrent(index)
    },
    up(evt: KeyboardEvent) {
      const length = this.results.length
      let index = length
      if (this.currentResult) {
        index += this.results.indexOf(this.currentResult) - 1
      }
      this.makeCurrent(index)
    },
    makeCurrent(index: number | null) {
      if (index === null) {
        this.currentResult = null
      } else {
        const length = this.results.length
        this.currentResult = this.results[index % length]
      }
    },
  },
})
</script>
