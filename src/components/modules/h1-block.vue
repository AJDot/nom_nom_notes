<template>
  <h1 v-once class="basis-full text-3xl px-2 py-1 cursor-text outline-none border-2 border-transparent focus:border-gray-900 rounded-md" contenteditable data-focus v-html="block.content.text"></h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { H1Block, UBlockDirector } from '~/interfaces/blockInterfaces'

export default defineComponent({
  name: 'H1Block',
  props: {
    block: {
      type: Object as () => H1Block,
      required: true,
    },
    director: {
      type: Object as () => UBlockDirector,
      required: true,
    },
  },
})
</script>
