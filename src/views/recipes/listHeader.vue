<template>
  <ul>
    <li v-if="signedIn">
      <router-link
        :to="{ name: $routerExtension.names.NewRecipe }"
        class="safe"
      >
        <i class="material-icons spin">add_circle_outline</i>
        <span>New Recipe</span>
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'vuex'

export default defineComponent({
  name: 'RecipeListHeader',
  setup() {
    const getters = mapState('sessions', { signedIn: 'signedIn' })
    return {
      ...getters,
    }
  },
})
</script>
