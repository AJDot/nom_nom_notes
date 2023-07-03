<template>
  <draggable
    tag="section"
    :draggable="draggable"
    :droppable="droppableTest"
    :item="block"
    :data-focusable="false"
    class="flex flex-col sm:flex-row basis-full gap-1 sm:gap-4 p-1 rounded-md"
    :hover-color="hoverColor"
    :class="{ 'cursor-pointer': isChooseMode }"
    data-test-block="row"
    @drop="onDrop"
    @click.self.stop="onClick"
  >
    <base-block-group
      v-if="childBlocks.length"
      :mode="mode"
      :blocks="childBlocks"
      :director="director"
      :draggable="draggable"
      :droppable="droppable"
      :editable="editable"
    />
    <div
      v-else
      class="flex grow cursor-pointer place-items-center rounded-md"
    >
      <button
        type="button"
        class="grow text-center text-gray-500 rounded-md outline-none hover:shadow-input hover:bg-gray-100 focus:shadow-input focus:bg-gray-100"
        @click="addColumn"
      >
        + Add Column
      </button>
      <button
        type="button"
        class="grow text-center text-gray-500 rounded-md outline-none hover:shadow-input hover:bg-gray-100 focus:shadow-input focus:bg-gray-100"
        @click="destroy"
      >
        - Remove Empty Row
      </button>
    </div>
  </draggable>
</template>

<script lang="ts">
import Draggable from '@/modules/draggable/draggable.vue'
import { defineComponent } from 'vue'
import { mapActions, mapState } from 'vuex'
import { Block, ColumnBlock, RowBlock } from 'Interfaces/blockInterfacesGeneral'
import blockMixin from '~/mixins/blockMixin'
import { StoreModulePath } from '~/store'
import { ChoiceActionTypes } from '~/store/modules/interfaces/modules/choice'
import Guid from '~/utils/guid'

export default defineComponent({
  name: 'RowBlock',
  components: {
    Draggable,
  },
  mixins: [
    blockMixin<RowBlock>(),
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
    addColumn(): void {
      const column: ColumnBlock = { id: Guid.create(), type: 'column' }
      this.director.onCreate({ block: column, inside: this.block })
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
