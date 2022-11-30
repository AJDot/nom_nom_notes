<template>
  <draggable tag="transition-group" :component-data="{ tag: 'ul', name: 'flip-list', type: 'transition' }" :list="steps" item-key="clientId" ghost-class="ghost" handle=".handle" @end="sort">
    <template #item="{ element: step, index }">
      <steps-list-item :key="step.clientId" v-model:description="step.description" :index="index" :data-test="`step-${index}`" :first="isFirst(step)" :last="isLast(step)" @move:up="moveUp(step)" @move:down="moveDown(step)" @destroy="destroy(step)" />
    </template>
    <template #footer>
      <li key="add" class="mt-2">
        <button class="btn" type="button" @click="addStep">
          + Add Step
        </button>
      </li>
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
    add: null,
  },
  methods: {
    async addStep() {
      this.$emit('add')
    },
    sort(event) {
      new Sorter().reorder<Step>(this.steps, event.oldIndex, event.newIndex)
    },
    isFirst(step: Sortable) {
      return new Sorter().isFirst(this.steps, step)
    },
    isLast(step: Sortable) {
      return new Sorter().isLast(this.steps, step)
    },
    moveUp(step: Sortable) {
      return new Sorter().moveUp(this.steps, step)
    },
    moveDown(step: Sortable) {
      return new Sorter().moveDown(this.steps, step)
    },
    destroy(step: Destroyable) {
      step.markForDestruction()
    },
  },
})
</script>
