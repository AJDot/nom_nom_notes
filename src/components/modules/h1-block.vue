<template>
  <draggable
    :draggable="draggable"
    :droppable="droppableTest"
    class="relative basis-full rounded-md"
    :hover-color="hoverColor"
    :item="block"
    data-test-block="h1"
    @drop="onDrop"
  >
    <h1
      ref="text"
      :placeholder="placeholder"
      class="basis-full text-3xl min-h-12 py-1 outline-none border-2 border-transparent break-anywhere focus:shadow-input focus:bg-gray-100 rounded-md after:text-gray-500 after:empty:content-[attr(placeholder)] sm:px-2"
      :class="{ 'cursor-text': isEditable, 'cursor-pointer': isChooseMode }"
      :contenteditable="isEditable"
      data-focus
      @input="onInput"
      @keydown="onKeydown"
      @click="onClick"
      v-html="block.content.text"
    />
  </draggable>
</template>

<script lang="ts">
import Draggable from '@/modules/draggable/draggable.vue'
import { defineComponent } from 'vue'
import { mapActions, mapState } from 'vuex'
import { H1Block } from '~/interfaces/blockInterfacesGeneral'
import blockMixin from '~/mixins/blockMixin'
import preserveCaretMixin from '~/mixins/preserveCaretMixin'
import { StoreModulePath } from '~/store'
import { ChoiceActionTypes } from '~/store/modules/interfaces/modules/choice'

export default defineComponent({
  name: 'H1Block',
  components: {
    Draggable,
  },
  mixins: [
    blockMixin<H1Block>(),
    preserveCaretMixin('text'),
  ],
  computed: {
    ...mapState(StoreModulePath.Interfaces + StoreModulePath.Choice, { currentChoice: 'current' }),
    placeholder(): string {
      return this.isEditable ? "Type '/' for commands" : ''
    },
  },
  methods: {
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
