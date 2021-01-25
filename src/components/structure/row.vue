<template>
  <component
    :is="tag"
    class="row"
  >
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface Data {
}

export default defineComponent({
  name: 'Row',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
  },
  data(): Data {
    return {}
  },
})
</script>
