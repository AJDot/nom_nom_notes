<template>
  <draggable
    tag="section"
    :draggable="draggable"
    :droppable="droppableTest"
    :item="block"
    class="flex flex-row basis-full gap-2 sm:gap-0 p-1 rounded-md"
    :hover-color="hoverColor"
    :class="{ 'cursor-pointer': isChooseMode }"
    data-test-block="ingredient"
    @drop="onDrop"
    @click.self.stop="onClick"
  >
    <div
      v-if="isShoppingListMode && block.content.name?.trim()"
      class="flex items-center min-h-4"
    >
      <input
        :id="`shopping-list-checkbox-${block.id}`"
        type="checkbox"
        :value="block.id"
        class="w-5 h-5 accent-green-500 bg-gray-100 border-gray-300 rounded-full focus:ring-gray-300 dark:focus:ring-gray-400 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        @change="selectBlock"
      >
    </div>
    <label
      :for="`shopping-list-checkbox-${block.id}`"
      class="flex grow flex-wrap pb-1 sm:px-2"
    >
      <div>
        <div
          v-if="isEditable || block.content.quantity"
          :key="block.id + '-quantity'"
          ref="quantity"
          v-toggle-state="(key) => isShowMode ? toggleToggleState(key) : null"
          for="shopping-list-checkbox"
          :data-toggle-key="block.id"
          :placeholder="placeholder('quantity')"
          data-focus
          class="inline-block shrink-0 text-base font-bold min-h-4 outline-none border-x-2 border-transparent rounded-md break-anywhere focus:shadow-input focus:bg-gray-100 after:text-gray-500 after:empty:content-[attr(placeholder)]"
          :class="{ 'cursor-text': isEditable, 'cursor-pointer': !isEditable, 'line-through': toggleState[block.id] }"
          :contenteditable="isEditable"
          @input="onInputQuantity"
          @keydown="onKeydownQuantity"
          v-html="quantityDisplay"
        />
        <div
          v-if="isEditable || block.content.name"
          :key="block.id + '-name'"
          ref="name"
          v-toggle-state="(key) => isShowMode ? toggleToggleState(key) : null"
          for="shopping-list-checkbox"
          :data-toggle-key="block.id"
          :placeholder="placeholder('name')"
          data-focus
          class="inline-block shrink-0 text-base min-h-4 outline-none border-x-2 border-transparent rounded-md break-anywhere focus:shadow-input focus:bg-gray-100 after:text-gray-500 after:empty:content-[attr(placeholder)]"
          :class="{ 'cursor-text': isEditable, 'cursor-pointer': !isEditable, 'line-through': toggleState[block.id] }"
          :contenteditable="isEditable"
          @input="onInputName"
          @keydown="onKeydownName"
          v-html="block.content.name"
        />
        <div
          :key="block.id + '-text'"
          ref="text"
          v-toggle-state="(key) => isShowMode ? toggleToggleState(key) : null"
          :data-toggle-key="block.id"
          :placeholder="placeholder('text')"
          data-focus
          class="inline-block grow text-base italic min-h-4 outline-none border-x-2 border-transparent rounded-md break-anywhere focus:shadow-input focus:bg-gray-100 after:text-gray-500 after:empty:content-[attr(placeholder)]"
          :class="{ 'cursor-text': isEditable, 'cursor-pointer': !isEditable, 'line-through': toggleState[block.id] }"
          :contenteditable="isEditable"
          @input="onInputText"
          @keydown="onKeydownText"
          v-html="block.content.text"
        />
      </div>
    </label>
  </draggable>
</template>

