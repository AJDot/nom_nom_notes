<template>
  <div class="container">
    <aside class="filters">
      <a
        class="drawer_toggle"
        href="#"
      ><i class="material-icons">filter_list</i></a>
      <form
        class="grid padded"
        action="#"
        method="get"
      >
        <h2><label for="filterCategorySelect">Filter by Category</label></h2>
        <select
          id="filterCategorySelect"
          class="grid grid-1-1 padded"
          name="filterCategorySelect"
        />
      </form>
    </aside>
    <main>
      <ul class="card-list">
        <li
          v-for="recipe in sortedRecipes"
          :key="recipe.id"
        >
          <article>
            <h1>{{ recipe.name }}</h1>
            <section>
              <!--              <% if recipe.image.url.present? %>-->
              <!--              <img src="<%= recipe.image.url %>" alt="<%= recipe.name %>" />-->
              <!--              <% else %>-->
              <!--              <img class="img-placeholder" src="../icons/image_placeholder.svg" alt='#' />-->
              <!--              <% end %>-->
              <div class="content">
                <router-link
                  :to="{ name: RouteName.Recipe, params: { id: recipe.id } }"
                  class="view-recipe"
                >
                  <i class="material-icons">receipt</i>View Recipe
                </router-link>
                <ul class="categories">
                  <li
                    v-for="category in recipe.categories"
                    :key="category.id"
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
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { stateKey, StoreModulePath } from '~/store'
import Recipe from 'Models/recipe'
import { ArrayUtils } from '~/utils/arrayUtils'
import { RecipeActionTypes } from '~/store/modules/recipes/actions'
import { RouteName } from '~/router/routeName'

export default defineComponent({
  name: 'RecipesIndex',
  setup() {
    const store = useStore(stateKey)
    store.dispatch(StoreModulePath.Recipes + RecipeActionTypes.FETCH_ALL)
    return {
      RouteName,
    }
  },
  computed: {
    recipes(): Array<Recipe> {
      return Recipe.all()
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
  },
})
</script>
