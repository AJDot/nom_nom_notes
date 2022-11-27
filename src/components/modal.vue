<template>
  <transition appear name="fade">
    <aside v-if="state" class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <!--
    Background backdrop, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100"
      To: "opacity-0"
  -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <!--
        Modal panel, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      -->
          <div class="relative transform overflow-hidden rounded-lg text-left transition-all sm:my-8 sm:w-full sm:max-w-lg" :class="containerClasses">
            <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div :class="flexClasses">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-2xl font-bold" id="modal-title">
                    <slot name="header" />
                  </h3>
                  <div class="mt-2">
                    <slot />
                    <slot name="body" />
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
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
  },
  computed: {
    containerClasses(): Record<string, boolean> {
      return {
        'bg-transparent': this.transparent,
        'bg-white': !this.transparent,
        'shadow-xl': !this.transparent,
      }
    },
    flexClasses(): Record<string, boolean> {
      return {
        'sm:flex': true,
        'sm:justify-start': !this.center,
        'sm:justify-center': this.center,
      }
    }
  },
})
</script>
