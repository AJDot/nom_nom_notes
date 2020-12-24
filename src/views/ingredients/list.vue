<template>
  <ul>
    <ingredients-list-item
      v-for="(ing, i) in ingredients"
      :key="ing.clientId"
      v-model:description="ing.description"
      :index="i"
      @context-menu="openContextMenu($event, ing)"
    />
    <row tag="li">
      <button
        class="btn"
        type="button"
        @click="addIngredient"
      >
        + Add Ingredient
      </button>
    </row>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Ingredient from 'Models/ingredient'
import { Destroyable, Sortable } from 'Interfaces/modelInterfaces'
import IngredientsListItem from 'Views/ingredients/listItem.vue'

export default defineComponent({
  name: 'IngredientsList',
  components: {
    IngredientsListItem,
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
  },
})
</script>
