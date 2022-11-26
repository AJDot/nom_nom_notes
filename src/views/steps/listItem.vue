<template>
  <li class="flex p-1 gap-1 items-center">
    <div>
      <label :for="`step-${index}-description`">
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
      <a-textarea :id="`step-${index}-description`" :value="description" :name="`step-${index}-description`" placeholder="Next step..." @input="$emit('update:description', $event.target.value)" class="w-full" />
    </div>
    <div>
      <button class="btn more" type="button" @click="$emit('context-menu', $event)">
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
