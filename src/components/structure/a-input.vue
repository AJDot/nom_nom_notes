<template>
  <input v-if="editable" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" :class="classes" :disabled="disabled">
  <div v-else :class="classes">{{ modelValue }}</div>
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
    editable: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    'update:modelValue': null,
  },
  data() {
    return {
      classes: "outline-none w-full p-2 border border-gray-400 rounded-md transition-background hover:bg-gray-100 hover:shadow-input focus:bg-gray-100 focus:shadow-input tracking-normal"
    }
  },
})
</script>
