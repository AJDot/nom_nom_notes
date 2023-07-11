<template>
  <div class="flex flex-col">
    <Loading v-if="isLoading()" />
    <app-header />
    <router-view />
    <footer class="mx-2 my-5 sticky top-full">
      <ul class="text-xs">
        <li>
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
        </li>
        <li>
          The animation "ellipsis" is provided by
          <a
            href="https://loading.io/"
            target="_blank"
            title="loading.io"
          >
            loading.io
          </a>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppHeader from '~/components/app-header.vue'
import loading from '~/mixins/loading'

export default defineComponent({
  components: {
    AppHeader,
  },
  mixins: [
    loading,
  ],
})
</script>
