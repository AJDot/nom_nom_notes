<template>
  <draggable
    tag="transition-group"
    :component-data="{ tag: 'ul', name: 'flip-list', type: 'transition' }"
    :list="steps"
    item-key="clientId"
    ghost-class="ghost"
    handle=".handle"
    @end="sort"
  >
    <template #item="{element: step, index}">
      <steps-list-item
        :key="step.clientId"
        v-model:description="step.description"
        :index="index"
        :data-test="`step-${index}`"
        @context-menu.prevent="openContextMenu($event, step)"
      />
    </template>
    <template #footer>
      <row
        key="add"
        tag="li"
      >
        <button
          class="btn"
          type="button"
          @click="addStep"
        >
          + Add Step
        </button>
      </row>
    </template>
  </draggable>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Step from 'Models/step'
import { Destroyable, Sortable } from 'Interfaces/modelInterfaces'
import StepsListItem from 'Views/steps/listItem.vue'
import draggable from 'vuedraggable'
import Sorter from 'Models/concerns/sorter'

export default defineComponent({
  name: 'StepsList',
  components: {
    StepsListItem,
    draggable,
  },
  props: {
    steps: {
      type: Object as () => Array<Step>,
      required: true,
    },
  },
  emits: {
    'context-menu': null,
    add: null,
  },
  methods: {
    async addStep() {
      this.$emit('add')
    },
    openContextMenu(event: MouseEvent, item: Sortable & Destroyable) {
      this.$emit('context-menu', {
        event,
        item,
      })
    },
    sort(event) {
      new Sorter().reorder<Step>(this.steps, event.oldIndex, event.newIndex)
    },
  },
})
</script>
