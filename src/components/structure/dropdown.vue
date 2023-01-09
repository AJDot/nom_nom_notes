<template>
  <div @click.capture="storeEvent">
    <slot name="control" />
  </div>
  <div class="absolute z-10" :class="positionClasses" :style="style" ref="dropdown">
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
  closeBuffer: boolean // opening dropdown with button immediately triggers close emit - ignore first close event if opened with mouse
  controlClickEvent: MouseEvent | null
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
      validator: prop => typeof prop === 'string' && ['relative', 'cursor', 'mouse'].includes(prop)
    },
    openEvent: {
      type: [
        Object as () => MouseEvent,
      ],
      required: false,
      default: null
    },
  },
  emits: {
    close: null,
  },
  data(): Data {
    return {
      position: null,
      style: {},
      closeBuffer: this.positionType === 'mouse',
      controlClickEvent: null
    }
  },
  computed: {
    positionClasses(): string {
      switch (this.positionType) {
        case 'relative':
          return 'left-0 right-0'
        default:
          return ''
      }
    },
  },
  methods: {
    updateStyles() {
      if (this.position) {
        const padding = { x: 5, y: 15 }
        this.style.top = `${this.position.bottom + padding.y}px`
        this.style.left = `${this.position.x + padding.x}px`
      }
    },
    async close(e: MouseEvent) {
      if (this.closeBuffer) {
        this.closeBuffer = false
        return
      }
      const dropdown = this.$refs.dropdown as HTMLElement
      if (!dropdown) return

      if (!dropdown.contains(e.target as Node)) this.$emit('close')
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
    },
    storeEvent(event) {
      this.controlClickEvent = event
    }
  },
  beforeDestroy() {
    document.removeEventListener('click', this.close)
  },
  watch: {
    async state(newVal, oldVal) {
      if (newVal) {
        document.addEventListener('click', this.close)
      } else {
        document.removeEventListener('click', this.close)
      }
      this.closeBuffer = this.positionType === 'mouse'

      if (!newVal) {
        this.position = null
        this.style = {}
      } else if (this.positionType === 'cursor') {
        this.position = SelectionUtils.getCaretRect()
        this.updateStyles()
        await nextTick()
        this.handleDropdownPosition()
      } else if (this.positionType === 'mouse') {
        const rect = (<HTMLElement>this.$refs.dropdown).getBoundingClientRect()
        const dx = (this.openEvent ?? this.controlClickEvent).x - rect.right
        const dy = (this.openEvent ?? this.controlClickEvent).y - rect.bottom

        this.position = {
          y: dy,
          top: dy,
          bottom: dy,
          x: dx,
          left: dx,
          right: dx,
          height: 0,
          width: 0,
        }
        this.updateStyles()
        await nextTick()
        this.handleDropdownPosition()
      }
    }
  }
})
</script>
