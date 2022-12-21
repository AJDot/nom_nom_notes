<template>
  <draggable :draggable="draggable" :droppable="droppable" class="relative basis-full" :item="block" :list-id="block.parentId ?? ''" @drop="onDrop">
    <h3 class="text-xl px-2 py-1 cursor-tex outline-none border-2 border-transparent focus:border-gray-900 rounded-md" contenteditable data-focus ref="content" v-html="block.content.text"></h3>
  </draggable>
</template>

<script lang="ts">
import Draggable from '@/modules/draggable/draggable.vue'
import { defineComponent } from 'vue'
import { H3Block } from '~/interfaces/blockInterfaces'
import blockMixin from '~/mixins/blockMixin'
import draggableMixin from '~/mixins/draggableMixin'
import preserveCaretMixin from '~/mixins/preserveCaretMixin'

export default defineComponent({
  name: 'H3Block',
  components: {
    Draggable
  },
  mixins: [
    draggableMixin,
    blockMixin<H3Block>(),
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
