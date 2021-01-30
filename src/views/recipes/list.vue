<template>
  <div class="container">
    <aside class="filters">
      <row>
        <button
          class="filters-toggle btn-clear"
          type="button"
          @click="toggleShowFilters"
        >
          <i class="material-icons">filter_list</i>
        </button>
      </row>
      <row v-if="showFilters">
        <column>
          <h2>
            <label
              for="filter-category"
              class="lone"
            >
              Filter by Category
            </label>
          </h2>
        </column>
        <column class="grow-2">
          <search
            id="filter-category"
            :searcher="categoryFilterSearcher"
            @select="filterByCategory"
          />
        </column>
        <column>
          <button
            type="button"
            class="btn-clear"
            @click="clearCategoryFilter"
          >
            Clear
            <i class="material-icons">close</i>
          </button>
        </column>
      </row>
    </aside>
    <main>
      <ul class="card-list">
        <li
          v-for="recipe in recipesForList"
          :key="recipe.clientId"
          v-hover="pullDetails"
        >
          <article>
            <h1>{{ recipe.name }}</h1>
            <section>
              <img v-bind="imageAttrs(recipe)">
              <div
                class="content hidden-y"
              >
                <router-link
                  :to="{ name: $routerExtension.names.Recipe, params: { clientId: recipe.clientId } }"
                  class="view-recipe"
                >
                  <i class="material-icons">receipt</i>View Recipe
                </router-link>
                <ul class="categories">
                  <li
                    v-for="category in recipe.categories"
                    :key="category.clientId"
                  >
                    {{ category.name }}
                  </li>
                </ul>
                <p>{{ recipe.description }}</p>
              </div>
            </section>
          </article>
        </li>
      </ul>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { stateKey, StoreModulePath } from '~/store'
import Recipe, { RRecipe } from 'Models/recipe'
import { ArrayUtils } from '~/utils/arrayUtils'
import { RecipeActionTypes } from '~/store/modules/recipes/actions'
import ImagePlaceholder from 'Public/icons/image_placeholder.svg'
import { ImageSource } from 'Interfaces/imageInterfaces'
import Searcher from '~/utils/searcher'
import Category from 'Models/category'
import Search from '@/search.vue'
import { SearchResult } from 'Interfaces/searchInterfaces'

interface ImageAttrs {
  src: ImageSource
  alt?: string
  title?: string
  class?: string
}

export default defineComponent({
  name: 'RecipesIndex',
  components: {
    Search,
  },
  setup() {
    const store = useStore(stateKey)
    store.dispatch(StoreModulePath.Recipes + RecipeActionTypes.FETCH_ALL)
    const showFilters = ref(false)
    const recipeFilters = ref<{ categoryName: string | null }>({ categoryName: null })
    return {
      showFilters,
      recipeFilters,
    }
  },
  computed: {
    recipes(): Array<Recipe> {
      return Recipe.query().with('categories').get()
    },
    sortedRecipes(): Array<Recipe> {
      return ArrayUtils.sort(this.recipes, (a: Recipe, b: Recipe) => {
        const nameB = b.name && b.name.toLowerCase()
        const nameA = a.name && a.name.toLowerCase()
        if (!nameB) return 1
        if (!nameA) return -1
        if (nameA > nameB) return 1
        if (nameA < nameB) return -1
        return 0
      })
    },
    recipesForList(): Array<Recipe> {
      return this.sortedRecipes.filter(r => {
        const categoryName = this.recipeFilters.categoryName
        return !categoryName || r.categories.some(c => c.name === categoryName)
      })
    },
    categoryFilterSearcher(): Searcher<Category, string> {
      return new Searcher({
        label: 'name',
        value: 'name',
        valueString: 'name',
        collection: Category.all(),
      })
    },
  },
  methods: {
    imageAttrs(recipe: RRecipe): ImageAttrs {
      if (recipe.image.url) {
        return {
          src: recipe.image.url,
          alt: recipe.name,
          title: recipe.name,
        }
      } else {
        return {
          class: 'img-placeholder',
          src: ImagePlaceholder,
          alt: recipe.name,
        }
      }
    },
    toggleShowFilters(): void {
      this.showFilters = !this.showFilters
    },
    filterByCategory(result: { data: SearchResult<Category> }): void {
      this.recipeFilters.categoryName = result.data.value
    },
    clearCategoryFilter(): void {
      this.recipeFilters.categoryName = null
    },
    pullDetails(event: MouseEvent, hovering: boolean): void {
      const cssClass = 'hidden-y'
      const $el = $(event.currentTarget).find('.content')
      hovering ? $el.removeClass(cssClass) : $el.addClass(cssClass)
    },
  },
})
</script>
