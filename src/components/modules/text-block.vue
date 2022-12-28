<template>
  <draggable :key="mode" :draggable="draggable" :droppable="droppableTest" class="relative basis-full rounded-md" :hover-color="hoverColor" :item="block" :list-id="block.parentId ?? ''" @drop="onDrop">
    <div :key="block.id" :placeholder="placeholder" data-focus class="text-base min-h-9 px-2 py-1 outline-none border-2 border-transparent rounded-md break-anywhere focus:shadow-input focus:bg-gray-100 after:text-gray-500 after:empty:content-[attr(placeholder)]" :class="{ 'cursor-text': isEditable, 'cursor-pointer': !isEditable, 'line-through': toggleState[block.id] }" :contenteditable="isEditable" v-html="block.content.text" ref="content" v-toggle-state="(key) => isShowMode ? toggleToggleState(key) : null" v-on="blockListeners"></div>
  </draggable>
</template>

<script lang="ts">
import Draggable from '@/modules/draggable/draggable.vue'
import { defineComponent } from 'vue'
import { mapActions, mapState } from 'vuex'
import { TextBlock } from '~/interfaces/blockInterfaces'
import blockListeners from '~/mixins/blockListeners'
import blockMixin from '~/mixins/blockMixin'
import preserveCaretMixin from '~/mixins/preserveCaretMixin'
import { StoreModulePath } from '~/store'
import { ToggleActionTypes } from '~/store/modules/interfaces/modules/toggle'

export default defineComponent({
  name: "TextBlock",
  components: {
    Draggable
  },
  mixins: [
    blockMixin<TextBlock>(),
    blockListeners,
    preserveCaretMixin,
  ],
  computed: {
    ...mapState(StoreModulePath.Interfaces + StoreModulePath.Toggle, { toggleState: 'state' }),
    placeholder(): string {
      return this.isEditable ? this.director.find(this.block.id) ? "Type '/' for commands" : "Type anything..." : ''
    },
  },
  methods: {
    ...mapActions('interfaces/toggle', { setToggleState: ToggleActionTypes.SET, toggleToggleState: ToggleActionTypes.TOGGLE }),
    onDrop(payload) {
      const { dragItemId: moveBlockId, dropItemId: toBlockId } = payload
      this.director.onDrop({ moveBlockId, toBlockId })
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
