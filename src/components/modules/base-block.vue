<template>
  <component class="gap-4 justify-start whitespace-pre-wrap transition-bg-shadow focus:bg-gray-100 focus:shadow-input" :is="componentMap[block.type]" :data-id="block.id" :block="block" :director="director" @input.stop="onInput" @keydown.enter.stop="onEnter" @keydown.arrow-down.stop="onArrowDown" @keydown.arrow-up.stop="onArrowUp" @keydown.delete.stop="onDelete" :draggable="draggable" :droppable="droppable" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Block, UBlockDirector } from '~/interfaces/blockInterfaces'
import draggableMixin from '~/mixins/draggableMixin'
import ColumnBlock from './column-block.vue'
import H1Block from './h1-block.vue'
import H2Block from './h2-block.vue'
import H3Block from './h3-block.vue'
import RowBlock from './row-block.vue'
import TextBlock from './text-block.vue'

interface Data {
  componentMap: Record<Block['type'], string>
}

export default defineComponent({
  name: 'BaseBlock',
  components: {
    H1Block,
    H2Block,
    H3Block,
    TextBlock,
    RowBlock,
    ColumnBlock,
  },
  mixins: [
    draggableMixin,
  ],
  props: {
    block: {
      type: Object as () => Block,
      required: true,
    },
    director: {
      type: Object as () => UBlockDirector,
      required: true,
    },
  },
  data(): Data {
    return {
      componentMap: {
        h1: 'h1-block',
        h2: 'h2-block',
        h3: 'h3-block',
        text: 'text-block',
        row: 'row-block',
        column: 'column-block',
      },
    }
  },
  methods: {
    onInput(event: InputEvent) {
      this.director.onInput({ block: this.block, event })
    },
    onEnter(event: KeyboardEvent) {
      if (event.shiftKey) {
      } else {
        this.director.onEnter({ block: this.block, event })
        event.preventDefault()
      }
    },
    onEnterKeydown(event: KeyboardEvent) {
      if (event.shiftKey) {
        // do nothing
      } else {
        event.preventDefault()
      }
    },
    onArrowDown(event) {
      this.director.onArrowDown({ block: this.block, event })
    },
    onArrowUp(event) {
      this.director.onArrowUp({ block: this.block, event })
    },
    /**
     * Handles both "Delete" and "Backspace" keys
     */
    onDelete(event) {
      if (event.key === 'Delete') {
        this.director.onDelete({ block: this.block, event })
      } else if (event.key === 'Backspace') {
        this.director.onBackspace({ block: this.block, event })
      }
    },
  }
})
</script>
