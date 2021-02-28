<template>
  <article
    v-if="recipe"
    :key="recipe.clientId"
    class="recipe"
  >
    <header>
      <img v-bind="imageAttrs">
      <h1>{{ recipe.name }}</h1>

      <ul>
        <li v-if="recipe.cookTime">
          Cook Time: {{ $filters.duration(recipe.cookTime) }}
        </li>
      </ul>

      <ul class="categories">
        <li
          v-for="cat in recipe.categories"
          :key="cat.clientId"
        >
          {{ cat.name }}
        </li>
      </ul>
      <p v-if="recipe.description">
        {{ recipe.description }}
      </p>
    </header>
    <section>
      <h2>Ingredients</h2>
      <ul class="ingredients">
        <li
          v-for="ing in sortedIngredients"
          :key="ing.clientId"
          v-toggle-class="'strike-through'"
        >
          {{ ing.description }}
        </li>
      </ul>
    </section>
    <section>
      <h2>Directions</h2>
      <ol class="steps">
        <li
          v-for="step in sortedSteps"
          :key="step.clientId"
          v-toggle-class="'strike-through'"
        >
          <pre class="inline">{{ step.description }}</pre>
        </li>
      </ol>
    </section>
    <section>
      <h2>Notes</h2>
      <ul class="notes">
        <!--        <% split_lines(make_link(@recipe.note)).each do |note| %>-->
        <li>
          <pre>{{ recipe.note }}</pre>
        </li>
        <!--        <% end %>-->
      </ul>
    </section>
  </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { StoreModulePath } from '~/store'
import { RecipeActionTypes } from '~/store/modules/recipes/actions'
import Recipe from 'Models/recipe'
import { FlashActionTypes } from '~/store/modules/flash'
import { RouteName } from '~/router/routeName'
import Step from 'Models/step'
import Sorter from 'Models/concerns/sorter'
import Ingredient from 'Models/ingredient'
import ImagePlaceholder from 'Public/icons/image_placeholder.svg'
import { ImageSource } from 'Interfaces/imageInterfaces'

interface ImageAttrs {
  src: ImageSource
  alt?: string
  title?: string
  class?: string
}

export default defineComponent({
  name: 'Recipe',
  computed: {
    recipe(): Recipe | null {
      const r = Recipe.query().whereId(this.$router.currentRoute.value.params.clientId).with('steps|ingredients|categories').first()
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
          class: 'img-placeholder',
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
        this.$router.currentRoute.value.params.clientId,
      )
    } catch (e) {
      if (!this.recipe) {
        await this.$router.push({ name: RouteName.Home })
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, { flash: { alert: 'The specified recipe was not found.' } })
      }
    }
  },
})
</script>
