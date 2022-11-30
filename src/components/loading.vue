<template>
  <modal state transparent center>
    <ellipsis />
  </modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Modal from '@/modal.vue'
import Ellipsis from '@/animations/ellipsis.vue'

export default defineComponent({
  components: {
    Ellipsis,
    Modal,
  },
})
</script>
