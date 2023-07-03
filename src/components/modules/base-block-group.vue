<template>
  <base-block
    v-for="block in blocks"
    :key="block.id"
    class="items-start w-full justify-start whitespace-pre-wrap transition-bg-shadow focus:bg-gray-100 focus:shadow-input"
    :block="block"
    :mode="mode"
    :director="director"
    :draggable="draggable"
    :droppable="droppable"
    :editable="editable"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { UBlockDirector } from 'Interfaces/blockInterfaces'
import { Block } from 'Interfaces/blockInterfacesGeneral'
import draggableMixin from '~/mixins/draggableMixin'

export default defineComponent({
  name: 'BaseBlockGroup',
  mixins: [
    draggableMixin,
  ],
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
      validator: prop => typeof prop === 'string' && ['create', 'show', 'edit', 'choose', 'shopping'].includes(prop),
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
})
</script>
