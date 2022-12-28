<template>
  <ul class="flex flex-col sm:flex-row gap-5 sm:place-items-center sm:justify-center text-2xl mt-4">
    <li>
      <router-link :to="{ name: $routerExtension.names.Recipes }" class="flex">
        <i class="material-icons my-auto">view_comfy</i>
        <span>Recipe Cards</span>
      </router-link>
    </li>
    <li>
      <router-link :to="{ name: $routerExtension.names.EditRecipe }" class="flex">
        <i class="material-icons my-auto">edit</i>
        <span>Edit Recipe</span>
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ShowRecipeHeader',
})
</script>
