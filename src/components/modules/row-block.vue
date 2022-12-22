<template>
  <draggable tag="section" :draggable="draggable" :droppable="draggable" :item="block" :list-id="block.parentId ?? ''" @drop="onDrop" :data-focusable="false" class="flex basis-full gap-4 p-1">
    <base-block-group v-if="childBlocks.length" :blocks="childBlocks" :director="director" :draggable="draggable" :droppable="droppable" />
    <div v-else class="flex grow cursor-pointer place-items-center rounded-md">
      <button type="button" @click="addColumn" class="grow text-center text-gray-500 rounded-md outline-none hover:shadow-input hover:bg-gray-100 focus:shadow-input focus:bg-gray-100">
        + Add Column
      </button>
      <button type="button" @click="destroy" class="grow text-center text-gray-500 rounded-md outline-none hover:shadow-input hover:bg-gray-100 focus:shadow-input focus:bg-gray-100">
        - Remove Empty Row
      </button>
    </div>
  </draggable>
</template>

<script lang="ts">
import Draggable from '@/modules/draggable/draggable.vue'
import { defineComponent } from 'vue'
import { Block, ColumnBlock, RowBlock } from '~/interfaces/blockInterfaces'
import blockMixin from '~/mixins/blockMixin'
import draggableMixin from '~/mixins/draggableMixin'
import Guid from '~/utils/guid'

export default defineComponent({
  name: 'RowBlock',
  components: {
    Draggable
  },
  mixins: [
    draggableMixin,
    blockMixin<RowBlock>(),
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
    addColumn(): void {
      const column: ColumnBlock = { id: Guid.create(), type: 'column', content: { text: '' } }
      this.director.onCreate({ block: column, inside: this.block })
    },
    destroy(): void {
      this.director.onDestroy({ block: this.block })
    },
  }
})
</script>
