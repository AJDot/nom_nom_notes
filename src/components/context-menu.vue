<template>
  <div
    v-if="show"
    ref="mask"
    class="context-menu-mask"
    tabindex="-1"
    @click.self="handleOutsideClick"
    @keyup.esc="handleOutsideClick"
  >
    <!-- <div
      ref="context"
      :style="style"
      tabindex="0"
      class="context-menu"
      @blur="close"
      @click="close"
    >
      <slot />
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue'
// eslint-disable-next-line no-undef
import TriggeredEvent = JQuery.TriggeredEvent

interface Position<T = number> {
  top: T
  left: T
}

interface Style {
  top: string
  left: string
  width?: string
}

interface Data extends Position {
  show: boolean
  timeout: number | null
}

type ContextMenuEvent = MouseEvent | KeyboardEvent

export default defineComponent({
  name: 'ContextMenu',
  props: {
    display: {
      type: Object as () => ContextMenuEvent, // prop detect if we should show context menu
      default: null,
    },
    outsideClick: {
      type: Boolean,
      default: true,
    },
    fixed: {
      type: Boolean,
      default: false,
    },
    focus: {
      type: Boolean,
      default: false,
    },
    width: {
      type: HTMLElement,
      default: null,
    },
    edge: {
      type: Number,
      default: 50,
    },
  },
  emits: {
    close: null,
  },
  data(): Data {
    return {
      left: 0, // left position
      top: 0, // top position
      show: false, // affect display of context menu
      timeout: null,
    }
  },
  computed: {
    // get position of context menu
    style(): Style {
      // const style: Style = {
      //   top: this.top + 'px',
      //   left: this.left + 'px',
      // }
      // if (this.width) {
      //   const maxWidth = window.innerWidth - this.left
      //   style.width = Math.min(this.width.offsetWidth, maxWidth) + 'px'
      // }
      // return style
    },
  },
  watch: {
    async display(newVal, oldVal) {
      // if (newVal !== oldVal) {
      //   newVal ? this.open(newVal) : this.close()
      // }
    },
  },
  updated() {
    // this.reposition()
  },
  mounted() {
    // $(window).on('resize.contextMenu', () => {
    //   if (this.timeout) clearTimeout(this.timeout)
    //   this.timeout = window.setTimeout(this.reposition, 300)
    // })
  },
  beforeUnmount() {
    // $(window).off('resize.contextMenu')
  },
  methods: {
    // closes context menu
    async close() {
      // this.$emit('close')
      // await nextTick()
      // this.show = false
      // this.left = 0
      // this.top = 0
    },
    async open(evt: ContextMenuEvent) {
      // this.show = true
      // await nextTick()
      // const position = this.getPositionFromEvent(evt)
      // this.setPosition(position.top, position.left)
      // this.giveFocus()
    },
    giveFocus() {
      // if (!this.focus) return
      // const input = $(this.$el).find(':input').get(0);
      // (input || this.$refs.mask || this.$refs.context)?.focus()
    },
    setPosition(top: number, left: number) {
      // const menu: HTMLElement = this.$refs.context as HTMLElement
      // let maxHeight = 0
      // let maxWidth = 0
      // const minimumHeight = 0
      // if (menu) {
      //   maxHeight = window.innerHeight - minimumHeight
      //   maxWidth = window.innerWidth - menu.offsetWidth
      // }

      // this.top = Math.min(top, maxHeight)
      // this.left = Math.min(left, maxWidth)
    },
    reposition(event?: ContextMenuEvent | TriggeredEvent) {
      // let newCoords: Position = {
      //   top: this.top,
      //   left: this.left,
      // }
      // if (event) {
      //   newCoords = this.recalculatePosition(event)
      // }
      // this.setPosition(newCoords.top, newCoords.left)
    },
    getPositionFromEvent(event: ContextMenuEvent | TriggeredEvent): Position {
      // let position: Position
      // if (event instanceof KeyboardEvent) {
      //   position = this.getBoundingClientPosition(event)
      // } else {
      //   position = {
      //     top: event.clientY || 0,
      //     left: event.clientX || 0,
      //   }
      //   if (this.fixed || (!position.top && !position.left)) {
      //     position = this.getBoundingClientPosition(event)
      //   }
      // }
      // return position
    },
    recalculatePosition(event: ContextMenuEvent | TriggeredEvent) {
      // return this.getPositionFromEvent(event)
    },
    handleOutsideClick() {
      // if (this.outsideClick) this.close()
    },
    getBoundingClientPosition(event: ContextMenuEvent | TriggeredEvent): Position {
      // let target: Element | null = null
      // if ('relatedTarget' in event) {
      //   target = (event.target || event.relatedTarget) as Element
      // } else {
      //   target = event.target as Element
      // }

      // const position = target.getBoundingClientRect()
      // return {
      //   top: position.bottom,
      //   left: position.left,
      // }
    },
  },
})
</script>
