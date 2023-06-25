<template>
  <transition
    appear
    name="fade"
  >
    <aside
      v-if="state"
      class="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      data-test="modal"
    >
      <!--
    Background backdrop, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100"
      To: "opacity-0"
  -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

      <div
        class="fixed inset-0 z-10 overflow-y-auto"
        :class="width === 'lg' ? 'h-screen' : ''"
      >
        <div class="flex items-end justify-center p-4 text-center sm:items-center sm:p-0 max-h-screen">
          <!--
        Modal panel, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      -->
          <div
            class="relative transform overflow-hidden rounded-lg text-left transition-all sm:my-8"
            :class="containerClasses"
          >
            <div
              class="flex flex-col px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
              :class="width === 'lg' ? 'h-screen' : ''"
            >
              <div
                :class="flexClasses"
                class="grow overflow-y-auto"
              >
                <div class="grow mt-3 text-center sm:mt-0 sm:text-left">
                  <h3
                    id="modal-title"
                    class="text-2xl font-bold"
                  >
                    <slot name="header" />
                  </h3>
                  <div class="mt-2 overflow-y-auto">
                    <slot />
                    <slot name="body" />
                  </div>
                </div>
              </div>
              <div class="flex bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <slot name="footer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Modal',
  props: {
    state: {
      type: Boolean,
      default: false,
    },
    transparent: {
      type: Boolean,
      default: false,
    },
    center: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: 'md',
      validator: prop => typeof prop === 'string' && ['md', 'lg'].includes(prop),
    },
  },
  computed: {
    containerClasses(): Record<string, boolean> {
      return {
        'bg-transparent': this.transparent,
        'bg-white': !this.transparent,
        'shadow-xl': !this.transparent,
        'sm:max-w-lg': this.width === 'md',
        'sm:max-w-7xl sm:w-11/12': this.width === 'lg',
      }
    },
    flexClasses(): Record<string, boolean> {
      return {
        'sm:flex': true,
        'sm:justify-start': !this.center,
        'sm:justify-center': this.center,
      }
    },
  },
})
</script>
