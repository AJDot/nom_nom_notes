<template>
  <ul>
    <li>
      <router-link
        :to="{ name: $routerExtension.names.Recipes }"
        class="safe"
      >
        <i class="material-icons wiggle">view_comfy</i>
        <span>Recipe Cards</span>
      </router-link>
    </li>
    <li v-if="signedIn">
      <router-link
        :to="{ name: $routerExtension.names.EditRecipe }"
        class="safe"
      >
        <i class="material-icons wiggle">edit</i>
        <span>Edit Recipe</span>
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
import { SessionGetterTypes } from '~/store/modules/sessions/getters'

export default defineComponent({
  name: 'ShowRecipeHeader',
  setup() {
    const getters = mapGetters('sessions', { signedIn: SessionGetterTypes.SIGNED_IN })
    return {
      ...getters,
    }
  },
})
</script>
