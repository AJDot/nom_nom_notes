<template>
  <ul>
    <li>
      <router-link :to="{name: RouteName.Recipes}">
        <i class="material-icons wiggle">view_comfy</i>
        <span class="safe">Recipe Cards</span>

      </router-link>
    </li>
    <li v-if="signedIn">
      <router-link :to="{name: RouteName.EditRecipe}">
        <i class="material-icons wiggle">edit</i>
        <span class="safe">Edit Recipe</span>
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { RouteName } from '~/router/routeName'
import { mapState } from 'vuex'

export default defineComponent({
  name: "recipe-header",
  setup(props, context) {
    const getters = mapState('sessions', { signedIn: 'signedIn' })
    return {
      RouteName,
      ...getters,
    }
  },

})

</script>
