<template>
  <draggable :draggable="draggable" :droppable="droppable" class="relative basis-full" :item="block" :list-id="block.parentId ?? ''" @drop="onDrop">
    <div :key="block.id" :placeholder="placeholder" data-focus class="text px-2 py-1 cursor-text outline-none border-2 border-transparent focus:border-gray-900 rounded-md after:text-gray-500 after:empty:content-[attr(placeholder)]" contenteditable v-html="block.content.text" ref="content"></div>
    <div class="absolute top-0 left-0 handle cursor-pointer">+</div>
  </draggable>
</template>

<script lang="ts">
import Draggable from '@/modules/draggable/draggable.vue'
import { defineComponent, nextTick } from 'vue'
import { TextBlock, UBlockDirector } from '~/interfaces/blockInterfaces'
import draggableMixin from '~/mixins/draggableMixin'
import SelectionUtils from '~/utils/selectionUtils'

export default defineComponent({
  name: "TextBlock",
  components: {
    Draggable
  },
  mixins: [
    draggableMixin,
  ],
  props: {
    block: {
      type: Object as () => TextBlock,
      required: true,
    },
    director: {
      type: Object as () => UBlockDirector,
      required: true,
    },
  },
  mounted() {
    this.preserveCaret()
  },
  computed: {
    placeholder(): string {
      return this.director.find(this.block.id) ? "Type '/' for commands" : "Type anything..."
    },
  },
  methods: {
    async preserveCaret() {
      const element = this.$refs.content as HTMLElement
      const position = SelectionUtils.getCaret(element)
      if (position) {
        await nextTick()
        // catch when element is removed from DOM - happens when TextBlock is converted to Rows and Columns
        if (document.body.contains(element)) SelectionUtils.moveCaret(element, position)
      }
    },
    onDrop(payload) {
      const { dragItemId: moveBlockId, dropItemId: toBlockId } = payload
      this.director.onDrop({ moveBlockId, toBlockId })
    }
  },
  watch: {
    'block.content.text': {
      async handler(newVal, oldVal) {
        this.preserveCaret()
      },
      deep: true,
    }
  }
})
</script>
