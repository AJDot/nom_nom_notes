<template>
  <draggable :draggable="draggable" :droppable="droppableTest" class="relative basis-full rounded-md" :hover-color="hoverColor" :item="block" @drop="onDrop" data-test-block="h1">
    <h1 :placeholder="placeholder" class="basis-full text-3xl min-h-12 py-1 outline-none border-2 border-transparent break-anywhere focus:shadow-input focus:bg-gray-100 rounded-md after:text-gray-500 after:empty:content-[attr(placeholder)] sm:px-2" :class="{ 'cursor-text': isEditable, 'cursor-pointer': isChooseMode }" :contenteditable="isEditable" data-focus ref="content" v-html="block.content.text" v-on="blockListeners"></h1>
  </draggable>
</template>

<script lang="ts">
import Draggable from '@/modules/draggable/draggable.vue'
import { defineComponent } from 'vue'
import { H1Block } from '~/interfaces/blockInterfacesGeneral'
import blockMixin from '~/mixins/blockMixin'
import preserveCaretMixin from '~/mixins/preserveCaretMixin'

export default defineComponent({
  name: 'H1Block',
  components: {
    Draggable
  },
  mixins: [
    blockMixin<H1Block>(),
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
