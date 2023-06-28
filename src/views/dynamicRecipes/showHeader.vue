<template>
  <ul class="flex flex-col xs:flex-row gap-5 sm:place-items-center sm:justify-center text-2xl mt-4">
    <li>
      <router-link
        :to="{ name: $routerExtension.names.DynamicRecipes }"
        class="flex"
      >
        <i class="material-icons my-auto">arrow_back</i>
        <span>List</span>
      </router-link>
    </li>
    <li v-if="dynamicRecipe && ability.can('update', dynamicRecipe)">
      <router-link
        :to="{ name: $routerExtension.names.EditDynamicRecipe }"
        class="flex"
        @click="setCurrentMode(null)"
      >
        <i class="material-icons my-auto">edit</i>
        <span>Edit</span>
      </router-link>
    </li>
    <li v-if="dynamicRecipe && !isShoppingListMode">
      <button @click="setCurrentMode('shopping')">
        <i class="material-icons my-auto">receipt</i>
        <span>Add to Shopping List</span>
      </button>
    </li>
    <li v-if="dynamicRecipe && isShoppingListMode">
      <button @click="confirmNewShoppingListItems">
        <i class="material-icons my-auto">receipt</i>
        <span>Confirm</span>
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapMutations, mapState, useStore } from 'vuex'
import DynamicRecipe from '~/models/dynamicRecipe'
import { StoreModulePath, stateKey } from '~/store'
import { RootState } from '~/store/interfaces'
import { FlashMutationTypes } from '~/store/modules/flash'
import { ModeActionTypes } from '~/store/modules/interfaces/modules/mode'
import { ShoppingListActionTypes } from '~/store/modules/shoppingLists/actions'

export default defineComponent({
  name: 'ShowDynamicRecipeHeader',
  computed: {
    ...mapState(StoreModulePath.Interfaces + StoreModulePath.Mode, { currentMode: 'current' }),
    dynamicRecipe(): DynamicRecipe | null {
      return DynamicRecipe.query().find(this.$router.currentRoute.value.params.clientId)
    },
    ability() {
      const store = useStore<RootState>(stateKey)
      return store.state.ability.ability
    },
    isShoppingListMode(): boolean {
      return this.currentMode === 'shopping'
    },
  },
  methods: {
    ...mapActions(StoreModulePath.Interfaces + StoreModulePath.Mode, { setCurrentMode: ModeActionTypes.SET }),
    ...mapActions(StoreModulePath.ShoppingLists, { updateShoppingList: ShoppingListActionTypes.CONFIRM_SELECTED }),
    ...mapMutations(StoreModulePath.Flash, { setFlash: FlashMutationTypes.SET }),
    async confirmNewShoppingListItems() {
      await this.updateShoppingList()
      this.setCurrentMode(null)
      this.setFlash({ flash: { success: 'Shopping list updated.' } })
    },
  },
})
</script>
