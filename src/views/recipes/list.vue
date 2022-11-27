<template>
  <div class="px-5 pt-5 overflow-hidden">
    <aside class="mb-5">
      <button class="text-2xl btn-clear" type="button" @click="toggleShowFilters">
        <i class="material-icons">filter_list</i>
      </button>
      <template v-if="showFilters">
        <h2>
          <label for="filter-category" class="lone">
            Filter by Category
          </label>
        </h2>
        <div class="flex items-center gap-1">
          <search id="filter-category" :searcher="categoryFilterSearcher" @select="filterByCategory" />
          <button type="button" class="btn-clear flex" @click="clearCategoryFilter">
            Clear
            <i class="material-icons">close</i>
          </button>
        </div>
      </template>
    </aside>
    <main class="overflow-hidden after:block after:clear-both">
      <ul class="flex gap-2 flex-wrap mb-2 justify-center">
        <li v-for="recipe in recipesForList" :key="recipe.clientId" v-hover="pullDetails" class="w-72 shadow-md rounded-3xl">
          <article class="border border-gray-400 rounded-3xl overflow-hidden">
            <h1 class="text-xl text-center truncate p-2 bg-white" :title="recipe.name">{{ recipe.name }}</h1>
            <section class="h-72 overflow-hidden relative">
              <img v-bind="imageAttrs(recipe)" class="w-full h-full">
              <div class="-translate-y-full absolute top-0 w-full h-full overflow-y-auto transition-transform bg-black/70 text-white p-2" data-content>
                <router-link :to="{ name: $routerExtension.names.Recipe, params: { clientId: recipe.clientId } }" class="w-4/5 p-2.5 my-4 mx-auto text-white border-2 border-white text-sm text-center uppercase box-border transition-all hover:text-green hover:bg-white block">
                  <i class="material-icons my-auto align-middle mr-1">receipt</i><span class="align-middle">View Recipe</span>
                </router-link>
                <ul class="flex flex-wrap gap-1">
                  <li v-for="category in recipe.categories" :key="category.clientId" class="font-thin text-gray-400 text-xs">
                    {{ category.name }}
                  </li>
                </ul>
                <p class="mt-2 text-sm">{{ recipe.description }}</p>
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
          class: 'img-placeholder p-14',
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
      const cssClass = '-translate-y-full'
      const $el = $(event.currentTarget).find('[data-content]')
      hovering ? $el.removeClass(cssClass) : $el.addClass(cssClass)
    },
  },
})
</script>
