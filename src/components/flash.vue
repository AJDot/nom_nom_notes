<template>
  <div v-if="hasMessages" :key="$route.fullPath">
    <transition-group appear v-for="(messages, type) in fullMessages" :key="type.toString()">
      <div class="alert alert-dismissible" role="alert" :key="type.toString()">
        <ul>
          <li v-for="m in messages">{{ m }}</li>
        </ul>
        <span>
          <button @click="close(type)" type="button">
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
  data: function () {
    return {
      flash: {},
    }
  },
  mounted() {
    this.getFlash()
  },
  computed: {
    fullMessages(): { [key: string]: string[] } {
      let flashes = {}
      for (let key in this.flash) {
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
  },
  methods: {
    close(type: string): void {
      delete this.flash[type]
    },
    getFlash(): void {
      this.flash = Object.assign({}, (<FlashState>this.$store.state[StoreModuleType.Flash]).flash)
      this.$store.commit(StoreModulePath.Flash + FlashMutationTypes.RESET)
    },
  },
  watch: {
    [`$store.state.${StoreModuleType.Flash}.trigger`]: function (newVal, oldVal) {
      if (newVal) this.getFlash()
    },
    '$route.fullPath': function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getFlash()
      }
    }
  },
})
</script>
