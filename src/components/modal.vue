<template>
  <transition
    appear
    name="fade"
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
        <div
          :class="containerClasses"
        >
          <div class="modal-header">
            <slot name="header" />
          </div>

          <div
            class="modal-body"
            :class="classes.body"
          >
            <slot />
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
import { Hash } from 'Interfaces/utilInterfaces'

export default defineComponent({
  props: {
    hideMask: {
      type: Boolean,
      default: false,
    },
    hideContainer: {
      type: Boolean,
      default: false,
    },
    state: {
      type: Boolean,
      default: false,
    },
    classes: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  computed: {
    containerClasses(): Hash<boolean> {
      return {
        'modal-container': !this.hideContainer,
        'modal-container-clear': this.hideContainer,
      }
    },
  },
})
</script>
