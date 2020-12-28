<template>
  <modal
    state
    hide-container
    :classes="{body: 't-align-center'}"
  >
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
