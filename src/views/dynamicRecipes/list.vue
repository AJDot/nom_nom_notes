<template>
  <div class="px-5 pt-5 overflow-hidden">
    <main class="overflow-hidden after:block after:clear-both">
      <ul class="flex gap-4 flex-wrap mb-2 justify-center">
        <li v-for="dynamicRecipe in dynamicRecipesForList" :key="dynamicRecipe.clientId"
          class="w-72 h-16 shadow-md rounded-md flex justify-center justify-items-center">
          <router-link :to="{ name: $routerExtension.names.EditDynamicRecipe, params: { clientId: dynamicRecipe.clientId } }" class="w-full h-full p-2 uppercase transition-all flex place-content-center place-items-center text-center rounded-md hover:text-green hover:bg-black">
            {{ dynamicRecipe.name }}
          </router-link>
        </li>
      </ul>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import DynamicRecipe from '~/models/dynamicRecipe'
import { stateKey, StoreModulePath } from '~/store'
import { DynamicRecipeActionTypes } from '~/store/modules/dynamicRecipes/actions'
import { ArrayUtils } from '~/utils/arrayUtils'

export default defineComponent({
  name: 'DynamicRecipesIndex',
  setup() {
    const store = useStore(stateKey)
    store.dispatch(StoreModulePath.DynamicRecipes + DynamicRecipeActionTypes.FETCH_ALL)
  },
  computed: {
    dynamicRecipes(): Array<DynamicRecipe> {
      return DynamicRecipe.query().get()
    },
    sortedDynamicRecipes(): Array<DynamicRecipe> {
      return ArrayUtils.sort(this.dynamicRecipes, (a: DynamicRecipe, b: DynamicRecipe) => {
        const nameB = b.name && b.name.toLowerCase()
        const nameA = a.name && a.name.toLowerCase()
        if (!nameB) return 1
        if (!nameA) return -1
        if (nameA > nameB) return 1
        if (nameA < nameB) return -1
        return 0
      })
    },
    dynamicRecipesForList(): Array<DynamicRecipe> {
      return this.sortedDynamicRecipes
    },
  },
})
</script>
