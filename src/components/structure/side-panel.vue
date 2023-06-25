<template>
  <div>
    <slot
      name="control"
      @click="$emit('open')"
    />
    <div
      v-if="state"
      class="fixed w-screen h-screen top-0 left-0 z-10"
      data-test="side-panel-mask"
      @click="$emit('close')"
    />
    <transition
      appear
      name="slide-fade"
    >
      <aside
        v-if="state"
        class="fixed top-0 left-0 w-screen max-w-lg h-screen bg-white shadow-2xl overflow-auto z-20"
        data-test="side-panel"
      >
        <button
          type="button"
          class="block ml-auto mr-5 mt-3"
          data-test="close"
          @click="$emit('close')"
        >
          <i class="material-icons"> close </i>
        </button>
        <slot />
      </aside>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SidePanel',
  props: {
    state: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    open: null,
    close: null,
  },
  watch: {
    state(newVal, _oldVal) {
      $('body').toggleClass('overflow-hidden', newVal)
    },
  },
})
</script>
