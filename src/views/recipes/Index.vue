<template>
  <div class="container">
    <aside class="filters">
      <a class="drawer_toggle" href="#"><i class="material-icons">filter_list</i></a>
      <form class="grid padded" action="#" method="get">
        <h2><label for="filterCategorySelect">Filter by Category</label></h2>
        <select class="grid grid-1-1 padded" name="filterCategorySelect" id="filterCategorySelect">
        </select>
      </form>
    </aside>
    <main>
      <ul class="card-list">
        <!--        <% sort_by_name(@recipes).each do |recipe| %>-->
        <li v-for="recipe in recipes">
          <article>
            <h1>{{ recipe.name }}</h1>
            <section>
              <!--              <% if recipe.image.url.present? %>-->
              <!--              <img src="<%= recipe.image.url %>" alt="<%= recipe.name %>" />-->
              <!--              <% else %>-->
              <!--              <img class="img-placeholder" src="../icons/image_placeholder.svg" alt='#' />-->
              <!--              <% end %>-->
              <div class="content">
                <a class="view-recipe" href="/recipe/<%= recipe.id %>"><i class="material-icons">receipt</i>View Recipe</a>
                <ul class="categories">
                  <li v-for="category in recipe.categories">
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
import { defineComponent } from "vue"

export default defineComponent({
  name: "recipes-index",
  data () {
    return {
      recipes: [],
    }
  },
  created () {
    $.ajax({
      url: 'http://localhost:3000/v1/recipes',
      method: 'get',
    }).then(response => {
      this.recipes = response
    })
  },
})
</script>
