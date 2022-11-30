<template>
  <div class="relative">
    <slot name="control" />
    <div v-if="state" class="absolute z-10 border border-gray-400 mt-1 max-h-56 w-full min-w-[14em] overflow-auto rounded-md bg-white text-base shadow-lg focus:outline-none" :class="{ 'right-0': right }" tabindex="-1" role="listbox">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Dropdown',
  props: {
    state: {
      type: Boolean,
      default: false,
    },
    right: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    close: null,
  },
  methods: {
    async close(e: MouseEvent) {
      if (!this.$el.contains(e.target)) this.$emit('close')
    },
  },
  mounted() {
    document.addEventListener('click', this.close)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.close)
  },
})
</script>
