<template>
  <ul class="flex gap-5 place-items-center text-2xl mt-4">
    <li v-if="signedIn()">
      <router-link :to="{ name: $routerExtension.names.NewDynamicRecipe }" class="safe">
        <i class="material-icons my-auto">add_circle_outline</i>
        <span>New Dynamic Recipe</span>
      </router-link>
    </li>
    <li>
      <router-link :to="{ name: $routerExtension.names.Recipes }" class="flex">
        <i class="material-icons my-auto">view_comfy</i>
        <span>Recipe Cards</span>
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
