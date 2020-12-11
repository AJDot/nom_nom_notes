<template>
  <ul>
    <li>
      <router-link
        :to="{name: $routerExtension.names.Recipe, params: {id: recipe.id}}"
        class="cancel"
      >
        <i class="material-icons wiggle">receipt</i>
        <span>Back to Recipe</span>
      </router-link>
    </li>
    <li v-if="signedIn && recipe">
      <a
        href="#"
        class="destroy"
        @click.prevent="confirmDestroy"
      >
        <i class="material-icons wiggle">delete</i>
        <span>Delete Recipe</span>
      </a>
    </li>
  </ul>
  <modal
    v-if="showModal"
    @close="showModal = false"
  >
    <template #header>
      <h3>Are you sure?</h3>
    </template>
    <template #footer>
      <button
        class="btn-link lg warn"
        type="button"
        @click="destroy"
      >
        Delete Recipe
      </button>
      <button
        class="btn-link lg cancel"
        @click="resetModal"
      >
        Cancel
      </button>
    </template>
  </modal>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { mapState, useStore } from 'vuex'
import { RootState } from '~/store/interfaces'
import { stateKey, StoreModulePath } from '~/store'
import { RecipeActionTypes } from '~/store/modules/recipes/actions'
import router from '~/router'
import Recipe from 'Models/recipe'
import { AxiosError, AxiosResponse } from 'axios'
import { FlashActionTypes } from '~/store/modules/flash'
import Modal from '@/modal.vue'

export default defineComponent({
  name: 'RecipeListHeader',
  components: {
    Modal,
  },
  setup() {
    const getters = mapState('sessions', { signedIn: 'signedIn' })
    const store = useStore<RootState>(stateKey)
    const id = router.currentRoute.value.params.id
    store.dispatch(StoreModulePath.Recipes + RecipeActionTypes.FETCH, id)
    return {
      ...getters,
      recipe: computed(() => Recipe.find(id)),
      recipeName: '',
      showModal: ref(false),
    }
  },
  methods: {
    async destroy() {
      // need to save this because it can't be referenced after recipe is destroyed
      if (this.recipe) this.recipeName = this.recipe.name ?? 'Unnamed Recipe'
      this.resetModal()
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
    confirmDestroy() {
      this.showModal = true
    },
    resetModal() {
      this.showModal = false
    },
  },
})
</script>
