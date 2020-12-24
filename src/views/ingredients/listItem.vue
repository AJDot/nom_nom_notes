<template>
  <row tag="li">
    <column>
      <label :for="`ingredient-${index}-description`">{{ index + 1 }}</label>
    </column>
    <column class="grow-2">
      <input
        :id="`ingredient-${index}-description`"
        ref="descriptionInput"
        :value="description"
        type="text"
        @input="$emit('update:description', $event.target.value)"
      >
    </column>
    <column>
      <button
        class="btn"
        type="button"
        @click="$emit('context-menu', $event)"
      >
        <span class="material-icons">
          more_vert
        </span>
      </button>
    </column>
  </row>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IngredientsListItem',
  props: {
    index: {
      type: Number,
      default: null,
    },
    description: {
      type: String,
      default: '',
    },
  },
  emits: {
    'context-menu': null,
    'update:description': null,
  },
})
</script>
