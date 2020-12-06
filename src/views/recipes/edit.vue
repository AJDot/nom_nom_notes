<template>
  <form v-if="tRecipe && recipe" class="edit-recipe" @submit.prevent="save" enctype="multipart/form-data">
    <h2>Edit Recipe: {{ recipe.name }} </h2>
    <input class="btn" type="submit" value="Update Recipe" placeholder="My Super Awesome Recipe" />
    <dl class="image">
      <dt>
        <!--        <% if params[:image] %>-->
        <!--        <img src="#" alt="<%= params[:image][:filename] %>" title="<%= params[:image][:filename] %>" id="image" />-->
        <!--        <% elsif @recipe.image.url %>-->
        <!--        <img src="<%= @recipe.image.url %>" alt="<%= @recipe.name %>" title="<%= @recipe.name %>" id="image" />-->
        <!--        <% else %>-->
        <!--        <img class="img-placeholder" src="/icons/image_placeholder.svg" alt='Upload an Image' id="image" />-->
        <!--        <% end %>-->
      </dt>
      <dd>
        <!--        <label class="choose-file btn">-->
        <!--          Choose File-->
        <!--          <input type="file" name="image" data-for="#image" />-->
        <!--        </label>-->
      </dd>
    </dl>
    <dl class="name">
      <dt><label for="name">Name</label></dt>
      <dd>
        <input
          v-model="tRecipe.name"
          type="text"
          name="name"
          id="name"
          placeholder="My Super Awesome Recipe"
        />
      </dd>
    </dl>
    <dl class="cook-time grid grid-1-4">
      <dt><label for="hours">Cook Time</label></dt>
      <dd class="grid-1-2">
        <h3>Hours</h3>
        <!--        <input type="number" name="hours" id="hours" value="<%= params[:hours] || @recipe.cook_interval.hours || 0 %>" min="0" />-->
      </dd>
      <dd class="grid-1-2 last">
        <h3>Minutes</h3>
        <!--        <input type="number" name="minutes" id="minutes" value="<%= params[:minutes] || @recipe.cook_interval.minutes || 0 %>" min="0" max="59" />-->
      </dd>
    </dl>
    <dl class="description">
      <dt><label for="description">Description</label></dt>
      <dd>
        <textarea v-model="tRecipe.description" name="description" id="description" cols=80 rows=10
                  placeholder="Enter recipe description"
        ></textarea>
      </dd>
    </dl>
    <div class="grid">
      <dl class="grid-1-2">
        <dt><label for="ethnicities">Ethnicities</label></dt>
        <dd>
          <!--        <textarea name="ethnicities" id="ethnicities" cols=80 rows=10 placeholder="Put each ethnicity on its own line."><%==-->
          <!--          params[:ethnicities] || on_newlines(@recipe.ethnicities.map(&:name))-->
          <!--        %></textarea>-->
        </dd>
      </dl>
      <dl class="grid-1-2">
        <dt><label for="categories">Categories</label></dt>
        <dd>
          <!--        <textarea name="categories" id="categories" cols=80 rows=10 placeholder="Put each category on its own line."><%==-->
          <!--          params[:categories] || on_newlines(@recipe.categories.map(&:name))-->
          <!--        %></textarea>-->
        </dd>
      </dl>
    </div>
    <dl>
      <dt><label for="ingredients">Ingredients</label></dt>
      <dd>
        <!--      <textarea name="ingredients" id="ingredients" cols=80 rows=10 placeholder="Put each ingredient on its own line."><%==-->
        <!--        params[:ingredients] || on_newlines(@recipe.ingredients.map(&:description))-->
        <!--      %></textarea>-->
      </dd>
    </dl>
    <dl>
      <dt><label for="steps">Directions</label></dt>
      <dd>
        <!--      <textarea name="steps" id="steps" cols=80 rows=10 placeholder="Put each step on its own line."><%==-->
        <!--        params[:steps] || on_newlines(@recipe.steps.map(&:description))-->
        <!--      %></textarea>-->
      </dd>
    </dl>
    <dl>
      <dt><label for="note">Notes</label></dt>
      <dd>
        <textarea v-model="tRecipe.note" name="note" id="note" cols=80 rows=10
                  placeholder="Put each note on its own line."
        ></textarea>
      </dd>
    </dl>
    <input class="btn" type="submit" value="Update Recipe" />
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { useStore } from 'vuex'
import { stateKey, StoreModulePath } from '~/store'
import router from '~/router'
import { RootState } from '~/store/interfaces'
import { RecipeActionTypes } from '~/store/modules/recipes/actions'
import Recipe from 'Models/recipe'
import RoutePath from '~/router/path'
import { FlashActionTypes } from '~/store/modules/flash'
import { RouteName } from '~/router/routeName'

export default defineComponent({
  name: "recipe-edit",
  data() {
    return {
      tRecipe: null,
      recipe: null,
    }
  },
  async beforeMount() {
    const store = useStore<RootState>(stateKey)
    const id =router.currentRoute.value.params.id
    this.recipe = await store.dispatch(StoreModulePath.Recipes + RecipeActionTypes.FIND_OR_FETCH, id)
    this.tRecipe = new Recipe({ ...this.recipe.$toJson(), id: 't_' + this.recipe.id,  })
  },
  methods: {
    save() {
      const json = this.tRecipe.$toJson()
      json.id = this.recipe.id
      delete json['id']
      this.$http.secured.patch(RoutePath.apiBase() + RoutePath.recipe(this.recipe.id), {
        recipe: json
      })
        .then(response => this.updateSuccessful(response))
        .catch(error => this.updateFailed(error))
    },
    updateSuccessful(response) {
      if (response.data.error) {
        this.updateFailed(response)
      }
      const json = this.tRecipe.$toJson()
      delete json['id']
      this.recipe.$update(json)
      this.$router.push({ name: RouteName.Recipe, params: { id: this.recipe.id } })
    },
    updateFailed(error) {
      const errorText = error?.response?.data?.error ?? error?.data?.error
      if (errorText) this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, { flash: { alert: errorText } })
    },
  },
})

</script>
