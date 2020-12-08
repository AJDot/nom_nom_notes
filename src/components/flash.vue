<template>
  <div
    v-if="hasMessages"
    :key="$route.fullPath"
  >
    <transition-group
      v-for="(messages, type) in fullMessages"
      :key="type.toString()"
      appear
    >
      <div
        :key="type.toString()"
        class="alert alert-dismissible"
        role="alert"
      >
        <ul>
          <li
            v-for="(m, i) in messages"
            :key="`${type}-${i}`"
          >
            {{ m }}
          </li>
        </ul>
        <span>
          <button
            type="button"
            @click="close(type)"
          >
            x
            <span class="sr-only">Dismiss Alert Button</span>
          </button>
        </span>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { StoreModulePath } from '~/store'
import { StoreModuleType } from '~/store/interfaces'
import { FlashMutationTypes, FlashState } from '~/store/modules/flash'
import { FlashHash } from 'Interfaces/flashInterfaces'

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
    [`$store.state.${StoreModuleType.Flash}.trigger`]: function(
      newVal,
      _oldVal,
    ) {
      if (newVal) this.getFlash()
    },
    '$route.fullPath': function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getFlash()
      }
    },
  },
  mounted() {
    this.getFlash()
  },
  methods: {
    close(type: string): void {
      delete this.flash[type]
    },
    getFlash(): void {
      this.flash = Object.assign({}, this.flashState.flash)
      this.$store.commit(StoreModulePath.Flash + FlashMutationTypes.RESET)
    },
  },
})
</script>