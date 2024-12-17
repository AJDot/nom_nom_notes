<template>
  <draggable
    :key="mode"
    :draggable="draggable && director.find(block.parentId)?.type !== 'text'"
    :droppable="droppableTest && director.find(block.parentId)?.type !== 'text'"
    class="relative basis-full rounded-md"
    :hover-color="hoverColor"
    :item="block"
    data-test-block="text"
    @drop="onDrop"
  >
    <div
      :key="block.id"
      ref="text"
      v-toggle-state="(key) => isShowMode ? toggleToggleState(key) : null"
      :placeholder="placeholder"
      data-focus
      :class="{ 'cursor-text': isEditable, 'cursor-pointer': !isEditable, 'line-through': toggleState[block.id], inline: childBlocks.length || director.find(block.parentId)?.type === 'text' }"
      :contenteditable="isEditable"
      class="inline-block w-full min-h-4 text-base outline-none border-2 border-transparent rounded-md break-anywhere after:text-gray-500 after:empty:content-[attr(placeholder)] focus:shadow-input focus:bg-gray-100"
      @input="onInput"
      @keydown="onKeydown"
      @click="onClick"
      v-html="block.content.text"
    />
    <base-block
      v-for="block in childBlocks"
      :key="block.id"
      class="contents items-start justify-start whitespace-pre-wrap transition-bg-shadow focus:bg-gray-100 focus:shadow-input"
      :block="block"
      :mode="mode"
      :director="director"
      :draggable="draggable"
      :droppable="droppable"
      :editable="editable"
    />
  </draggable>
</template>

<script lang="ts">
import Draggable from '@/modules/draggable/draggable.vue'
import { defineComponent } from 'vue'
import { mapActions, mapState } from 'vuex'
import { Block, TextBlock } from 'Interfaces/blockInterfacesGeneral'
import blockMixin from '~/mixins/blockMixin'
import preserveCaretMixin from '~/mixins/preserveCaretMixin'
import { StoreModulePath } from '~/store'
import { ChoiceActionTypes } from '~/store/modules/interfaces/modules/choice'
import { ToggleActionTypes } from '~/store/modules/interfaces/modules/toggle'

export default defineComponent({
  name: 'TextBlock',
  components: {
    Draggable,
  },
  mixins: [
    blockMixin<TextBlock>(),
    preserveCaretMixin((_key, comp) => comp.isEditable, 'text'),
  ],
  computed: {
    ...mapState(StoreModulePath.Interfaces + StoreModulePath.Toggle, { toggleState: 'state' }),
    ...mapState(StoreModulePath.Interfaces + StoreModulePath.Choice, { currentChoice: 'current' }),
    childBlocks(): Block[] {
      return this.director.childrenFor(this.block)
    },
    placeholder(): string {
      return this.isEditable ? this.director.find(this.block.id) ? "Type '/' for commands" : 'Type anything...' : ''
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
