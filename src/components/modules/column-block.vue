<template>
  <draggable tag="section" :draggable="draggable" :droppable="droppableTest" :item="block" :list-id="block.parentId ?? ''" @drop="onDrop" :data-focusable="false" class="flex flex-col gap-x-4 gap-y-2 grow basis-0 py-1 rounded-md">
    <base-block-group v-if="childBlocks.length" :blocks="childBlocks" :director="director" :draggable="draggable"
      :droppable="droppable" />
    <div v-else class="flex grow cursor-pointer place-items-center rounded-md">
      <button type="button" @click="addText" class="grow text-center text-gray-500 rounded-md outline-none hover:shadow-input hover:bg-gray-100 focus:shadow-input focus:bg-gray-100">
        + Add Item
      </button>
      <button type="button" @click="destroy" class="grow text-center text-gray-500 rounded-md outline-none hover:shadow-input hover:bg-gray-100 focus:shadow-input focus:bg-gray-100">
        - Remove Empty Column
      </button>
    </div>
  </draggable>
</template>

<script lang="ts">
import Draggable from '@/modules/draggable/draggable.vue'
import { defineComponent } from 'vue'
import { Block, ColumnBlock, TextBlock } from '~/interfaces/blockInterfaces'
import blockMixin from '~/mixins/blockMixin'
import draggableMixin from '~/mixins/draggableMixin'
import Guid from '~/utils/guid'

export default defineComponent({
  name: 'ColumnBlock',
  components: {
    Draggable
  },
  mixins: [
    blockMixin<ColumnBlock>(),
  ],
  computed: {
    childBlocks(): Block[] {
      return this.director.childrenFor(this.block)
    },
  },
  methods: {
    onDrop(payload) {
      const { dragItemId: moveBlockId, dropItemId: toBlockId } = payload
      this.director.onDrop({ moveBlockId, toBlockId })
    },
    addText(): void {
      const text: TextBlock = { id: Guid.create(), type: 'text', content: { text: '' } }
      this.director.onCreate({ block: text, inside: this.block })
    },
    destroy(): void {
      this.director.onDestroy({ block: this.block })
    },
  },
})
</script>
