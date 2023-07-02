<template>
  <main class="mx-3">
    <section class="max-w-screen-lg p-2.5 mx-auto mb-8 rounded-2xl shadow-card grid grid-cols-1 gap-x-4 sm:grid-cols-2">
      <template v-if="shoppingList">
        <div class="grid grid-cols-2 sm:grid-cols-2 col-span-2">
          <div class="col-span-2">
            <flash
              v-if="isEditMode && !isEditable"
              :messages="{alert: ['Expand list to enable deletion']}"
              :dismissible="false"
            />
          </div>
          <h1 class="text-3xl py-1 inline-block">
            Shopping List
          </h1>
          <div class="flex flex-row-reverse">
            <button
              v-if="isShowMode || isEditMode && isCondensed"
              class="btn"
              @click="isCondensed = !isCondensed"
            >
              {{ isCondensed ? 'Expand' : 'Condense' }}
            </button>
            <button
              v-if="isEditable && selectedItemsIds.length"
              type="button"
              class="btn"
              @click="destroySelected"
            >
              <i class="material-icons align-middle">delete</i>
              <span class="m-auto">Delete ({{ selectedItemsIds.length }})</span>
            </button>
          </div>
        </div>
        <template v-if="shoppingList.items.length">
          <div
            v-for="item in items"
            :key="item.id"
            class="flex gap-3 sm:gap-1 col-span-2 sm:col-span-1 items-center px-2 py-0.5"
          >
            <input
              v-if="isEditable"
              :id="`shopping-list-checkbox-${item.id}`"
              v-model="selectedItemsIds"
              type="checkbox"
              :value="item.id"
              class="w-5 h-5 accent-green-500 bg-gray-100 border-gray-300 rounded-full focus:ring-gray-300 dark:focus:ring-gray-400 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 shrink-0"
            >
            <label
              :for="`shopping-list-checkbox-${item.id}`"
              class="flex grow sm:px-2"
              :class="{ 'cursor-pointer': isEditable, 'cursor-auto': !isEditable }"
            >
              <p>
                <span v-html="item.quantity" /> <span v-html="item.name" /> <span v-html="item.description" />
              </p>
            </label>
            <button
              v-if="isEditable"
              type="button"
              class="btn"
              @click="destroyItem(item)"
            >
              <i class="material-icons align-middle">delete</i>
            </button>
          </div>
        </template>
        <p v-else>
          There are no items in your shopping list.
        </p>
      </template>
      <template v-else>
        <p>Shopping list not found.</p>
      </template>
    </section>
  </main>
</template>

<script lang="ts">
import Flash from '@/flash.vue'
import RootState from '@vuex-orm/core/dist/src/modules/contracts/RootState'
import { ShoppingListItem } from 'Interfaces/shoppingListInterfaces'
import { AxiosError, AxiosResponse } from 'axios'
import { defineComponent } from 'vue'
import { mapActions, mapMutations, mapState, useStore } from 'vuex'
import currentUserMixin from '~/mixins/currentUserMixin'
import { StoreModulePath, stateKey } from '~/store'
import { FlashActionTypes, FlashMutationTypes } from '~/store/modules/flash'
import { SessionMutationTypes } from '~/store/modules/sessions/mutations'
import Guid from '~/utils/guid'
import { HttpStatusCode } from '~/utils/httpUtils'
import math from '~/utils/math'
import { ShoppingListActionTypes } from '../../store/modules/shoppingLists/actions'

interface Data {
  isCondensed: boolean
  selectedItemsIds: string[]
}

