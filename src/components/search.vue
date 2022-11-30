<template>
  <div>
    <dropdown :state="dropdownState" @close="hideResults">
      <template #control>
        <a-input ref="search" v-model="q" :id="id" type="search" @keyup="search" @keydown.enter.prevent placeholder="Search..." class="mt-1" />
      </template>
      <ul>
        <template v-if="hasResults">
          <dropdown-item v-for="item in results" :key="item.value" @click.capture="select(item)">
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
import { defineComponent, nextTick } from 'vue'
import { SearchResult, USearcher } from 'Interfaces/searchInterfaces'
import AInput from '~/components/structure/a-input.vue'

interface Data {
  q: string
  results: Array<SearchResult<never>>
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
    }
  },
  computed: {
    hasResults(): boolean {
      return Boolean(this.results.length)
    },
  },
  methods: {
    async search(evt: KeyboardEvent): Promise<void> {
      if (this.q) {
        await this.searcher.search(this.q)
        this.results = this.searcher.results
        this.dropdownState = true
      } else {
        this.hideResults()
      }
    },
    async hideResults(): Promise<void> {
      this.dropdownState = false
    },
    async select(item: SearchResult<never>): Promise<void> {
      this.q = ''
      this.hideResults()
      this.$emit('select', { data: item });
      (<InstanceType<typeof AInput>>this.$refs.search).$el.focus()
    },
  },
})
</script>
