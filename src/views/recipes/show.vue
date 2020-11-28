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

  <article v-if="recipe" class="recipe" :key="recipe.id">
    <header>
      <!--      <% if @recipe.image.url.present? %>-->
      <!--      <img src="<%= @recipe.image.url %>" alt="<%= @recipe.name %>" title="<%= @recipe.name %>" />-->
      <!--      <% else %>-->
      <!--      <img class="img-placeholder" src="/icons/image_placeholder.svg" alt='#' />-->
      <!--      <% end %>-->
      <h1>{{ recipe.name }}</h1>

      <ul>
        <li v-if="recipe.cook_interval">Cook Time: {{ recipe.cook_interval }}</li>
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
      <p v-if="recipe.description">{{ recipe.description }}</p>
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
        <!--        <% @recipe.steps.each do |step| %>-->
        <!--        <li><%= step.description %></li>-->
        <!--        <% end %>-->
      </ol>
    </section>
    <section>
      <h2>Notes</h2>
      <ul class="notes">
        <!--        <% split_lines(make_link(@recipe.note)).each do |note| %>-->
        <!--        <li><%== note %></li>-->
        <!--        <% end %>-->
      </ul>
    </section>
  </article>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { mapState, useStore } from 'vuex'
import { stateKey } from '~/store'
import router from '~/router'
import Recipe from 'Models/recipe'

export default defineComponent({
  name: "recipe",
  async beforeCreate() {
    const store = useStore(stateKey)
    await store.dispatch('recipes/fetch', router.currentRoute.value.params.id)
  },
  computed: {
    ...mapState('recipes', {recipes: 'all'}),
    recipe() {
      return (<any>this).recipes.find((x: Recipe) => x.id && x.id.toString() === this.$route.params.id)
    }
  }
})
</script>
