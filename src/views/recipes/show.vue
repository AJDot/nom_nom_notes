<template>
  <article v-if="recipe" :key="recipe.clientId" class="max-w-screen-lg p-2.5 mx-auto mb-8 rounded-2xl shadow-card grid grid-cols-1">
    <header class="border-none grid grid-cols-2 gap-4 after:clear-both">
      <div class="grid grid-cols-1 content-start">
        <h1 class="text-3xl">{{ recipe.name }}</h1>
        <ul class="mb-2">
          <li v-if="recipe.cookTime">
            Cook Time: {{ $filters.duration(recipe.cookTime) }}
          </li>
        </ul>
        <ul class="text-xs mb-2">
          <template v-for="(cat, i) in recipe.categories" :key="cat.clientId">
            <li class="inline-block font-bold">
              {{ cat.name }}
            </li>
            <span v-if="i < recipe.categories.length - 1"> | </span>
          </template>
        </ul>
        <p v-if="recipe.description" class="whitespace-pre-line">
          {{ recipe.description }}
        </p>
      </div>
      <img v-bind="imageAttrs" class="max-h-[20rem] ml-auto rounded-2xl" />
    </header>

    <section class="mt-5">
      <h2 class="text-2xl border-b border-gray-400">Ingredients</h2>
      <ul class="mt-2 columns-3xs">
        <li v-for="ing in sortedIngredients" :key="ing.clientId" v-toggle-class="'line-through'" class="cursor-pointer hover:text-green hover:font-bold mb-2">
          {{ ing.description }}
        </li>
      </ul>
    </section>
    <section class="mt-5">
      <h2 class="text-2xl border-b border-gray-400">Directions</h2>
      <ol class="steps">
        <li v-for="step in sortedSteps" :key="step.clientId" v-toggle-class="'line-through'" class="mt-2.5 whitespace-pre-line cursor-pointer hover:text-green hover:font-bold">
          {{ step.description }}
        </li>
      </ol>
    </section>
    <section class="mt-5">
      <h2 class="text-2xl border-b border-gray-400">Notes</h2>
      <ul class="notes">
        <li class="mt-2.5 whitespace-pre-line">
          {{ recipe.note }}
        </li>
      </ul>
    </section>
  </article>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { StoreModulePath } from "~/store"
import { RecipeActionTypes } from "~/store/modules/recipes/actions"
import Recipe from "Models/recipe"
import { FlashActionTypes } from "~/store/modules/flash"
import { RouteName } from "~/router/routeName"
import Step from "Models/step"
import Sorter from "Models/concerns/sorter"
import Ingredient from "Models/ingredient"
import ImagePlaceholder from "Public/icons/image_placeholder.svg"
import { ImageSource } from "Interfaces/imageInterfaces"

interface ImageAttrs {
  src: ImageSource
  alt?: string
  title?: string
  class?: string
}

export default defineComponent({
  name: "Recipe",
  computed: {
    recipe(): Recipe | null {
      const r = Recipe.query()
        .whereId(this.$router.currentRoute.value.params.clientId)
        .with("steps|ingredients|categories")
        .first()
      return r
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
    imageAttrs(): ImageAttrs {
      if (this.recipe?.image.url) {
        return {
          src: this.recipe.image.url,
          alt: this.recipe.name,
          title: this.recipe.name,
        }
      } else {
        return {
          class: "img-placeholder",
          src: ImagePlaceholder,
          alt: this.recipe?.name,
        }
      }
    },
  },
  async beforeCreate() {
    try {
      await this.$store.dispatch(
        StoreModulePath.Recipes + RecipeActionTypes.FIND_OR_FETCH,
        this.$router.currentRoute.value.params.clientId
      )
    } catch (e) {
      if (!this.recipe) {
        await this.$router.push({ name: RouteName.Home })
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { alert: "The specified recipe was not found." },
        })
      }
    }
  },
})
</script>
