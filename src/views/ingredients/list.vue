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
    <template #item="{ element: ing, index }">
      <ingredients-list-item
        :key="ing.clientId"
        v-model:description="ing.description"
        :index="index"
        :data-test="`ingredient-${index}`"
        :first="isFirst(ing)"
        :last="isLast(ing)"
        @move:up="moveUp(ing)"
        @move:down="moveDown(ing)"
        @destroy="destroy(ing)"
      />
    </template>
    <template #footer>
      <li
        key="add"
        class="mt-2"
      >
        <button
          class="btn"
          type="button"
          @click="addIngredient"
        >
          + Add Ingredient
        </button>
      </li>
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
    add: null,
  },
  methods: {
    async addIngredient() {
      this.$emit('add')
    },
    sort(event) {
      new Sorter().reorder<Ingredient>(this.ingredients, event.oldIndex, event.newIndex)
    },
    isFirst(ingredient: Sortable) {
      return new Sorter().isFirst(this.ingredients, ingredient)
    },
    isLast(ingredient: Sortable) {
      return new Sorter().isLast(this.ingredients, ingredient)
    },
    moveUp(ingredient: Sortable) {
      return new Sorter().moveUp(this.ingredients, ingredient)
    },
    moveDown(ingredient: Sortable) {
      return new Sorter().moveDown(this.ingredients, ingredient)
    },
    destroy(ingredient: Destroyable) {
      ingredient.markForDestruction()
    },
  },
})
</script>
