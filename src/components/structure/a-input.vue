<template>
  <dl class="email">
    <dt>
      <slot name="label">
        <label :for="$attrs.id">
          <slot name="label-text" />
        </label>
      </slot>
    </dt>
    <dd>
      <input
        v-bind="$attrs"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      >
    </dd>
  </dl>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AInput',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [
        Object as () => unknown,
        String as () => unknown,
      ],
      default: null,
    },
  },
  emits: {
    'update:modelValue': null,
  },
})
</script>
