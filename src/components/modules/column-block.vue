<template>
  <section :data-focusable="false" class="flex flex-col gap-x-4 gap-y-1 grow basis-0 py-1">
    <base-block-group :blocks="director.childrenFor(block)" :director="director" :draggable="draggable" :droppable="droppable" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ColumnBlock, UBlockDirector } from '~/interfaces/blockInterfaces'
import draggableMixin from '~/mixins/draggableMixin'

export default defineComponent({
  name: 'ColumnBlock',
  mixins: [
    draggableMixin,
  ],
  props: {
    block: {
      type: Object as () => ColumnBlock,
      required: true,
    },
    director: {
      type: Object as () => UBlockDirector,
      required: true,
    },
  },
})
</script>
