<template>
  <ul class="flex flex-col xs:flex-row gap-5 sm:place-items-center sm:justify-center text-2xl mt-4">
    <li>
      <router-link
        :to="{ name: $routerExtension.names.Recipes }"
        class="flex"
      >
        <i class="material-icons my-auto">view_comfy</i>
        <span>Recipe Cards</span>
      </router-link>
    </li>
    <li v-if="recipe && ability.can('update', recipe)">
      <router-link
        :to="{ name: $routerExtension.names.EditRecipe }"
        class="flex"
      >
        <i class="material-icons my-auto">edit</i>
        <span>Edit Recipe</span>
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import Recipe from '~/models/recipe'
import { stateKey } from '~/store'
import { RootState } from '~/store/interfaces'

export default defineComponent({
  name: 'ShowRecipeHeader',
  computed: {
    recipe(): Recipe | null {
      return Recipe.query().find(this.$router.currentRoute.value.params.clientId)
    },
    ability() {
      const store = useStore<RootState>(stateKey)
      return store.state.ability.ability
    },
  },
})
</script>
