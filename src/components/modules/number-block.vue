<template>
  <draggable
    :key="mode"
    :draggable="draggable"
    :droppable="droppableTest"
    class="relative basis-full rounded-md"
    :hover-color="hoverColor"
    :item="block"
    data-test-block="number"
    @drop="onDrop"
  >
    <div
      :key="block.id"
      ref="text"
      v-toggle-state="(key) => isShowMode ? toggleToggleState(key) : null"
      :placeholder="placeholder"
      data-focus
      :class="{ 'cursor-text': isEditable, 'cursor-pointer': !isEditable, 'line-through': toggleState[block.id] }"
      :contenteditable="isEditable"
      class="inline-block text-base max-w-full min-h-4 pl-1 py-1 font-semibold text-gray-800 dark:text-gray-100 dark:border-gray-500 outline-none border-transparent rounded-md break-anywhere focus:shadow-input focus:bg-gray-100 after:text-gray-500 after:empty:content-[attr(placeholder)]"
      @input="onInput"
      @keydown="onKeydown"
      @click="onClick"
      v-html="textDisplay"
    />
  </draggable>
</template>

<script lang="ts">
import Draggable from '@/modules/draggable/draggable.vue'
import { defineComponent } from 'vue'
import { NumberBlock } from 'Interfaces/blockInterfacesGeneral'
import blockMixin from '~/mixins/blockMixin'
import { mapActions, mapState } from 'vuex'
import { StoreModulePath } from '~/store'
import { ChoiceActionTypes } from '~/store/modules/interfaces/modules/choice'
import { ToggleActionTypes } from '~/store/modules/interfaces/modules/toggle'
import preserveCaretMixin from '~/mixins/preserveCaretMixin'
import math from '~/utils/math'
import { Unit } from 'mathjs'

export default defineComponent({
  name: 'NumberBlock',
  components: {
    Draggable,
  },
  mixins: [
    blockMixin<NumberBlock>(),
    preserveCaretMixin((_key, comp) => comp.isEditable, 'text'),
  ],
  data() {
    return {
      placeholder: '12.34',
    }
  },
  computed: {
    ...mapState(StoreModulePath.Interfaces + StoreModulePath.Toggle, { toggleState: 'state' }),
    ...mapState(StoreModulePath.Interfaces + StoreModulePath.Choice, { currentChoice: 'current' }),
    ...mapState(StoreModulePath.Scale, { scale: 'scale' }),
    canScale(): boolean {
      return (this.isShowMode || this.isShoppingListMode) && this.scale !== '1'
    },
    textDisplay(): string {
      if (this.canScale) {
        const unit = math.parseUnit(this.block.content.text || '1', { unitFallback: 'scale' })
        const unitScaled = unit.multiply(math.toNumber(this.scale) as unknown as Unit)
        return math.format(unitScaled, { unitTypeLess: math.isMadeUp(unitScaled) })
      } else {
        return this.block.content.text
      }
    },
  },
  watch: {
  },
  methods: {
    ...mapActions('interfaces/toggle', { setToggleState: ToggleActionTypes.SET, toggleToggleState: ToggleActionTypes.TOGGLE }),
    ...mapActions(StoreModulePath.Interfaces + StoreModulePath.Choice, { unsetCurrentChoice: ChoiceActionTypes.UNSET }),
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
    onInput(event) {
      if (!this.isEditable) return
      const captain = this.director.captainFor(this.block)
      this.director.onInput({
        block: this.block,
        event,
        call: () => {
          captain.onInput({ event })
          this.save()
        },
      })
    },
    onKeydown(event) {
      if (!this.isEditable) return

      switch (event.key) {
        case 'ArrowDown':
          this.onArrowDown(event)
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
    async onDelete(_event) {
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
  },
})
</script>
