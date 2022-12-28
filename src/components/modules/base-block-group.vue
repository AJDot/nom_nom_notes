<template>
  <base-block class="gap-4 items-start w-full justify-start whitespace-pre-wrap transition-bg-shadow focus:bg-gray-100 focus:shadow-input" v-for="block in blocks" :block="block" :key="block.id" :mode="mode" :director="director" :draggable="draggable" :droppable="droppable" :editable="editable" />
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
      validator: prop => typeof prop === 'string' && ['create', 'show', 'edit', 'choose'].includes(prop)
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
})
</script>
