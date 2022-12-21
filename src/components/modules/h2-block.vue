<template>
  <draggable :draggable="draggable" :droppable="droppable" class="relative basis-full" :item="block" :list-id="block.parentId ?? ''" @drop="onDrop">
    <h2 class="text-2xl px-2 py-1 cursor-text outline-none border-2 border-transparent focus:border-gray-900 rounded-md" contenteditable data-focus ref="content" v-html="block.content.text"></h2>
  </draggable>
</template>

<script lang="ts">
import Draggable from '@/modules/draggable/draggable.vue'
import { defineComponent } from 'vue'
import { H2Block } from '~/interfaces/blockInterfaces'
import blockMixin from '~/mixins/blockMixin'
import draggableMixin from '~/mixins/draggableMixin'
import preserveCaretMixin from '~/mixins/preserveCaretMixin'

export default defineComponent({
  name: 'H2Block',
  components: {
    Draggable
  },
  mixins: [
    draggableMixin,
    blockMixin<H2Block>(),
    preserveCaretMixin,
  ],
  methods: {
    onDrop(payload) {
      const { dragItemId: moveBlockId, dropItemId: toBlockId } = payload
      this.director.onDrop({ moveBlockId, toBlockId })
    },
  },
})
</script>