export default defineComponent({
  name: 'ShoppingListEdit',
  components: { Flash },
  mixins: [
    currentUserMixin,
  ],
  props: {
    view: {
      type: String,
      default: 'show',
      validator: prop => typeof prop === 'string' && ['show', 'edit'].includes(prop),
    },
  },
  data(): Data {
    return {
      isCondensed: false,
      selectedItemsIds: [],
    }
  },
  computed: {
    ...mapState(StoreModulePath.ShoppingLists, { shoppingList: 'current' }),
    items(): Pick<ShoppingListItem, 'id' | 'quantity' | 'name' | 'description'>[] {
      return this.isCondensed ? this.condensedItems : this.shoppingList.items
    },
    condensedItems(): Pick<ShoppingListItem, 'id' | 'quantity'| 'name' | 'description'>[] {
      if (!this.shoppingList) return []
      const shoppingItems: ShoppingListItem[] = this.shoppingList.items

      const items: {id: string, unit: math.Unit, name: string, nameNorm: string, description: string}[] = shoppingItems.map(item => {
        const quantity = item.quantity || '1'
        const [numString, unitString = item.name] = quantity.split(' ')

        const num = math.toNumber(numString)
        const normUnit = math.toUnitType(unitString)

        math.ensureUnit(normUnit)

        const unit = math.unit(num, normUnit)
        return {
          id: Guid.create(),
          unit,
          name: item.name,
          nameNorm: math.toUnitType(item.name),
          description: item.description,
        }
      })
      let index = 0
      while (index < items.length) {
        const item = items[index]
        let otherIndex = index + 1
        while (otherIndex < items.length) {
          const otherItem = items[otherIndex]
          if (item.nameNorm === otherItem.nameNorm && item.unit.equalBase(otherItem.unit)) {
            item.unit = math.add(item.unit, otherItem.unit)
            items.splice(otherIndex, 1)
          } else {
            otherIndex++
          }
        }
        index++
      }
      return items.map(item => {
        return { id: item.id, quantity: math.format(item.unit ?? math.unit('')), name: item.name, description: '' }
      })
    },
    mode(): 'show' | 'edit' {
      switch (this.view) {
        case 'show':
        case 'edit':
          return this.view
        default:
          return 'show'
      }
    },
    isShowMode(): boolean {
      return this.mode === 'show'
    },
    isEditMode(): boolean {
      return this.mode === 'edit'
    },
    isEditable(): boolean {
      return this.isEditMode && !this.isCondensed
    },
  },
  async beforeMount() {
    const store = useStore<RootState>(stateKey)
    try {
      if (!this.shoppingList) {
        await store.dispatch(
          StoreModulePath.ShoppingLists + ShoppingListActionTypes.FIND_OR_FETCH,
          this.currentUser.id,
        )
      }
    } catch (e) {
      await this.$router.push({
        name: this.$routerExtension.names.ShoppingList,
      })
      this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
        flash: { alert: 'Shopping List not found.' },
      })
    }
  },
  methods: {
    ...mapMutations(StoreModulePath.Session, { signOut: SessionMutationTypes.SIGN_OUT }),
    ...mapMutations(StoreModulePath.Flash, { setFlash: FlashMutationTypes.SET }),
    ...mapActions(StoreModulePath.ShoppingLists, { update: ShoppingListActionTypes.UPDATE }),
    async save(opts: { onSuccess?: () => void } = {}) {
      try {
        const response = await this.update(this.shoppingList)
        opts.onSuccess?.()
        this.updateSuccessful(response)
      } catch (error) {
        this.updateError(error as unknown as AxiosError)
      }
    },
    async destroyItem(item: Pick<ShoppingListItem, 'id'>) {
      const index = this.shoppingList.items.indexOf(item)
      if (index < 0) return false

      this.shoppingList.items.splice(index, 1)
      const selectedIndex = this.selectedItemsIds.indexOf(item.id)
      if (selectedIndex >= 0) this.selectedItemsIds.splice(selectedIndex, 1)
      return this.save()
    },
    async destroySelected() {
      this.selectedItemsIds.forEach(id => {
        const item = this.shoppingList.items.find(i => i.id === id)
        const index = this.shoppingList.items.indexOf(item)
        if (index === null) return

        this.shoppingList.items.splice(index, 1)
      })
      this.save({ onSuccess: () => { this.selectedItemsIds = [] } })
    },
    async updateSuccessful(response: AxiosResponse) {
      if (response.data.error) {
        this.updateFailed(response)
      }
    },
    updateFailed(error: AxiosResponse) {
      this.processFailedUpdate(error?.data?.error, { signOut: false })
    },
    updateError(error: AxiosError) {
      let errorText = error.response?.data.error
      const opts: { signOut: boolean | null } = { signOut: null }
      switch (error.response?.status) {
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
