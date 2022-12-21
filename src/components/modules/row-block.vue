<template>
  <draggable tag="section" :draggable="draggable" :droppable="draggable" :item="block" :list-id="block.parentId ?? ''" @drop="onDrop" :data-focusable="false" class="flex basis-full gap-4 p-1">
    <base-block-group :blocks="director.childrenFor(block)" :director="director" :draggable="draggable" :droppable="droppable" />
  </draggable>
</template>

<script lang="ts">
import Draggable from '@/modules/draggable/draggable.vue'
import { defineComponent } from 'vue'
import { RowBlock } from '~/interfaces/blockInterfaces'
import blockMixin from '~/mixins/blockMixin'
import draggableMixin from '~/mixins/draggableMixin'

export default defineComponent({
  name: 'RowBlock',
  components: {
    Draggable
  },
  mixins: [
    draggableMixin,
    blockMixin<RowBlock>(),
  ],
  methods: {
    onDrop(payload) {
      const { dragItemId: moveBlockId, dropItemId: toBlockId } = payload
      this.director.onDrop({ moveBlockId, toBlockId })
    },
  }
})
</script>
