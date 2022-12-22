<template>
  <draggable tag="section" :draggable="draggable" :droppable="droppable" :item="block" :list-id="block.parentId ?? ''" @drop="onDrop" :data-focusable="false" class="flex flex-col gap-x-4 gap-y-1 grow basis-0 py-1">
    <base-block-group v-if="childBlocks.length" :blocks="childBlocks" :director="director" :draggable="draggable"
      :droppable="droppable" />
    <div v-else @click="addText" class="flex grow cursor-pointer place-items-center">
      <div class="grow text-center">
        + Add Item
      </div>
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
    draggableMixin,
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
  },
})
</script>
