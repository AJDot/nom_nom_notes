<template>
  <draggable
    :key="mode"
    :draggable="draggable"
    :droppable="droppableTest"
    class="relative flex self-stretch rounded-md basis-0 shadow-input bg-gray-100"
    :hover-color="hoverColor"
    :item="block"
    data-test-block="sidebar"
    @drop="onDrop"
    @mouseenter="showControls"
    @mouseleave="hideControls"
  >
    <button
      v-if="isEditable && controlsVisible"
      type="button"
      class="absolute -top-2 -right-2"
      @click="openDropdown"
    >
      <i class="material-icons my-auto">edit</i>
    </button>
    <SidePanel
      :state="sidePanelState"
      class="flex self-stretch grow"
      @close="sidePanelState = false"
    >
      <template #control>
        <button
          ref="button"
          type="button"
          aria-disabled="true"
          class="flex grow self-stretch py-2 border-transparent rounded-md break-anywhere sm:px-1"
          @click.prevent="onSidebarClick"
        >
          <span
            ref="text"
            data-focus
            class="grow sticky top-0 outline-none after:text-gray-500 after:empty:content-[attr(placeholder)]"
            :class="[{ 'cursor-text': isEditable, 'cursor-pointer': !isEditable }, rotateStyle]"
            :placeholder="placeholder"
            :contenteditable="isEditable"
            @input="onInput"
            @keydown="onKeydown"
            @click="onClick"
            v-html="block.content.text"
          />
        </button>
      </template>
      <base-block
        v-if="contentBlock"
        :block="contentBlock"
        :director="director"
        mode="show"
      />
    </SidePanel>
    <dropdown
      :state="editDropdownState"
      position-type="mouse"
      :open-event="dropdownOpenEvent"
      @close="closeDropdown"
    >
      <section class="w-96 max-h-72 p-2">
        <dl class="mt-2 mb-4 sm:col-span-2">
          <dt class="text-lg border-b border-gray-400 mb-2">
            <h1 class="text-2xl m-2">
              Panel Block
            </h1>
            <p class="m-2 text-gray-500">
              Choose block to display in side panel
            </p>
          </dt>
          <dd>
            <button
              type="button"
              class="btn w-full"
              @click="enterChooseBlockMode"
            >
              Choose Display Block
            </button>
          </dd>
        </dl>
      </section>
    </dropdown>
  </draggable>
</template>

<script lang="ts">
import Draggable from '@/modules/draggable/draggable.vue'
import { defineComponent } from 'vue'
import { mapActions, mapState } from 'vuex'
import { Block, SidebarBlock } from 'Interfaces/blockInterfacesGeneral'
import blockMixin from '~/mixins/blockMixin'
import preserveCaretMixin from '~/mixins/preserveCaretMixin'
import { StoreModulePath } from '~/store'
import { ChoiceActionTypes } from '~/store/modules/interfaces/modules/choice'
import SidePanel from '../structure/side-panel.vue'

export default defineComponent({
  name: 'SidebarBlock',
  components: {
    Draggable,
    SidePanel,
  },
  mixins: [
    blockMixin<SidebarBlock>(),
    preserveCaretMixin((_key, comp) => comp.isEditable, 'text'),
  ],
  data() {
    return {
      sidePanelState: false,
      editDropdownState: false,
      dropdownOpenEvent: null,
      controlsVisible: false,
    }
  },
  computed: {
    ...mapState(StoreModulePath.Interfaces + StoreModulePath.Choice, { currentChoice: 'current' }),
    placeholder(): string {
      return 'Sidebar'
    },
    rotateStyle() {
      if (this.director.find(this.block.parentId)?.type === 'row') {
        return 'sm:vertical-rl sm:rotate-180 sm:py-5'
      } else {
        return ''
      }
    },
    contentBlock(): Block | null {
      if (!this.block.content.blockId) return null

      return this.director.find(this.block.content.blockId)
    },
  },
  methods: {
    ...mapActions('interfaces/choice', { setChoiceState: ChoiceActionTypes.SET, unsetCurrentChoice: ChoiceActionTypes.UNSET }),
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
    onSidebarClick() {
      if (this.isShowMode) {
        this.sidePanelState = !this.sidePanelState
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
    async openDropdown(event) {
      this.editDropdownState = !this.editDropdownState
      this.dropdownOpenEvent = event
    },
    closeDropdown() {
      this.editDropdownState = false
    },
    enterChooseBlockMode() {
      this.setChoiceState({ type: 'block', args: [this.block] })
      this.closeDropdown()
    },
    showControls() {
      this.controlsVisible = true
    },
    hideControls() {
      this.controlsVisible = false
    },
  },
})
</script>
