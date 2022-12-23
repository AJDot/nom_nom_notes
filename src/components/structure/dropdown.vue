<template>
  <slot name="control" />
  <div class="absolute left-0 right-0" :style="styles">
    <div v-if="state" class="z-10 border border-gray-400 mt-1 max-h-56 min-w-[14em] overflow-auto rounded-md bg-white text-base shadow-lg focus:outline-none" :class="{ 'right-0': right }" tabindex="-1" role="listbox">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, StyleValue } from 'vue'
import SelectionUtils from '~/utils/selectionUtils'

interface Data {
  position: Omit<DOMRectReadOnly, 'toJSON'> | null
}

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
    positionType: {
      type: String,
      default: 'relative',
      validator: prop => typeof prop === 'string' && ['relative', 'cursor'].includes(prop)
    },
  },
  emits: {
    close: null,
  },
  data(): Data {
    return {
      position: null
    }
  },
  computed: {
    styles(): StyleValue {
      const style: StyleValue = {}
      if (this.position) {
        const padding = { x: 0, y: 10 }
        style.top = `${this.position.bottom + padding.y}px`
        style.left = `${this.position.x + padding.x}px`
      }
      return style
    }
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
  watch: {
    state(newVal, oldVal) {
      if (newVal && this.positionType === 'cursor') {
        this.position = SelectionUtils.getCaretRect()
      }
    }
  }
})
</script>
