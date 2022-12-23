<template>
  <slot name="control" />
  <div class="absolute" :class="positionType === 'relative' ? 'left-0 right-0' : ''" :style="style" ref="dropdown">
    <div v-if="state" class="z-10 border border-gray-400 mt-1 max-h-56 min-w-[14em] overflow-auto rounded-md bg-white text-base shadow-lg focus:outline-none" :class="{ 'right-0': right }" tabindex="-1" role="listbox">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { CSSProperties, defineComponent, nextTick } from 'vue'
import SelectionUtils from '~/utils/selectionUtils'

interface Data {
  position: Omit<DOMRectReadOnly, 'toJSON'> | null
  style: CSSProperties
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
      position: null,
      style: {},
    }
  },
  methods: {
    updateStyles() {
      if (this.position) {
        const padding = { x: 0, y: 10 }
        this.style.top = `${this.position.bottom + padding.y}px`
        this.style.left = `${this.position.x + padding.x}px`
      }
    },
    async close(e: MouseEvent) {
      if (!this.$el.contains(e.target)) this.$emit('close')
    },
    handleDropdownPosition() {
      const screenPadding = 16

      const dropdown = this.$refs.dropdown as HTMLElement
      const dropdownRect = dropdown.getBoundingClientRect()
      const dropdownRightX = dropdownRect.x + dropdownRect.width

      if (dropdownRect.x < 0) {
        this.style.transform = `translateX(${dropdownRect.x + screenPadding}px)`
      } else if (dropdownRightX > window.innerWidth) {
        this.style.transform = `translateX(${(window.innerWidth - dropdownRightX) - screenPadding}px)`
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.close)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.close)
  },
  watch: {
    async state(newVal, oldVal) {
      if (newVal && this.positionType === 'cursor') {
        this.position = SelectionUtils.getCaretRect()
        this.updateStyles()
        await nextTick()
        this.handleDropdownPosition()
      } else {
        this.position = null
        this.style = {}
      }
    }
  }
})
</script>
