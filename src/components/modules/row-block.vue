<template>
  <section class="flex basis-full gap-4" :data-focusable="false">
    <base-block-group :blocks="director.childrenFor(block)" :director="director" :draggable="draggable" :droppable="droppable" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RowBlock, UBlockDirector } from '~/interfaces/blockInterfaces'
import draggableMixin from '~/mixins/draggableMixin'

export default defineComponent({
  name: 'RowBlock',
  mixins: [
    draggableMixin,
  ],
  props: {
    block: {
      type: Object as () => RowBlock,
      required: true,
    },
    director: {
      type: Object as () => UBlockDirector,
      required: true,
    },
  },
})
</script>
