<template>
  <div
    v-if="show"
    class="context-menu-mask"
    tabindex="-1"
    @click.self="handleOutsideClick"
    @keyup.esc="handleOutsideClick"
  >
    <div
      ref="context"
      :style="style"
      tabindex="0"
      class="context-menu"
      @blur="close"
      @click="close"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue'
// eslint-disable-next-line no-undef
import TriggeredEvent = JQuery.TriggeredEvent

interface Data {
  left: number
  top: number
  edgePadding: number
  show: boolean
  timeout: number | null
}

export default defineComponent({
  name: 'ContextMenu',
  props: {
    display: MouseEvent, // prop detect if we should show context menu
    outsideClick: {
      type: Boolean,
      default: true,
    },
    fixed: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    close: null,
  },
  data(): Data {
    return {
      left: 0, // left position
      top: 0, // top position
      edgePadding: 50,
      show: false, // affect display of context menu
      timeout: null,
    }
  },
  computed: {
    // get position of context menu
    style(): { top: string, left: string } {
      return {
        top: this.top + 'px',
        left: this.left + 'px',
      }
    },
  },
  watch: {
    display(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.open(newVal)
      }
    },
  },
  updated() {
    this.reposition()
  },
  mounted() {
    $(window).on('resize.contextMenu', () => {
      if (this.timeout) clearTimeout(this.timeout)
      this.timeout = window.setTimeout(this.reposition, 300)
    })
  },
  beforeUnmount() {
    $(window).off('resize.contextMenu')
  },
  methods: {
    // closes context menu
    async close() {
      this.$emit('close')
      await nextTick()
      this.show = false
      this.left = 0
      this.top = 0
    },
    async open(evt: MouseEvent) {
      this.show = true
      await nextTick()
      const position = this.getPositionFromEvent(evt)
      this.setPosition(position.top, position.left)
      this.focus()
    },
    focus() {
      const input = $(this.$el).find(':input').get(0);
      (input || this.$el).focus()
    },
    setPosition(top: number, left: number) {
      const menu: HTMLElement = this.$refs.context as HTMLElement
      let maxHeight = 0
      let maxWidth = 0
      const minimumHeight = 0
      if (menu) {
        maxHeight = window.innerHeight - minimumHeight - this.edgePadding
        maxWidth = window.innerWidth - menu.offsetWidth - this.edgePadding
      }

      this.top = Math.max(Math.min(top, maxHeight), this.edgePadding)
      this.left = Math.max(Math.min(left, maxWidth), this.edgePadding)
    },
    reposition(event?: MouseEvent | TriggeredEvent) {
      let newCoords = { top: this.top, left: this.left }
      if (event) {
        newCoords = this.recalculatePosition(event)
      }
      this.setPosition(newCoords.top, newCoords.left)
    },
    getPositionFromEvent(event: MouseEvent | TriggeredEvent): { top: number, left: number } {
      const position = {
        top: event.clientY || 0,
        left: event.clientX || 0,
      }
      if (this.fixed || (!position.top && !position.left)) {
        let target: Element | null = null
        if ('relatedTarget' in event) {
          target = (event.target || event.relatedTarget) as Element
        } else {
          target = event.target as Element
        }
        const rect = target.getBoundingClientRect()
        position.top = rect.bottom
        position.left = rect.left
      }
      return position
    },
    recalculatePosition(event: MouseEvent | TriggeredEvent) {
      return this.getPositionFromEvent(event)
    },
    handleOutsideClick() {
      if (this.outsideClick) this.close()
    },
  },
})
</script>
