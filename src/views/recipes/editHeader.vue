<template>
  <ul>
    <li v-if="signedIn && recipe">
      <a
        href="#"
        @click.prevent="destroy"
      >
        <i class="material-icons wiggle">delete</i>
        <span class="destroy">Delete Recipe</span>
      </a>
    </li>
  </ul>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { mapState, useStore } from 'vuex'
import { RootState } from '~/store/interfaces'
import { stateKey, StoreModulePath } from '~/store'
import { RecipeActionTypes } from '~/store/modules/recipes/actions'
import router from '~/router'
import Recipe from 'Models/recipe'
import { AxiosError, AxiosResponse } from 'axios'
import { FlashActionTypes } from '~/store/modules/flash'

export default defineComponent({
  name: 'RecipeListHeader',
  setup() {
    const getters = mapState('sessions', { signedIn: 'signedIn' })
    const store = useStore<RootState>(stateKey)
    const id = router.currentRoute.value.params.id
    store.dispatch(StoreModulePath.Recipes + RecipeActionTypes.FETCH, id)
    return {
      ...getters,
      recipe: computed(() => Recipe.find(id)),
      recipeName: '',
    }
  },
  methods: {
    async destroy() {
      // need to save this because it can't be referenced after recipe is destroyed
      if (this.recipe) this.recipeName = this.recipe.name ?? 'Unnamed Recipe'
      await this.$store.dispatch(StoreModulePath.Recipes + RecipeActionTypes.DESTROY, this.recipe)
        .then((response) => this.destroySuccessful(response))
        .catch((error) => this.destroyError(error))
    },
    async destroySuccessful(response: AxiosResponse) {
      if (response.data.error) {
        this.destroyFailed(response)
        return
      }

      await this.$router.push({
        name: this.$routerExtension.names.Home,
      })
      if (this.recipeName) {
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { success: `${this.recipeName} was successfully deleted.` },
        })
      }
    },
    destroyFailed(error: AxiosResponse) {
      this.processFailedUpdate(error?.data?.error)
    },
    destroyError(error: AxiosError) {
      const errorText = error.response?.data.error
      this.processFailedUpdate(errorText)
    },
    processFailedUpdate(errorText: string | null | undefined) {
      this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
        flash: { alert: errorText || 'An unknown error occurred.' },
      })
    },
  },
})
</script>
