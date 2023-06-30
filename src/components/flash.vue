<template>
  <transition-group
    appear
    name="fade-slide-vert"
  >
    <div
      v-for="(messages, type) in fullMessages"
      :key="type.toString()"
      class="p-2.5 mb-2.5 text-center text-white"
      :class="typeClass(type)"
      role="alert"
      data-test="flash"
    >
      <ul class="flex justify-between items-center">
        <li
          v-for="(m, i) in messages"
          :key="`${type}-${i}`"
        >
          {{ m }}
        </li>
        <button
          type="button"
          class="btn-clear"
          @click="close(type)"
        >
          <i class="material-icons align-middle">
            close
          </i>
          <span class="sr-only">Dismiss Alert Button</span>
        </button>
      </ul>
    </div>
  </transition-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { StoreModulePath } from '~/store'
import { FlashMutationTypes, FlashState } from '~/store/modules/flash'
import { FlashHash } from 'Interfaces/flashInterfaces'
import { StoreModuleType } from '~/store/interfaces'

interface Data {
  flash: FlashHash
}

export default defineComponent({
  props: {
    fixed: {
      type: Boolean,
      default: false,
    },
  },
  data(): Data {
    return {
      flash: {},
    }
  },
  computed: {
    fullMessages(): FlashHash<Array<string>> {
      const flashes: FlashHash<Array<string>> = {}
      for (const key in this.flash) {
        const val: string | string[] = this.flash[key]
        if (val instanceof Array) {
          flashes[key] = val
        } else {
          flashes[key] = [val]
        }
      }
      return flashes
    },
    hasMessages(): boolean {
      return Object.keys(this.fullMessages).length > 0
    },
    flashState(): FlashState {
      return this.$store.state[StoreModuleType.Flash]
    },
  },
  watch: {
    [`$store.state.${StoreModuleType.Flash}.trigger`]: function (
      newVal,
      _oldVal,
    ) {
      if (newVal) this.getFlash()
    },
    '$route.fullPath': function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getFlash()
      }
    },
  },
  mounted() {
    this.getFlash()
  },
  methods: {
    close(type: string | number): void {
      delete this.flash[type]
    },
    getFlash(): void {
      this.flash = Object.assign({}, this.flashState.flash)
      this.$store.commit(StoreModulePath.Flash + FlashMutationTypes.RESET)
    },
    typeClass(type: string | number): string {
      const classes = {
        alert: 'bg-red',
        success: 'bg-green',
      }
      return classes[type] || 'bg-blue'
    },
  },
})
</script>
