<template>
  <div>
    <slot name="control" @click="$emit('open')" />
    <div v-if="state" class="fixed w-screen h-screen top-0 left-0 z-10" @click="$emit('close')" data-test="side-panel-mask"></div>
    <transition appear name="slide-fade">
      <aside v-if="state" class="fixed top-0 left-0 w-screen max-w-lg h-screen bg-white shadow-2xl overflow-auto z-20" data-test="side-panel">
        <button type="button" @click="$emit('close')" class="block ml-auto mr-5 mt-3" data-test="close">
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
    state(newVal, oldVal) {
      $('body').toggleClass('overflow-hidden', newVal)
    },
  },
})
</script>
