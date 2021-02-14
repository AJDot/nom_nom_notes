<template>
  <row tag="li">
    <column>
      <label :for="`step-${index}-description`">{{ index + 1 }}</label>
    </column>
    <column class="grow-2">
      <textarea
        :id="`step-${index}-description`"
        :value="description"
        :name="`step-${index}-description`"
        placeholder="Next step..."
        @input="$emit('update:description', $event.target.value)"
      />
    </column>
    <column>
      <div class="row">
        <div class="col">
          <button
            class="btn more"
            type="button"
            @click="$emit('context-menu', $event)"
          >
            <span class="material-icons">
              more_vert
            </span>
          </button>
        </div>
      </div>
    </column>
  </row>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'StepsListItem',
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
