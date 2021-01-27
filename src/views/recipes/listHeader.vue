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
import { mapGetters } from 'vuex'
import { SessionGetterTypes } from '~/store/modules/sessions/getters'

export default defineComponent({
  name: 'RecipeListHeader',
  setup() {
    const getters = mapGetters('sessions', { signedIn: SessionGetterTypes.SIGNED_IN })
    return {
      ...getters,
    }
  },
})
</script>
