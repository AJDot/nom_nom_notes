<template>
  <div class="ldio-spinner-ellipsis-c clear">
    <div class="ldio-spinner-ellipsis">
      <div
        v-for="i in Array(5)"
        :key="i"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Ellipsis',
})

</script>
