<template>
  <ul class="flex gap-5 place-items-center text-2xl mt-4">
    <li v-if="signedIn()">
      <router-link :to="{ name: $routerExtension.names.NewRecipe }" class="safe">
        <i class="material-icons my-auto">add_circle_outline</i>
        <span>New Recipe</span>
      </router-link>
    </li>
    <li v-if="signedIn()">
      <router-link :to="{ name: $routerExtension.names.NewDynamicRecipe }" class="safe">
        <i class="material-icons my-auto">add_circle_outline</i>
        <span>New Dynamic Recipe</span>
      </router-link>
    </li>
    <li>
      <a href="http://localhost:5173/dynamic_recipes/20929632-ae2d-46a3-a98e-b936ffd01301/edit" class="flex">
        <span>Dynamic Recipe</span>
      </a>
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
