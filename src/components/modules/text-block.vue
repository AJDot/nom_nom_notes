<template>
  <draggable :draggable="draggable" :droppable="droppable" class="relative basis-full" :item="block" :list-id="block.parentId ?? ''" @drop="onDrop">
    <div :key="block.id" :placeholder="placeholder" data-focus class="text px-2 py-1 cursor-text outline-none border-2 border-transparent focus:border-gray-900 rounded-md after:text-gray-500 after:empty:content-[attr(placeholder)]" contenteditable v-html="block.content.text" ref="content"></div>
    <div class="absolute top-0 left-0 handle cursor-pointer">+</div>
  </draggable>
</template>

<script lang="ts">
import Draggable from '@/modules/draggable/draggable.vue'
import { defineComponent } from 'vue'
import { TextBlock } from '~/interfaces/blockInterfaces'
import blockMixin from '~/mixins/blockMixin'
import draggableMixin from '~/mixins/draggableMixin'
import preserveCaretMixin from '~/mixins/preserveCaretMixin'

export default defineComponent({
  name: "TextBlock",
  components: {
    Draggable
  },
  mixins: [
    draggableMixin,
    blockMixin<TextBlock>(),
    preserveCaretMixin,
  ],
  computed: {
    placeholder(): string {
      return this.director.find(this.block.id) ? "Type '/' for commands" : "Type anything..."
    },
  },
  methods: {
    onDrop(payload) {
      const { dragItemId: moveBlockId, dropItemId: toBlockId } = payload
      this.director.onDrop({ moveBlockId, toBlockId })
    },
  },
})
</script>