<script lang="ts">
import Draggable from '@/modules/draggable/draggable.vue'
import { defineComponent } from 'vue'
import { mapActions, mapState } from 'vuex'
import { IngredientBlock } from 'Interfaces/blockInterfacesGeneral'
import { ShoppingListItem } from 'Interfaces/shoppingListInterfaces'
import blockMixin from '~/mixins/blockMixin'
import preserveCaretMixin from '~/mixins/preserveCaretMixin'
import { StoreModulePath } from '~/store'
import { ChoiceActionTypes } from '~/store/modules/interfaces/modules/choice'
import { ToggleActionTypes } from '~/store/modules/interfaces/modules/toggle'
import { ShoppingListMutationTypes } from '~/store/modules/shoppingLists/mutations'
import Guid from '~/utils/guid'
import math from '~/utils/math'

interface Data {
  shoppingListItem: ShoppingListItem | null
}

export default defineComponent({
  name: 'IngredientBlock',
  components: {
    Draggable,
  },
  mixins: [
    blockMixin<IngredientBlock>(),
    preserveCaretMixin((_key, comp) => comp.isEditable, 'quantity', 'name', 'text'),
  ],
  data(): Data {
    return {
      shoppingListItem: null,
    }
  },
  computed: {
    ...mapState(StoreModulePath.Interfaces + StoreModulePath.Toggle, { toggleState: 'state' }),
    ...mapState(StoreModulePath.Interfaces + StoreModulePath.Choice, { currentChoice: 'current' }),
    ...mapState(StoreModulePath.ShoppingLists, { selectedBlocks: 'selectedItems' }),
    ...mapState(StoreModulePath.Scale, { scale: 'scale' }),
    quantityDisplay(): string {
      if (this.canScale) {
        const unit = math.parseUnit(this.block.content.quantity || '1', { unitFallback: 'scale' })
        const unitScaled = unit.multiply(math.toNumber(this.scale))
        return math.format(unitScaled, { unitTypeLess: math.isMadeUp(unitScaled) })
      } else {
        return this.block.content.quantity
      }
    },
    canScale(): boolean {
      return (this.isShowMode || this.isShoppingListMode) && this.scale !== '1'
    },
  },
  watch: {
    mode(newVal, _oldVal) {
      if (newVal !== 'show') {
        this.setToggleState({ key: this.block.id, value: false })
      }
    },
  },
  methods: {
    ...mapActions(StoreModulePath.Interfaces + StoreModulePath.Toggle, { setToggleState: ToggleActionTypes.SET, toggleToggleState: ToggleActionTypes.TOGGLE }),
    ...mapActions(StoreModulePath.Interfaces + StoreModulePath.Choice, { unsetCurrentChoice: ChoiceActionTypes.UNSET }),
    selectBlock() {
      if (this.shoppingListItem && this.selectedBlocks.includes(this.shoppingListItem)) {
        this.$store.commit(
          StoreModulePath.ShoppingLists + ShoppingListMutationTypes.UNSELECT_ITEM,
          this.shoppingListItem.id,
        )
      } else {
        this.shoppingListItem = { id: Guid.create(), quantity: this.quantityDisplay, name: this.block.content.name!, description: this.block.content.text! }
        this.$store.commit(StoreModulePath.ShoppingLists + ShoppingListMutationTypes.SELECT_ITEM, this.shoppingListItem)
      }
    },
    onDrop(payload) {
      const { dragItemId: moveId, dropItemId: toId } = payload
      this.director.onMove({ moveId, toId })
      this.save()
    },
    onClick(event) {
      if (!this.isEditable && !this.isChooseMode) return

      if (this.currentChoice) {
        const captain = this.director.captainFor(this.block)
        captain.onChoose({ event, choice: this.currentChoice })
        this.unsetCurrentChoice()
      }
    },
    onInputQuantity(event) {
      if (!this.isEditable) return
      const captain = this.director.captainFor(this.block)
      this.director.onInput({
        block: this.block,
        event,
        call: () => {
          captain.onInput({ event, contentType: 'quantity' })
          this.save()
        },
      })
    },
    onInputName(event) {
      if (!this.isEditable) return
      const captain = this.director.captainFor(this.block)
      this.director.onInput({
        block: this.block,
        event,
        call: () => {
          captain.onInput({ event, contentType: 'name' })
          this.save()
        },
      })
    },
    onInputText(event) {
      if (!this.isEditable) return
      const captain = this.director.captainFor(this.block)
      this.director.onInput({
        block: this.block,
        event,
        call: () => {
          captain.onInput({ event, contentType: 'text' })
          this.save()
        },
      })
    },
    onKeydownQuantity(event) {
      if (!this.isEditable) return

      switch (event.key) {
        case 'ArrowDown':
          $(this.$refs.name as HTMLElement).trigger('focus')
          break
        case 'ArrowUp':
          this.onArrowUp(event)
          break
        case 'Enter':
          this.onEnter(event)
          break
        case 'Backspace':
          this.onBackspace(event)
          break
        case 'Delete': {
          const captain = this.director.captainFor(this.block)
          if (captain.isEmpty) {
            this.onDelete(event)
          }
          break
        }
      }
    },
    onKeydownName(event) {
      if (!this.isEditable) return

      switch (event.key) {
        case 'ArrowDown':
          $(this.$refs.text as HTMLElement).trigger('focus')
          break
        case 'ArrowUp':
          $(this.$refs.quantity as HTMLElement).trigger('focus')
          break
        case 'Enter':
          this.onEnter(event)
          break
        case 'Backspace':
          this.onBackspace(event)
          break
        case 'Delete': {
          const captain = this.director.captainFor(this.block)
          if (captain.isEmpty) {
            this.onDelete(event)
          }
          break
        }
      }
    },
    onKeydownText(event) {
      if (!this.isEditable) return

      switch (event.key) {
        case 'ArrowDown':
          this.onArrowDown(event)
          break
        case 'ArrowUp':
          $(this.$refs.name as HTMLElement).trigger('focus')
          break
        case 'Enter':
          this.onEnter(event)
          break
        case 'Backspace':
          this.onBackspace(event)
          break
        case 'Delete':
          this.onDelete(event)
          break
      }
    },
    onArrowDown(event) {
      if (!this.isEditable) return

      this.director.onArrowDown({ block: this.block, event })
    },
    onArrowUp(event) {
      if (!this.isEditable) return

      this.director.onArrowUp({ block: this.block, event })
    },
    onEnter(event: KeyboardEvent) {
      if (!this.isEditable) return

      if (!event.shiftKey) {
        const captain = this.director.captainFor(this.block)
        this.director.onEnter({
          block: this.block,
          event,
          call: () => {
            captain.onEnter({ event })
            this.save()
            this.director.focusAfter(this.block)
          },
        })
        event.preventDefault()
      }
    },
    /**
     * +onInput+ doesn't fire when backspace is pressed when input field is already empty but +onBackspace+ does
     * but +onBackspace+ also fires when input field is not empty, so filter that out
     */
    onBackspace(event) {
      if (!this.isEditable) return

      const captain = this.director.captainFor(this.block)
      if (captain.isEmpty) {
        this.director.onBackspace({
          block: this.block,
          event,
          call: () => {
            this.director.focusBefore(this.block)
            this.director.destroy(this.block, 'down')
            this.save()
          },
        })
      }
    },
    onDelete(_event) {
      if (!this.isEditable) return

      const captain = this.director.captainFor(this.block)
      if (captain.isEmpty) {
        const nextBlock = this.director.blockAfter(this.block)
        this.director.destroy(this.block, 'down')
        if (nextBlock) setTimeout(() => this.director.focus(nextBlock), 50)
        this.save()
      }
    },
    save() {
      this.director.onSave()
    },
    placeholder(type: 'quantity' | 'name' | 'text'): string {
      if (!this.isEditable) return ''

      switch (type) {
        case 'quantity':
          return 'Quantity'
        case 'name':
          return 'Name'
        case 'text':
          return "Description (Type '/' for commands)"
      }
    },
  },
})
</script>
