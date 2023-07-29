<template>
  <component
    :is="tag"
    :draggable="draggable"
    class="p-1"
    :class="hoverClass.concat(dragClass)"
    @dragstart="onStartDrag"
    @mouseover="onMouseover"
    @mouseout="onMouseout"
    @drop="onDrop"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
  >
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import draggableMixin from '~/mixins/draggableMixin'

interface Data {
  hoverClass: string[]
  dragClass: string[]
}

export default defineComponent({
  mixins: [
    draggableMixin,
  ],
  props: {
    item: {
      type: Object,
      required: true,
    },
    tag: {
      type: String,
      default: 'div',
    },
    hoverColor: {
      type: String,
      default: 'bg-gray-100',
    },
  },
  emits: {
    drop: null,
  },
  data(): Data {
    return {
      hoverClass: [],
      dragClass: [],
    }
  },
  methods: {
    onStartDrag(evt) {
      evt.dataTransfer.dropEffect = 'move'
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData(this.item.id, null)
      evt.stopPropagation()
    },
    onDrop(evt) {
      if (typeof this.droppable === 'function' ? this.droppable(evt.dataTransfer.types) : this.droppable) {
        evt.stopPropagation()
      } else {
        evt.preventDefault()
        return
      }
      this.$emit('drop', { dragItemId: evt.dataTransfer.types[0], dropItemId: this.item.id })
      this.onDragLeave(evt)
    },
    onDragOver(event) {
      if (typeof this.droppable === 'function' ? this.droppable(event.dataTransfer.types) : this.droppable) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        return
      }
      this.dragClass = ['bg-blue-100', 'shadow-input']
    },
    onDragLeave(event) {
      if (typeof this.droppable === 'function' ? this.droppable(event.dataTransfer.types) : this.droppable) {
        event.preventDefault()
      } else {
        return
      }
      this.dragClass = []
    },
    onMouseover(event: MouseEvent) {
      if (this.droppable || this.draggable) {
        this.hoverClass = [this.hoverColor, 'shadow-input']
        event.stopPropagation()
      }
    },
    onMouseout(event: MouseEvent) {
      if (this.droppable || this.draggable) {
        this.hoverClass = []
        event.stopPropagation()
      }
    },
  },
})
</script>
