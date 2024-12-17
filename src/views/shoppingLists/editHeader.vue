<template>
  <ul
    v-if="shoppingList"
    class="flex flex-col xs:flex-row gap-5 sm:place-items-center sm:justify-center text-2xl mt-4"
  >
    <li>
      <router-link
        :to="{ name: $routerExtension.names.ShoppingList }"
        class="flex"
      >
        <i class="material-icons my-auto">receipt</i>
        <span>Back</span>
      </router-link>
    </li>
    <li v-if="shoppingList.items.length">
      <button
        type="button"
        class="flex"
        @click="destroyAll"
      >
        <i class="material-icons align-middle my-auto">delete</i>
        <span class="m-auto">Delete All</span>
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapMutations, mapState, useStore } from 'vuex'
import { StoreModulePath, stateKey } from '~/store'
import { RootState } from '~/store/interfaces'
import { FlashMutationTypes } from '~/store/modules/flash'
import { ShoppingListActionTypes } from '~/store/modules/shoppingLists/actions'
import { HttpStatusCode } from '~/utils/httpUtils'

export default defineComponent({
  name: 'ShowShoppingListHeader',
  computed: {
    ...mapState(StoreModulePath.ShoppingLists, { shoppingList: 'current' }),
    ability() {
      const store = useStore<RootState>(stateKey)
      return store.state.ability.ability
    },
  },
  methods: {
    // ...mapMutations(StoreModulePath.Session, { signOut: SessionMutationTypes.SIGN_OUT }),
    ...mapMutations(StoreModulePath.Flash, { setFlash: FlashMutationTypes.SET }),
    ...mapActions(StoreModulePath.ShoppingLists, { update: ShoppingListActionTypes.UPDATE }),
    async save(opts: { onSuccess?: () => void } = {}) {
      try {
        const response = await this.update(this.shoppingList)
        opts.onSuccess?.()
        this.updateSuccessful(response)
      } catch (error) {
        this.updateError(error as unknown as Response)
      }
    },
    async destroyAll() {
      if (!this.shoppingList) return

      this.shoppingList.items.splice(0, this.shoppingList.items.length)
      return this.save()
    },
    async updateSuccessful(response: Response) {
      const responseClone = response.clone()
      const json = await response.json()
      if (json.error) {
        this.updateFailed(responseClone)
      }
    },
    async updateFailed(response: Response) {
      const json = await response.json()
      this.processFailedUpdate(json?.error, { signOut: false })
    },
    async updateError(response: Response) {
      const json = await response.json()
      let errorText = json?.error
      const opts: { signOut: boolean | null } = { signOut: null }
      switch (json?.status) {
        case (HttpStatusCode.Unauthorized):
          opts.signOut = true
          break
        case (HttpStatusCode.Forbidden):
          errorText = errorText ?? 'You are not authorized to update this shopping list.'
          break
        default:
          opts.signOut = false
          break
      }
      this.processFailedUpdate(errorText, opts)
    },
    processFailedUpdate(errorText: string | null | undefined, { signOut }: { signOut: boolean | null }) {
      if (signOut) this.signOut()
      if (errorText) {
        this.setFlash({ flash: { alert: errorText || 'An unknown error occurred' } })
      }
    },
  },
})
</script>
