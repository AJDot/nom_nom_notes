<template>
  <draggable :draggable="draggable" :droppable="droppableTest" class="relative basis-full rounded-md" :item="block" :list-id="block.parentId ?? ''" @drop="onDrop">
    <h2 :placeholder="placeholder" class="text-2xl min-h-11 px-2 py-1 cursor-text outline-none border-2 border-transparent break-anywhere focus:shadow-input focus:bg-gray-100 rounded-md after:text-gray-500 after:empty:content-[attr(placeholder)]" :contenteditable="isEditable" data-focus ref="content" v-html="block.content.text"></h2>
  </draggable>
</template>

<script lang="ts">
import Draggable from '@/modules/draggable/draggable.vue'
import { defineComponent } from 'vue'
import { H2Block } from '~/interfaces/blockInterfaces'
import blockMixin from '~/mixins/blockMixin'
import preserveCaretMixin from '~/mixins/preserveCaretMixin'

export default defineComponent({
  name: 'H2Block',
  components: {
    Draggable
  },
  mixins: [
    blockMixin<H2Block>(),
    preserveCaretMixin,
  ],
  computed: {
    placeholder(): string {
      return this.isEditable ? "Type '/' for commands" : ''
    }
  },
  methods: {
    onDrop(payload) {
      const { dragItemId: moveBlockId, dropItemId: toBlockId } = payload
      this.director.onDrop({ moveBlockId, toBlockId })
    },
  },
})
</script>
