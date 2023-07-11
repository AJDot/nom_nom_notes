<template>
  <div class="my-auto">
    <div class="">
      <h1 class="text-5xl font-bold text-center">
        404
      </h1>
      <p class="text-4xl text-center">
        Page Not Found.
      </p>
      <p class="text-3xl text-center">
        Hit the logo to go home <span class="hidden sm:inline">--></span>
        <router-link
          :to="{ name: $routerExtension.names.Home }"
          aria-label="Go to Nom Nom Notes Home"
          class="align-middle"
        >
          <img
            src="/logo-512x512.png"
            alt="Nom Nom Notes"
            class="h-20 w-20 align-middle inline-block"
          >
        </router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NotFound',
})
</script>
