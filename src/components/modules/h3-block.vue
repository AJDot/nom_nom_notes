<template>
  <h2 v-once class="text-xl px-2 py-1 cursor-tex outline-none border-2 border-transparent focus:border-gray-900 rounded-md" contenteditable data-focus v-html="block.content.text"></h2>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { H3Block, UBlockDirector } from '~/interfaces/blockInterfaces'

export default defineComponent({
  name: 'H3Block',
  props: {
    block: {
      type: Object as () => H3Block,
      required: true,
    },
    director: {
      type: Object as () => UBlockDirector,
      required: true,
    },
  },
})
</script>
