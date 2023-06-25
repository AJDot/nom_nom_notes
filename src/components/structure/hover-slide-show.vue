<template>
  <img
    v-bind="currentImage"
    @mousemove="handleMousemove"
  >
</template>

<script lang="ts">
import { defineComponent, ImgHTMLAttributes } from 'vue'

interface Data {
  currentImage: ImgHTMLAttributes
}

export default defineComponent({
  props: {
    images: {
      type: Array as () => ImgHTMLAttributes[],
      required: true,
    },
  },
  data(): Data {
    return {
      currentImage: this.images[0],
    }
  },
  computed: {
    elWidth(): number {
      return this.$el.getBoundingClientRect().width
    },
    zoneWidth(): number {
      return this.elWidth / this.images.length
    },
  },
  methods: {
    zone(event: MouseEvent): number {
      return Math.max(0, Math.floor((event.offsetX - 1) / this.zoneWidth))
    },
    handleMousemove(event: MouseEvent) {
      this.currentImage = this.images[this.zone(event)] ?? this.images[0]
    },
  },
})
</script>
