<template>
  <ul class="flex flex-col xs:flex-row gap-5 place-items-center text-2xl mt-4">
    <li>
      <router-link :to="{ name: $routerExtension.names.NewRecipe }">
        <i class="material-icons my-auto">add_circle_outline</i>
        <span>New Recipe</span>
      </router-link>
    </li>
    <li>
      <router-link
        :to="{ name: $routerExtension.names.DynamicRecipes }"
        class="flex"
      >
        <i class="material-icons my-auto">view_comfy</i>
        <span>Dynamic Recipe Cards</span>
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RecipeListHeader',
})
</script>
