<template>
  <article
    v-if="recipe"
    :key="recipe.clientId"
    class="mx-3"
  >
    <div class="max-w-screen-lg p-2.5 mx-auto mb-8 rounded-2xl shadow-card grid grid-cols-1">
      <header class="border-none grid sm:grid-cols-2 gap-4">
        <img
          v-bind="imageAttrs"
          class="object-contain max-h-[20rem] mx-auto sm:mx-0 sm:ml-auto rounded-2xl sm:order-2"
        >
        <div class="flex flex-col gap-2 sm:order-1">
          <h1 class="text-center text-3xl sm:text-left">
            {{ recipe.name }}
          </h1>
          <ul class="mb-2">
            <li v-if="recipe.cookTime">
              Cook Time: {{ $filters.duration(recipe.cookTime) }}
            </li>
          </ul>
          <ul class="text-xs mb-2">
            <template
              v-for="(tag, i) in recipe.tags"
              :key="tag.clientId"
            >
              <li class="inline-block font-bold">
                {{ tag.name }}
              </li>
              <span v-if="i < recipe.tags.length - 1"> | </span>
            </template>
          </ul>
          <p
            v-if="recipe.description"
            class="whitespace-pre-line"
          >
            {{ recipe.description }}
          </p>
        </div>
      </header>

      <section class="mt-5">
        <h2 class="text-2xl border-b border-gray-400">
          Ingredients
        </h2>
        <ul class="mt-2 columns-3xs">
          <li
            v-for="ing in sortedIngredients"
            :key="ing.clientId"
            v-toggle-state="ingredientsState"
            class="cursor-pointer hover:text-green hover:font-bold mb-2"
            :class="{ 'line-through': ingredientsState[ing.clientId] }"
          >
            {{ ing.description }}
          </li>
        </ul>
      </section>

      <div class="flex mt-5 gap-2">
        <SidePanel
          :state="ingredientsPanelState"
          class="bg-gray-900 border border-transparent rounded-lg content-start"
          @close="(ingredientsPanelState = false)"
        >
          <template #control>
            <button
              type="button"
              class="btn p-0 flex h-full text-white place-items-start"
              data-test="ingredients-panel-toggle"
              @click="toggleIngredientsPanel"
            >
              <span class="py-5 vertical-rl text-orient-upright sticky top-0">Ingredients</span>
            </button>
          </template>
          <section class="mb-5 mx-5">
            <h1 class="text-xl border-b border-gray-400">
              Ingredients
            </h1>
            <ul class="mt-4">
              <li
                v-for="ing in sortedIngredients"
                :key="ing.clientId"
                v-toggle-state="ingredientsState"
                class="cursor-pointer hover:text-green hover:font-bold mb-2"
                :class="{ 'line-through': ingredientsState[ing.clientId] }"
              >
                {{ ing.description }}
              </li>
            </ul>
          </section>
        </SidePanel>
        <section class="grow basis-96">
          <h2 class="text-2xl border-b border-gray-400">
            Directions
          </h2>
          <ol class="steps">
            <li
              v-for="step in sortedSteps"
              :key="step.clientId"
              v-toggle-class="'line-through'"
              class="mt-2.5 whitespace-pre-line cursor-pointer hover:text-green hover:font-bold"
            >
              {{ step.description }}
            </li>
          </ol>
        </section>
      </div>

      <section class="mt-5">
        <h2 class="text-2xl border-b border-gray-400">
          Notes
        </h2>
        <ul class="notes">
          <li class="mt-2.5 whitespace-pre-line">
            {{ recipe.note }}
          </li>
        </ul>
      </section>
    </div>
  </article>
</template>

<script lang="ts">
import Sorter from 'Models/concerns/sorter'
import Ingredient from 'Models/ingredient'
import Recipe from 'Models/recipe'
import Step from 'Models/step'
import { defineComponent, ImgHTMLAttributes } from 'vue'
import SidePanel from '~/components/structure/side-panel.vue'
import { RouteName } from '~/router/routeName'
import { StoreModulePath } from '~/store'
import { FlashActionTypes } from '~/store/modules/flash'
import { RecipeActionTypes } from '~/store/modules/recipes/actions'
import ImagePlaceholder from '/icons/image_placeholder.svg'

export default defineComponent({
  name: 'Recipe',
  components: {
    SidePanel,
  },
  data() {
    return {
      ingredientsPanelState: false,
      ingredientsState: {},
    }
  },
  computed: {
    recipe(): Recipe | null {
      return Recipe.query()
        .whereId(this.$router.currentRoute.value.params.clientId)
        .with('steps|ingredients|tags')
        .first()
    },
    sortedSteps(): Array<Step> {
      if (this.recipe) {
        return new Sorter().sort(this.recipe.steps)
      } else {
        return []
      }
    },
    sortedIngredients(): Array<Ingredient> {
      if (this.recipe) {
        return new Sorter().sort(this.recipe.ingredients)
      } else {
        return []
      }
    },
    imageAttrs(): ImgHTMLAttributes {
      if (this.recipe?.image.url) {
        return {
          src: this.recipe.image.url,
          alt: this.recipe.name,
          title: this.recipe.name,
        }
      } else {
        return {
          class: 'img-placeholder',
          src: ImagePlaceholder,
          alt: this.recipe?.name,
        }
      }
    },
  },
  async beforeCreate() {
    try {
      await this.$store.dispatch(StoreModulePath.Recipes + RecipeActionTypes.FIND_OR_FETCH, this.$router.currentRoute.value.params.clientId)
    } catch (e) {
      if (!this.recipe) {
        await this.$router.push({ name: RouteName.Home })
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { alert: 'The specified recipe was not found.' },
        })
      }
    }
  },
  methods: {
    toggleIngredientsPanel() {
      this.ingredientsPanelState = !this.ingredientsPanelState
    },
  },
})
</script>
