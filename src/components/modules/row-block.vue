<template>
  <draggable tag="section" :draggable="draggable" :droppable="droppableTest" :item="block" @drop="onDrop" :data-focusable="false" class="flex basis-full gap-4 p-1 rounded-md" :hover-color="hoverColor" :class="{ 'cursor-pointer': isChooseMode }" @click.self.stop="blockListeners.click" data-test-block="row">
    <base-block-group v-if="childBlocks.length" :mode="mode" :blocks="childBlocks" :director="director" :draggable="draggable" :droppable="droppable" :editable="editable" />
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
import { Block, ColumnBlock, RowBlock } from '~/interfaces/blockInterfacesGeneral'
import blockListeners from '~/mixins/blockListeners'
import blockMixin from '~/mixins/blockMixin'
import Guid from '~/utils/guid'

export default defineComponent({
  name: 'RowBlock',
  components: {
    Draggable
  },
  mixins: [
    blockMixin<RowBlock>(),
    blockListeners,
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
      const column: ColumnBlock = { id: Guid.create(), type: 'column' }
      this.director.onCreate({ block: column, inside: this.block })
    },
    destroy(): void {
      this.director.onDestroy({ block: this.block })
    },
  }
})
</script>
