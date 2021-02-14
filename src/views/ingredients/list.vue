<template>
  <draggable
    tag="transition-group"
    :component-data="{ tag: 'ul', name: 'flip-list', type: 'transition' }"
    :list="ingredients"
    item-key="clientId"
    ghost-class="ghost"
    handle=".handle"
    @end="sort"
  >
    <template #item="{element: ing, index}">
      <ingredients-list-item
        :key="ing.clientId"
        v-model:description="ing.description"
        :index="index"
        :data-test="`ingredient-${index}`"
        @context-menu="openContextMenu($event, ing)"
      />
    </template>
    <template #footer>
      <row
        key="add"
        tag="li"
      >
        <button
          class="btn"
          type="button"
          @click="addIngredient"
        >
          + Add Ingredient
        </button>
      </row>
    </template>
  </draggable>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Ingredient from 'Models/ingredient'
import { Destroyable, Sortable } from 'Interfaces/modelInterfaces'
import IngredientsListItem from 'Views/ingredients/listItem.vue'
import Sorter from 'Models/concerns/sorter'
import draggable from 'vuedraggable'

export default defineComponent({
  name: 'IngredientsList',
  components: {
    IngredientsListItem,
    draggable,
  },
  props: {
    ingredients: {
      type: Object as () => Array<Ingredient>,
      required: true,
    },
  },
  emits: {
    'context-menu': null,
    add: null,
  },
  methods: {
    async addIngredient() {
      this.$emit('add')
    },
    openContextMenu(event: MouseEvent, item: Sortable & Destroyable) {
      this.$emit('context-menu', {
        event,
        item,
      })
    },
    sort(event) {
      new Sorter().reorder<Ingredient>(this.ingredients, event.oldIndex, event.newIndex)
    },
  },
})
</script>
