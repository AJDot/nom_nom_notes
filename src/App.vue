<template>
  <app-layout id="app" />
</template>

<script lang="ts">
import AppLayout from '~/components/app-layout.vue'

export default {
  name: 'app',
  components: {
    AppLayout,
  },
  data () {
    $.ajax({
      url: 'http://localhost:3000/v1/recipes',
      method: 'get',
    })
    return {
      msg: 'Welcome to Your Vue.js App',
    }
  },
}
</script>
