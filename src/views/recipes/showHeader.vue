<template>
  <ul>
    <li>
      <router-link :to="{ name: $routerExtension.names.Recipes }">
        <i class="material-icons wiggle">view_comfy</i>
        <span class="safe">Recipe Cards</span>
      </router-link>
    </li>
    <li v-if="signedIn">
      <router-link :to="{ name: $routerExtension.names.EditRecipe }">
        <i class="material-icons wiggle">edit</i>
        <span class="safe">Edit Recipe</span>
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'vuex'

export default defineComponent({
  name: 'RecipeHeader',
  setup() {
    const getters = mapState('sessions', { signedIn: 'signedIn' })
    return {
      ...getters,
    }
  },
})
</script>
