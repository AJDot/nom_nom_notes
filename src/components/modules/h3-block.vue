<template>
  <draggable :draggable="draggable" :droppable="droppableTest" class="relative basis-full rounded-md" :hover-color="hoverColor" :item="block" :list-id="block.parentId ?? ''" @drop="onDrop">
    <h3 :placeholder="placeholder" class="text-xl px-2 py-1 min-h-10 outline-none border-2 border-transparent break-anywhere focus:shadow-input focus:bg-gray-100 rounded-md after:text-gray-500 after:empty:content-[attr(placeholder)]" :class="{ 'cursor-text': isEditable, 'cursor-pointer': isChooseMode }" :contenteditable="isEditable" data-focus ref="content" v-html="block.content.text" v-on="blockListeners"></h3>
  </draggable>
</template>

<script lang="ts">
import Draggable from '@/modules/draggable/draggable.vue'
import { defineComponent } from 'vue'
import { H3Block } from '~/interfaces/blockInterfacesGeneral'
import blockListeners from '~/mixins/blockListeners'
import blockMixin from '~/mixins/blockMixin'
import preserveCaretMixin from '~/mixins/preserveCaretMixin'

export default defineComponent({
  name: 'H3Block',
  components: {
    Draggable
  },
  mixins: [
    blockMixin<H3Block>(),
    blockListeners,
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
