<template>
  <div class="px-5 pt-5 overflow-hidden">
    <aside class="mb-5">
      <button
        class="text-2xl btn-clear"
        type="button"
        data-test="filters-toggle"
        @click="toggleShowFilters"
      >
        <i class="material-icons">filter_list</i>
      </button>
      <template v-if="showFilters">
        <h2>
          <label for="filter-tag">
            Filter by Tag
          </label>
        </h2>
        <div class="flex items-center gap-1">
          <search
            id="filter-tag"
            class="grow"
            :searcher="tagFilterSearcher"
            @select="filterByTag"
          />
          <button
            type="button"
            class="btn-clear flex"
            @click="clearTagFilter"
          >
            Clear
            <i class="material-icons">close</i>
          </button>
        </div>
      </template>
    </aside>
    <main class="overflow-hidden after:block after:clear-both">
      <ul
        class="flex gap-2 flex-wrap mb-2 justify-center"
        data-test="card-list"
      >
        <li
          v-for="recipe in recipesForList"
          :key="recipe.clientId"
          v-hover="pullDetails"
          class="w-72 shadow-md rounded-3xl"
          data-test="card-list-item"
        >
          <article class="border border-gray-400 rounded-3xl overflow-hidden">
            <h1
              class="text-xl text-center truncate p-2 bg-white"
              :title="recipe.name"
            >
              {{ recipe.name }}
            </h1>
            <section class="h-72 overflow-hidden relative">
              <img
                v-bind="imageAttrs(recipe)"
                class="w-full h-full object-cover"
              >
              <div
                class="-translate-y-full absolute top-0 w-full h-full overflow-y-auto transition-transform bg-black/70 text-white p-2"
                data-content
              >
                <router-link
                  :to="{ name: $routerExtension.names.Recipe, params: { clientId: recipe.clientId } }"
                  class="w-4/5 p-2.5 my-4 mx-auto text-white border-2 border-white text-sm text-center uppercase box-border transition-all hover:text-green hover:bg-white block"
                >
                  <i class="material-icons my-auto align-middle mr-1">receipt</i><span class="align-middle">View Recipe</span>
                </router-link>
                <ul class="flex flex-wrap gap-1">
                  <li
                    v-for="tag in recipe.tags"
                    :key="tag.clientId"
                    class="font-thin text-gray-400 text-xs"
                  >
                    {{ tag.name }}
                  </li>
                </ul>
                <p class="mt-2 text-sm">
                  {{ recipe.description }}
                </p>
              </div>
            </section>
          </article>
        </li>
      </ul>
    </main>
  </div>
</template>

<script lang="ts">
import Search from '@/structure/search.vue'
import { SearchResult } from 'Interfaces/searchInterfaces'
import Recipe, { RRecipe } from 'Models/recipe'
import { defineComponent, ImgHTMLAttributes, ref } from 'vue'
import { useStore } from 'vuex'
import Tag from '~/models/tag'
import { stateKey, StoreModulePath } from '~/store'
import { RecipeActionTypes } from '~/store/modules/recipes/actions'
import { ArrayUtils } from '~/utils/arrayUtils'
import Searcher from '~/utils/searcher'
import ImagePlaceholder from '/icons/image_placeholder.svg'

export default defineComponent({
  name: 'RecipesIndex',
  components: {
    Search,
  },
  setup() {
    const store = useStore(stateKey)
    store.dispatch(StoreModulePath.Recipes + RecipeActionTypes.FETCH_ALL)
    const showFilters = ref(false)
    const recipeFilters = ref<{ tagName: string | null }>({ tagName: null })
    return {
      showFilters,
      recipeFilters,
    }
  },
  computed: {
    recipes(): Array<Recipe> {
      return Recipe.query().with('tags').get()
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
        const tagName = this.recipeFilters.tagName
        return !tagName || r.tags.some(tag => tag.name === tagName)
      })
    },
    tagFilterSearcher(): Searcher<Tag> {
      return new Searcher({
        type: 'result',
        label: 'name',
        valueString: 'name',
        collection: Tag.all(),
        matcher(item, q) {
          return Boolean(item.name.toLocaleLowerCase().match(q.toLocaleLowerCase()))
        },
      })
    },
  },
  methods: {
    imageAttrs(recipe: RRecipe): ImgHTMLAttributes {
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
    filterByTag(result: { data: SearchResult<Tag> }): void {
      this.recipeFilters.tagName = result.data.value
    },
    clearTagFilter(): void {
      this.recipeFilters.tagName = null
    },
    pullDetails(event: MouseEvent, hovering: boolean): void {
      const cssClass = '-translate-y-full'
      const $el = $(event.currentTarget as HTMLElement).find('[data-content]')
      hovering ? $el.removeClass(cssClass) : $el.addClass(cssClass)
    },
  },
})
</script>
