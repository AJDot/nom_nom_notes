<template>
  <!--  <% content_for :header_links do %>-->
  <!--  <ul>-->
  <!--    <li>-->
  <!--      <a href="/">-->
  <!--        <i class="material-icons wiggle">view_comfy</i>-->
  <!--        <span class="safe">Recipe Cards</span>-->
  <!--      </a>-->
  <!--    </li>-->
  <!--    <% if current_user? %>-->
  <!--    <li>-->
  <!--      <a href="/recipe/<%= @recipe_id %>/edit">-->
  <!--        <i class="material-icons wiggle">edit</i>-->
  <!--        <span class="safe">Edit Recipe</span>-->
  <!--      </a>-->
  <!--    </li>-->
  <!--    <% end %>-->
  <!--  </ul>-->
  <!--  <% end %>-->

  <article
    v-if="recipe"
    :key="recipe.clientId"
    class="recipe"
  >
    <header>
      <!--      <% if @recipe.image.url.present? %>-->
      <!--      <img src="<%= @recipe.image.url %>" alt="<%= @recipe.name %>" title="<%= @recipe.name %>" />-->
      <!--      <% else %>-->
      <!--      <img class="img-placeholder" src="/icons/image_placeholder.svg" alt='#' />-->
      <!--      <% end %>-->
      <h1>{{ recipe.name }}</h1>

      <ul>
        <li v-if="recipe.cookTime">
          Cook Time: {{ $filters.duration(recipe.cookTime) }}
        </li>
      </ul>

      <ul class="ethnicities">
        <!--        <% @recipe.ethnicities.each do |eth| %>-->
        <!--        <li><%= eth.name %></li>-->
        <!--        <% end %>-->
      </ul>
      <ul class="categories">
        <!--        <% @recipe.categories.each do |cat| %>-->
        <!--        <li><%= cat.name %></li>-->
        <!--        <% end %>-->
      </ul>
      <p v-if="recipe.description">
        {{ recipe.description }}
      </p>
    </header>
    <section>
      <h2>Ingredients</h2>
      <ul class="ingredients">
        <!--        <% @recipe.ingredients.each do |ing| %>-->
        <!--        <li><%= ing.description %></li>-->
        <!--        <% end %>-->
      </ul>
    </section>
    <section>
      <h2>Directions</h2>
      <ol class="steps">
        <li
          v-for="step in recipe.steps"
          :key="step.clientId"
        >
          {{ step.description }}
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
import { computed, defineComponent } from 'vue'
import { StoreModulePath } from '~/store'
import { RecipeActionTypes } from '~/store/modules/recipes/actions'
import Recipe from 'Models/recipe'
import { FlashActionTypes } from '~/store/modules/flash'
import { RouteName } from '~/router/routeName'

export default defineComponent({
  name: 'Recipe',
  data() {
    return {
      recipe: computed(() => {
        return Recipe.query().whereId(this.$router.currentRoute.value.params.clientId).with('steps').first()
      }),
    }
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
