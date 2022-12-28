<template>
  <draggable :key="mode" :draggable="draggable" :droppable="droppableTest" class="relative flex self-stretch rounded-md basis-0 shadow-input bg-gray-100 group" :hover-color="hoverColor" :item="block" :list-id="block.parentId ?? ''" @drop="onDrop">
    <button v-if="isEditable" @click="openDropdown" type="button" class="hidden group-hover:inline absolute -top-2 -right-2">
      <i class="material-icons my-auto">edit</i>
    </button>
    <SidePanel :state="sidePanelState" @close="sidePanelState = false" class="flex self-stretch grow">
      <template #control>
        <button type="button" aria-disabled="true" class="flex grow self-stretch px-1 py-2 border-transparent rounded-md break-anywhere" @click.prevent="onSidebarClick" ref="button">
          <span data-focus class="grow sticky top-0 outline-none after:text-gray-500 after:empty:content-[attr(placeholder)]" :class="[{ 'cursor-text': isEditable, 'cursor-pointer': !isEditable }, rotateStyle]" :placeholder="placeholder" :contenteditable="isEditable" v-html="block.content.text" ref="content" v-on="blockListeners"></span>
        </button>
      </template>
      <base-block v-if="contentBlock" :block="contentBlock" :director="director" mode="show" />
    </SidePanel>
    <dropdown :state="editDropdownState" @close="closeDropdown" position-type="mouse" :open-event="dropdownOpenEvent">
      <section class="w-96 max-h-72 p-2">
        <dl class="mt-2 mb-4 sm:col-span-2">
          <dt class="text-lg border-b border-gray-400 mb-2">
            <h1 class="text-2xl m-2">Panel Block</h1>
            <p class="m-2 text-gray-500">Choose block to display in side panel</p>
          </dt>
          <dd>
            <button type="button" @click="enterChooseBlockMode" class="btn w-full">Choose Display Block</button>
          </dd>
        </dl>
      </section>
    </dropdown>
  </draggable>
</template>

<script lang="ts">
import Draggable from '@/modules/draggable/draggable.vue'
import { defineComponent } from 'vue'
import { mapActions } from 'vuex'
import { Block, SidebarBlock } from '~/interfaces/blockInterfaces'
import blockListeners from '~/mixins/blockListeners'
import blockMixin from '~/mixins/blockMixin'
import preserveCaretMixin from '~/mixins/preserveCaretMixin'
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
    blockListeners,
    preserveCaretMixin,
  ],
  data() {
    return {
      sidePanelState: false,
      editDropdownState: false,
      dropdownOpenEvent: null,
    }
  },
  computed: {
    placeholder(): string {
      return "Sidebar"
    },
    rotateStyle() {
      if (this.director.find(this.block.parentId)?.type === 'row') {
        return 'vertical-rl rotate-180 py-5'
      } else {
        return ''
      }
    },
    contentBlock(): Block | null {
      if (!this.block.content.blockId) return null

      return this.director.find(this.block.content.blockId)
    }
  },
  methods: {
    ...mapActions('interfaces/choice', { setChoiceState: ChoiceActionTypes.SET }),
    onDrop(payload) {
      const { dragItemId: moveBlockId, dropItemId: toBlockId } = payload
      this.director.onDrop({ moveBlockId, toBlockId })
    },
    onSidebarClick() {
      if (this.isShowMode) {
        this.sidePanelState = !this.sidePanelState
      }
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
  },
})
</script>
