<template>
  <base-block v-for="block in blocks" :block="block" :key="block.id" :mode="mode" :director="director" :draggable="draggable" :droppable="droppable" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import draggable from '~/components/modules/draggable/draggable.vue'
import { Block, UBlockDirector } from '~/interfaces/blockInterfaces'
import draggableMixin from '~/mixins/draggableMixin'

export default defineComponent({
  name: 'BaseBlockGroup',
  mixins: [
    draggableMixin,
  ],
  components: {
    draggable
  },
  props: {
    blocks: {
      type: Array as () => Block[],
      required: true,
    },
    director: {
      type: Object as () => UBlockDirector,
      required: true,
    },
    mode: {
      type: String,
      default: 'show',
      validator: prop => typeof prop === 'string' && ['create', 'show', 'edit'].includes(prop)
    },
  },
})
</script>
