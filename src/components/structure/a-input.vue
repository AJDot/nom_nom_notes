<template>
  <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" class="outline-none w-full p-2 border border-gray-400 rounded-md transition-background hover:bg-gray-100 hover:shadow-input focus:bg-gray-100 focus:shadow-input">
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AInput',
  props: {
    modelValue: {
      type: [
        Object as () => unknown,
        String as () => unknown,
        Number as () => unknown,
      ],
      default: null,
    },
  },
  emits: {
    'update:modelValue': null,
  },
})
</script>
