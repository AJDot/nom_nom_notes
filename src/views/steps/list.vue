<template>
  <ul>
    <steps-list-item
      v-for="(step, i) in steps"
      :key="step.clientId"
      v-model:description="step.description"
      :index="i"
      :data-test="`step-${i}`"
      @context-menu="openContextMenu($event, step)"
    />
    <row tag="li">
      <button
        class="btn"
        type="button"
        @click="addStep"
      >
        + Add Step
      </button>
    </row>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Step from 'Models/step'
import { Destroyable, Sortable } from 'Interfaces/modelInterfaces'
import StepsListItem from 'Views/steps/listItem.vue'

export default defineComponent({
  name: 'StepsList',
  components: {
    StepsListItem,
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
  },
})
</script>
