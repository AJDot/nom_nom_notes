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
      <dropdown :state="dropdownState" right @close="dropdownState = false">
        <template #control>
          <button class="btn" type="button" @click="dropdownState = !dropdownState">
            <i class="material-icons align-middle">
              more_vert
            </i>
          </button>
        </template>
        <ul>
          <dropdown-item v-if="!first">
            <dropdown-item-button @click="moveUp">
              Move Up
            </dropdown-item-button>
          </dropdown-item>
          <dropdown-item v-if="!last" @click="moveDown">
            <dropdown-item-button>
              Move Down
            </dropdown-item-button>
          </dropdown-item>
          <dropdown-item @click="destroy">
            <dropdown-item-button>
              Delete
            </dropdown-item-button>
          </dropdown-item>
        </ul>
      </dropdown>
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
    first: {
      type: Boolean,
      default: false,
    },
    last: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    'update:description': null,
    'move:up': null,
    'move:down': null,
    'destroy': null,
  },
  data() {
    return {
      dropdownState: false,
    }
  },
  methods: {
    moveUp(): void {
      this.$emit('move:up')
    },
    moveDown(): void {
      this.$emit('move:down')
    },
    destroy(): void {
      this.$emit('destroy')
    },
  },
})
</script>
