<template>
  <div class="px-5 pt-5">
    <template v-if="shoppingList">
      <div class="flex">
        <h1 class="grow text-3xl py-1 inline-block">
          Shopping List
        </h1>
        <button
          v-if="isEditable && selected.length"
          type="button"
          class="btn"
          @click="destroySelected"
        >
          <i class="material-icons align-middle">delete</i>
          <span class="m-auto">Delete ({{ selectedItemsIds.length }})</span>
        </button>
      </div>
      <div>
        <button
          class="btn"
          @click="isCondensed = !isCondensed"
        >
          {{ isCondensed ? 'Expand' : 'Condense' }}
        </button>
      </div>
      <template v-if="shoppingList.items.length">
        <div
          v-for="item in (isCondensed ? condensedItems : shoppingList.items)"
          :key="item.id"
          class="flex items-center sm:px-2 sm:py-1"
        >
          <input
            v-if="isEditable"
            :id="`shopping-list-checkbox-${item.id}`"
            v-model="selected"
            type="checkbox"
            :value="item.id"
            class="w-5 h-5 accent-green-500 bg-gray-100 border-gray-300 rounded-full focus:ring-gray-300 dark:focus:ring-gray-400 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          >
          <label
            :for="`shopping-list-checkbox-${item.id}`"
            class="flex grow sm:px-2"
            :class="{'cursor-pointer': isEditable, 'cursor-auto': !isEditable}"
          >
            <p>
              <span v-html="item.amount" /> <span v-html="item.description" />
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
  </div>
</template>

<script lang="ts">
import RootState from '@vuex-orm/core/dist/src/modules/contracts/RootState'
import { ShoppingListItem } from 'Interfaces/shoppingListInterfaces'
import { AxiosError, AxiosResponse } from 'axios'
import { defineComponent } from 'vue'
import { mapActions, mapMutations, mapState, useStore } from 'vuex'
import currentUserMixin from '~/mixins/currentUserMixin'
import { StoreModulePath, stateKey } from '~/store'
import { FlashActionTypes, FlashMutationTypes } from '~/store/modules/flash'
import { SessionMutationTypes } from '~/store/modules/sessions/mutations'
import { MathMutationTypes } from '~/store/modules/utils/modules/math'
import { HttpStatusCode } from '~/utils/httpUtils'
import math from '~/utils/math'
import { ShoppingListActionTypes } from '../../store/modules/shoppingLists/actions'

interface Data {
  isCondensed: boolean
}

export default defineComponent({
  name: 'ShoppingListEdit',
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
    }
  },
  computed: {
    ...mapState(StoreModulePath.ShoppingLists, { shoppingList: 'current' }),
    ...mapState(StoreModulePath.Utils + StoreModulePath.Math, { madeUpUnits: 'madeUp' }),
    condensedItems(): Pick<ShoppingListItem, 'amount' | 'description'>[] {
      if (!this.shoppingList) return []
      const isMadeUp = (unit: math.Unit): boolean => {
        return this.madeUpUnits.some(c => c.equalBase(unit))
      }
      function normalize(text: string): string {
        return text.toLocaleLowerCase().replace(/[\W_]+/g, '')
      }
      const shoppingItems: ShoppingListItem[] = this.shoppingList.items

      const items: {unit: math.Unit, description: string, descriptionNorm: string, amountOnly: boolean}[] = shoppingItems.map(item => {
        const amount = item.amount || '1'
        let [numString, unitString] = amount.split(' ')
        unitString = unitString || item.description

        const num = math.number(math.fraction(numString))
        const normUnit = normalize(unitString)

        try {
          math.unit(normUnit)
        } catch (e) {
          this.addMadeUpUnit(normUnit)
        }

        const unit = math.unit(math.fraction(num), normUnit)
        // const unit = math.unit(num, normUnit)
        return { unit, description: item.description, descriptionNorm: normalize(item.description), amountOnly: isMadeUp(unit) }
      })
      let index = 0
      while (index < items.length) {
        const item = items[index]
        let otherIndex = index + 1
        while (otherIndex < items.length) {
          const otherItem = items[otherIndex]
          if (item.descriptionNorm === otherItem.descriptionNorm && item.unit.equalBase(otherItem.unit)) {
            item.unit = math.add(item.unit, otherItem.unit)
            items.splice(otherIndex, 1)
          } else {
            otherIndex++
          }
        }
        index++
      }
      return items.map(item => {
        let unit = item.unit ?? math.unit('')
        if (item.amountOnly) unit = math.unit(unit.toNumber().toString())
        const amountDecimal = unit.format({ fraction: 'decimal' }) // #=> 2.1(6) is outputted for 13/6
        const parse = amountDecimal.match(/(\d+)(?:\.(\d+)?\((\d+)\))?(.+)?/)
        let amount: string
        if (parse) {
          // #=> turns 2.1(6) into 2 1/6
          const [whole, n = 1, d, unitString = ''] = parse.slice(1)
          const parts: string[] = []
          if (whole !== '0') parts.push(whole)
          if (n && d) parts.push(` ${n}/${d}`)
          parts.push(unitString)
          amount = parts.join(' ')
        } else {
          amount = unit.format({ fraction: math.isInteger(unit.toNumber()) ? 'decimal' : 'ratio' })
        }
        return { amount, description: item.description }
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
      return this.isEditMode
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
      // throw e
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
    async save(opts: {onSuccess?: () => void} = {}) {
      try {
        const response = await this.update(this.shoppingList)
        opts.onSuccess?.()
        this.updateSuccessful(response)
      } catch (error) {
        this.updateError(error as unknown as AxiosError)
      }
    },
    async destroyItem(item: ShoppingListItem) {
      console.log(item)

      const index = this.shoppingList.items.indexOf(item)
      if (index < 0) return false

      this.shoppingList.items.splice(index, 1)
      const selectedIndex = this.selected.indexOf(item.id)
      if (selectedIndex >= 0) this.selected.splice(selectedIndex, 1)
      return this.save()
    },
    async destroySelected() {
      this.selected.forEach(id => {
        const item = this.shoppingList.items.find(i => i.id === id)
        const index = this.shoppingList.items.indexOf(item)
        if (index === null) return

        this.shoppingList.items.splice(index, 1)
      })
      this.save({ onSuccess: () => { this.selected = [] } })
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
