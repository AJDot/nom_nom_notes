<template>
  <ul class="flex flex-col xs:flex-row gap-5 sm:place-items-center sm:justify-center text-2xl mt-4">
    <li v-if="shoppingList && ability.can('update', shoppingList)">
      <router-link
        :to="{ name: $routerExtension.names.EditShoppingList }"
        class="flex"
      >
        <i class="material-icons my-auto">edit</i>
        <span>Edit</span>
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts">
import ShoppingList from 'Models/shoppingList'
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { stateKey } from '~/store'
import { RootState } from '~/store/interfaces'

export default defineComponent({
  name: 'ShowShoppingListHeader',
  computed: {
    shoppingList(): ShoppingList | null {
      return ShoppingList.query().first()
    },
    ability() {
      const store = useStore<RootState>(stateKey)
      return store.state.ability.ability
    },
  },
})
</script>
