<template>
  <row tag="li">
    <column>
      <label :for="`ingredient-${index}-description`">
        <button
          v-if="handle"
          type="button"
          class="btn handle"
        >
          <span class="material-icons">
            drag_handle
          </span>
        </button>
        <template v-else>
          {{ index + 1 }}
        </template>
      </label>
    </column>
    <column class="grow-2">
      <input
        :id="`ingredient-${index}-description`"
        :value="description"
        type="text"
        @input="$emit('update:description', $event.target.value)"
      >
    </column>
    <column>
      <button
        class="btn more"
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
    handle: {
      type: Boolean,
      default: true,
    },
  },
  emits: {
    'context-menu': null,
    'update:description': null,
  },
})
</script>
