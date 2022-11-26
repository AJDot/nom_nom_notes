<template>
  <li class="flex p-1 gap-1 items-center">
    <div>
      <label :for="`ingredient-${index}-description`">
        <button v-if="handle" type="button" class="btn handle">
          <i class="material-icons align-middle">
            drag_handle
          </i>
        </button>
        <template v-else>
          {{ index + 1 }}
        </template>
      </label>
    </div>
    <div class="grow">
      <a-input :id="`ingredient-${index}-description`" :value="description" type="text" @input="$emit('update:description', $event.target.value)" class="w-full" />
    </div>
    <div>
      <button class="btn" type="button" @click="$emit('context-menu', $event)">
        <i class="material-icons align-middle">
          more_vert
        </i>
      </button>
    </div>
  </li>
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
