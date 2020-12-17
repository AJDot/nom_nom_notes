<template>
  <transition
    appear
    name="modal"
  >
    <aside
      v-if="state"
      class="modal"
    >
      <div
        v-if="!hideMask"
        class="modal-mask"
      />
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header" />
          </div>

          <div class="modal-body">
            <slot name="body" />
          </div>

          <div class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </aside>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    hideMask: {
      type: Boolean,
      default: false,
    },
    state: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
