<template>
  <div>
    <app-header />
    <router-view />
    <footer>
      <div>
        Recipe image placeholder icon
        <a
          href="http://www.freepik.com"
          title="Freepik"
        >Freepik</a> from
        <a
          href="https://www.flaticon.com/"
          title="Flaticon"
        >www.flaticon.com</a>
        is licensed by
        <a
          href="http://creativecommons.org/licenses/by/3.0/"
          title="Creative Commons BY 3.0"
          target="_blank"
        >CC 3.0 BY</a>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import AppHeader from '~/components/app-header.vue'

export default {
  components: {
    AppHeader,
  },
}
</script>
