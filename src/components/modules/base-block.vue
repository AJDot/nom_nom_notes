<template>
  <component
    :is="componentMap[block.type]"
    class="items-start w-full justify-start whitespace-pre-wrap transition-bg-shadow focus:bg-gray-100 focus:shadow-input"
    :mode="mode"
    :data-id="block.id"
    :block="block"
    :director="director"
    :draggable="draggable"
    :droppable="droppable"
    :editable="editable"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { UBlockDirector } from 'Interfaces/blockInterfaces'
import { Block } from 'Interfaces/blockInterfacesGeneral'
import draggableMixin from '~/mixins/draggableMixin'
import ColumnBlock from './column-block.vue'
import H1Block from './h1-block.vue'
import H2Block from './h2-block.vue'
import H3Block from './h3-block.vue'
import ImageBlock from './image-block.vue'
import IngredientBlock from './ingredient-block.vue'
import RowBlock from './row-block.vue'
import SidebarBlock from './sidebar-block.vue'
import TextBlock from './text-block.vue'

interface Data {
  componentMap: Record<Block['type'], string>
}

export default defineComponent({
  name: 'BaseBlock',
  components: {
    H1Block,
    H2Block,
    H3Block,
    TextBlock,
    RowBlock,
    ColumnBlock,
    SidebarBlock,
    ImageBlock,
    IngredientBlock,
  },
  mixins: [
    draggableMixin,
  ],
  props: {
    block: {
      type: Object as () => Block,
      required: true,
    },
    director: {
      type: Object as () => UBlockDirector,
      required: true,
    },
    mode: {
      type: String,
      default: 'show',
      validator: prop => typeof prop === 'string' && ['create', 'show', 'edit', 'choose', 'shopping'].includes(prop),
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  data(): Data {
    return {
      componentMap: {
        h1: 'h1-block',
        h2: 'h2-block',
        h3: 'h3-block',
        text: 'text-block',
        row: 'row-block',
        column: 'column-block',
        sidebar: 'sidebar-block',
        image: 'image-block',
        ingredient: 'ingredient-block',
      },
    }
  },
})
</script>
