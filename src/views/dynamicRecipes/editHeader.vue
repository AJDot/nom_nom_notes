<template>
  <ul class="flex flex-col xs:flex-row gap-5 sm:place-items-center sm:justify-center text-2xl mt-4">
    <li>
      <router-link :to="{ name: $routerExtension.names.DynamicRecipes }" class="flex">
        <i class="material-icons my-auto">arrow_back</i>
        <span>List</span>
      </router-link>
    </li>
    <li v-if="dynamicRecipe">
      <router-link :to="{ name: $routerExtension.names.DynamicRecipe }" class="flex">
        <i class="material-icons my-auto">receipt</i>
        <span>Back</span>
      </router-link>
    </li>
    <li v-if="dynamicRecipe">
      <a href="#" class="flex" @click.prevent="confirmDestroy">
        <i class="material-icons my-auto">delete</i>
        <span>Delete</span>
      </a>
    </li>
  </ul>
  <modal :state="modalState" center>
    <template #header>
      <h3>Delete dynamic recipe</h3>
    </template>
    <template #body>
      <p>Are you sure you want to delete this dynamic recipe? This action cannot be undone.</p>
    </template>
    <template #footer>
      <button class="btn ml-3 text-white bg-red hover:text-white hover:bg-red-700" type="button" @click="destroy">
        Delete Dynamic Recipe
      </button>
      <button class="btn ml-3 text-gray-900 bg-white border-solid border border-gray-400 hover:bg-gray-100 active:bg-gray-100 focus:bg-gray-100" @click="resetModal">
        Cancel
      </button>
    </template>
  </modal>
</template>

<script lang="ts">
import Modal from '@/modal.vue'
import { AxiosError, AxiosResponse } from 'axios'
import DynamicRecipe from 'Models/dynamicRecipe'
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { ModalId } from '~/enums/modalId'
import loading from '~/mixins/loading'
import router from '~/router'
import { stateKey, StoreModulePath } from '~/store'
import { RootState } from '~/store/interfaces'
import { DynamicRecipeActionTypes } from '~/store/modules/dynamicRecipes/actions'
import { FlashActionTypes } from '~/store/modules/flash'

export default defineComponent({
  name: 'DynamicRecipeEditHeader',
  components: {
    Modal,
  },
  mixins: [
    loading,
  ],
  setup() {
    const store = useStore<RootState>(stateKey)
    const clientId = computed(() => router.currentRoute.value.params.clientId)
    if (clientId.value) {
      store.dispatch(StoreModulePath.DynamicRecipes + DynamicRecipeActionTypes.FETCH, clientId.value)
    }
    return {
      dynamicRecipe: computed(() => {
        if (!clientId.value) return null

        return DynamicRecipe.find(clientId.value)
      }),
      recipeName: '',
    }
  },
  computed: {
    modalState(): boolean {
      return this.$modal.state(ModalId.DeleteRecipe)
    },
  },
  methods: {
    async destroy() {
      // need to save this because it can't be referenced after recipe is destroyed
      if (this.dynamicRecipe) this.recipeName = this.dynamicRecipe.name ?? 'Unnamed Recipe'
      this.resetModal()
      this.loading(async () => {
        await this.$store.dispatch(StoreModulePath.DynamicRecipes + DynamicRecipeActionTypes.DESTROY, this.dynamicRecipe)
          .then((response) => this.destroySuccessful(response))
          .catch((error) => this.destroyError(error))
      })
    },
    async destroySuccessful(response: AxiosResponse) {
      if (response.data.error) {
        this.destroyFailed(response)
        return
      }

      await this.$router.push({
        name: this.$routerExtension.names.DynamicRecipes,
      })
      if (this.recipeName) {
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { success: `${this.recipeName} was deleted successfully.` },
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
      this.$modal.show(ModalId.DeleteRecipe)
    },
    resetModal() {
      this.$modal.hide(ModalId.DeleteRecipe)
    },
  },
})
</script>
