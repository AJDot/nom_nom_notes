<template>
  <draggable tag="section" :draggable="draggable" :droppable="droppable" :item="block" :list-id="block.parentId ?? ''" @drop="onDrop" :data-focusable="false" class="flex flex-col gap-x-4 gap-y-1 grow basis-0 py-1">
    <base-block-group :blocks="director.childrenFor(block)" :director="director" :draggable="draggable" :droppable="droppable" />
  </draggable>
</template>

<script lang="ts">
import Draggable from '@/modules/draggable/draggable.vue'
import { defineComponent } from 'vue'
import { ColumnBlock } from '~/interfaces/blockInterfaces'
import blockMixin from '~/mixins/blockMixin'
import draggableMixin from '~/mixins/draggableMixin'

export default defineComponent({
  name: 'ColumnBlock',
  components: {
    Draggable
  },
  mixins: [
    draggableMixin,
    blockMixin<ColumnBlock>(),
  ],
  methods: {
    onDrop(payload) {
      const { dragItemId: moveBlockId, dropItemId: toBlockId } = payload
      this.director.onDrop({ moveBlockId, toBlockId })
    },
  },
})
</script>
