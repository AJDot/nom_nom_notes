<template>
  <dropdown-item class="py-2 pl-3">
    <slot />
  </dropdown-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DropdownItem from '@/structure/dropdown-item.vue'

export default defineComponent({
  components: {
    DropdownItem,
  },
})
</script>