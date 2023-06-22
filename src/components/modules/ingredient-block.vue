<template>
  <draggable tag="section" :draggable="draggable" :droppable="droppableTest" :item="block" @drop="onDrop" class="flex flex-row basis-full p-1 rounded-md" :hover-color="hoverColor" :class="{ 'cursor-pointer': isChooseMode }" @click.self.stop="onClick" data-test-block="ingredient">
    <div :key="block.id + '-amount'" :data-toggle-key="block.id" :placeholder="placeholder" data-focus class="shrink-0 text-base min-h-9 py-1 outline-none border-2 border-transparent rounded-md break-anywhere focus:shadow-input focus:bg-gray-100 after:text-gray-500 after:empty:content-[attr(placeholder)] sm:px-2" :class="{ 'cursor-text': isEditable, 'cursor-pointer': !isEditable, 'line-through': toggleState[block.id] }" :contenteditable="isEditable" v-html="block.content.amount" @input="onInputAmount" @keydown="onKeydownAmount" ref="amount" v-toggle-state="(key) => isShowMode ? toggleToggleState(key) : null"></div>
    <div :key="block.id + '-text'" :data-toggle-key="block.id" :placeholder="placeholder" data-focus class="grow text-base min-h-9 py-1 outline-none border-2 border-transparent rounded-md break-anywhere focus:shadow-input focus:bg-gray-100 after:text-gray-500 after:empty:content-[attr(placeholder)] sm:px-2" :class="{ 'cursor-text': isEditable, 'cursor-pointer': !isEditable, 'line-through': toggleState[block.id] }" :contenteditable="isEditable" v-html="block.content.text" @input="onInputText" @keydown="onKeydownText" ref="text" v-toggle-state="(key) => isShowMode ? toggleToggleState(key) : null"></div>
  </draggable>
</template>

<script lang="ts">
import Draggable from '@/modules/draggable/draggable.vue'
import { defineComponent } from 'vue'
import { mapActions, mapState } from 'vuex'
import { IngredientBlock } from '~/interfaces/blockInterfacesGeneral'
import blockMixin from '~/mixins/blockMixin'
import preserveCaretMixin from '~/mixins/preserveCaretMixin'
import { StoreModulePath } from '~/store'
import { ChoiceActionTypes } from '~/store/modules/interfaces/modules/choice'
import { ToggleActionTypes } from '~/store/modules/interfaces/modules/toggle'

export default defineComponent({
  name: "IngredientBlock",
  components: {
    Draggable
  },
  mixins: [
    blockMixin<IngredientBlock>(),
    preserveCaretMixin('amount', 'text'),
  ],
  computed: {
    ...mapState(StoreModulePath.Interfaces + StoreModulePath.Toggle, { toggleState: 'state' }),
    ...mapState(StoreModulePath.Interfaces + StoreModulePath.Choice, { currentChoice: 'current' }),
    placeholder(): string {
      return this.isEditable ? this.director.find(this.block.id) ? "Type '/' for commands" : "Type anything..." : ''
    },
  },
  methods: {
    ...mapActions('interfaces/toggle', { setToggleState: ToggleActionTypes.SET, toggleToggleState: ToggleActionTypes.TOGGLE }),
    ...mapActions(StoreModulePath.Interfaces + StoreModulePath.Choice, { unsetCurrentChoice: ChoiceActionTypes.UNSET }),
    onDrop(payload) {
      const { dragItemId: moveId, dropItemId: toId } = payload
      this.director.onMove({ moveId, toId })
    },
    onClick(event) {
      if (!this.isEditable && !this.isChooseMode) return

      if (this.currentChoice) {
        const captain = this.director.captainFor(this.block)
        captain.onChoose({ event, choice: this.currentChoice })
        this.unsetCurrentChoice()
      }
    },
    onInputAmount(event) {
      if (!this.isEditable) return
      const captain = this.director.captainFor(this.block)
      this.director.onInput({
        block: this.block, event, call: () => {
          captain.onInput({ event, contentType: 'amount' })
          this.save()
        }
      })
    },
    onInputText(event) {
      if (!this.isEditable) return
      const captain = this.director.captainFor(this.block)
      this.director.onInput({
        block: this.block, event, call: () => {
          captain.onInput({ event, contentType: 'text' })
          this.save()
        }
      })
    },
    onKeydownAmount(event) {
      if (!this.isEditable) return

      switch (event.key) {
        case 'ArrowDown':
          $(this.$refs.text as HTMLElement).trigger('focus')
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
        case 'Delete':
          const captain = this.director.captainFor(this.block)
          if (captain.isEmpty) {
            this.onDelete(event)
          }
          break
      }
    },
    onKeydownText(event) {
      if (!this.isEditable) return

      switch (event.key) {
        case 'ArrowDown':
          this.onArrowDown(event)
          break
        case 'ArrowUp':
          $(this.$refs.amount as HTMLElement).trigger('focus')
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

      if (event.shiftKey) {
      } else {
        const captain = this.director.captainFor(this.block)
        this.director.onEnter({
          block: this.block, event, call: () => {
            captain.onEnter({ event })
            this.save()
            this.director.focusAfter(this.block)
          }
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
          block: this.block, event, call: () => {
            this.director.focusBefore(this.block)
            this.director.destroy(this.block, 'down')
            this.save()
          }
        })
      }
    },
    onDelete(event) {
      if (!this.isEditable) return

      const captain = this.director.captainFor(this.block)
      if (captain.isEmpty) {
        this.director.destroy(this.block, 'down')
        setTimeout(() => this.director.focusAfter(this.block), 50)
        this.save()
      }

    },
    save() {
      this.director.onSave()
    },
  },
  watch: {
    mode(newVal, oldVal) {
      if (newVal !== 'show') {
        this.setToggleState({ key: this.block.id, value: false })
      }
    }
  }
})
</script>
