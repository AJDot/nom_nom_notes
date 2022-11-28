<template>
  <div class="relative mt-1">
    <slot name="control" />
    <slot v-if="state" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ContextMenu',
  props: {
    state: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    close: null,
  },
  methods: {
    async close(e: MouseEvent) {
      if (!this.$el.contains(e.target)) {
        this.$emit('close')
      }
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
