<template>
  <draggable tag="section" :draggable="draggable" :droppable="droppableTest" :item="block" @drop="onDrop" :data-focusable="false" class="flex flex-col gap-1 sm:gap-x-4 sm:gap-y-2 grow basis-0 py-1 rounded-md" :class="{ 'cursor-pointer': isChooseMode }" :hover-color="hoverColor" @click.self.stop="onClick" data-test-block="column">
    <base-block-group v-if="childBlocks.length" :mode="mode" :blocks="childBlocks" :director="director" :draggable="draggable" :droppable="droppable" :editable="editable" />
    <div v-else-if="isEditable" class="flex grow cursor-pointer place-items-center rounded-md">
      <button type="button" @click="addText" class="grow text-center text-gray-500 rounded-md outline-none hover:shadow-input hover:bg-gray-100 focus:shadow-input focus:bg-gray-100">
        + Add Item
      </button>
      <button type="button" @click="destroy" class="grow text-center text-gray-500 rounded-md outline-none hover:shadow-input hover:bg-gray-100 focus:shadow-input focus:bg-gray-100">
        - Remove Empty Column
      </button>
    </div>
  </draggable>
</template>

<script lang="ts">
import Draggable from '@/modules/draggable/draggable.vue'
import { defineComponent } from 'vue'
import { mapActions, mapState } from 'vuex'
import { Block, ColumnBlock, TextBlock } from '~/interfaces/blockInterfacesGeneral'
import blockMixin from '~/mixins/blockMixin'
import { StoreModulePath } from '~/store'
import { ChoiceActionTypes } from '~/store/modules/interfaces/modules/choice'
import Guid from '~/utils/guid'

export default defineComponent({
  name: 'ColumnBlock',
  components: {
    Draggable
  },
  mixins: [
    blockMixin<ColumnBlock>(),
  ],
  computed: {
    ...mapState(StoreModulePath.Interfaces + StoreModulePath.Choice, { currentChoice: 'current' }),
    childBlocks(): Block[] {
      return this.director.childrenFor(this.block)
    },
  },
  methods: {
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
    addText(): void {
      const text: TextBlock = { id: Guid.create(), type: 'text', content: { text: '' } }
      this.director.onCreate({ block: text, inside: this.block })
      this.save()
    },
    destroy(): void {
      this.director.destroy(this.block, 'down')
      this.save()
    },
    save() {
      this.director.onSave()
    },
  },
})
</script>
