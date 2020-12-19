<template>
  <component
    :is="tag"
    class="col"
  >
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface Data {
}

export default defineComponent({
  name: 'Column',
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
