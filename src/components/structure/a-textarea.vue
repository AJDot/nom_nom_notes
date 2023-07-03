<template>
  <textarea
    v-bind="$attrs"
    :value="modelValue"
    class="outline-none w-full p-2 border border-gray-400 rounded-md transition-background hover:bg-gray-100 hover:shadow-input focus:bg-gray-100 focus:shadow-input"
    @input="emitModelValue"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AInput',
  props: {
    modelValue: {
      type: [
        String,
      ],
      default: null,
    },
  },
  emits: {
    'update:modelValue': null,
  },
  methods: {
    emitModelValue(event) {
      this.$emit('update:modelValue', event.target?.value)
    },
  },
})
</script>
