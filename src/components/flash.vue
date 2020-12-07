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
import { StoreModulePath, StoreModuleType } from '~/store'
import { FlashMutationTypes, FlashState } from '~/store/modules/flash'

export default defineComponent({
  props: {
    fixed: {
      type: Boolean,
      default: false,
    },
  },
  data: function() {
    return {
      flash: {},
    }
  },
  computed: {
    fullMessages(): { [key: string]: string[] } {
      const flashes = {}
      for (const key in this.flash) {
        if (this.flash[key] instanceof Array) {
          flashes[key] = this.flash[key]
        } else {
          flashes[key] = [this.flash[key]]
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
