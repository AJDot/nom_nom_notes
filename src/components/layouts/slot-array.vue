<template>
  <slot
    v-for="i in Array(length).keys()"
    :name="i + 1"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SlotArray',
  props: {
    length: {
      type: Number,
      required: true,
    },
  },
})
</script>
