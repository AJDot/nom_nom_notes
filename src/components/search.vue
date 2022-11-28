<template>
  <div class="relative">
    <context-menu :state="dropdownState" @close="hideResults" class="absolute w-full">
      <template #control>
        <a-input ref="search" v-model="q" v-bind="$attrs" type="search" @keyup="search" @keydown.enter.prevent placeholder="Search..." class="mt-1" />
      </template>
      <ul class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none focus-visible:outline-none sm:text-sm" tabindex="-1" role="listbox">
        <template v-if="hasResults">
          <li v-for="item in results" :key="item.value" @click.capture="select(item)" class="text-gray-900 relative cursor-default select-none hover:bg-gray-300 focus-within:bg-gray-300">
            <button type="button" class="w-full h-full py-2 pl-3 flex items-center focus:outline-none">
              {{ item.label }}
            </button>
          </li>
        </template>
        <li v-else class="text-gray-900 relative cursor-default select-none py-2 pl-3">
          No results found.
        </li>
      </ul>
    </context-menu>
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
