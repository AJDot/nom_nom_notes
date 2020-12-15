<template>
  <form
    class="edit-recipe"
    enctype="multipart/form-data"
    @submit.prevent="save"
  >
    <h2>Create Recipe</h2>
    <input
      class="btn"
      type="submit"
      value="Create"
    >
    <dl class="image">
      <dt>
        <!--          <img class="img-placeholder" src="/icons/image_placeholder.svg" alt='Upload an Image' />-->
      </dt>
      <dd>
        <!--          <label class="choose-file btn">-->
        <!--            Choose File-->
        <!--            <input type="file" name="image" />-->
        <!--          </label>-->
      </dd>
    </dl>
    <dl class="name">
      <dt><label for="name">Name</label></dt>
      <dd>
        <input
          id="name"
          v-model="recipe.name"
          type="text"
          name="name"
          placeholder="My Super Awesome Recipe"
        >
      </dd>
    </dl>
    <dl class="cook-time grid grid-1-4">
      <dt><label for="hours">Cook Time</label></dt>
      <dd class="grid-1-2">
        <h3>Hours</h3>
        <input
          id="hours"
          type="number"
          name="hours"
          min="0"
        >
      </dd>
      <dd class="grid-1-2">
        <h3>Minutes</h3>
        <input
          id="minutes"
          type="number"
          name="minutes"
          min="0"
          max="59"
        >
      </dd>
    </dl>
    <dl class="description">
      <dt><label for="description">Description</label></dt>
      <dd>
        <textarea
          id="description"
          v-model="recipe.description"
          name="description"
          cols="80"
          rows="10"
          placeholder="Enter recipe description"
        />
      </dd>
    </dl>
    <div class="grid">
      <dl class="grid-1-2">
        <dt><label for="ethnicities">Ethnicities</label></dt>
        <dd>
          <textarea
            id="ethnicities"
            name="ethnicities"
            cols="80"
            rows="10"
            placeholder="Put each ethnicity on its own line."
          />
        </dd>
      </dl>
      <dl class="grid-1-2 last">
        <dt><label for="categories">Categories</label></dt>
        <dd>
          <textarea
            id="categories"
            name="categories"
            cols="80"
            rows="10"
            placeholder="Put each category on its own line."
          />
        </dd>
      </dl>
    </div>
    <dl>
      <dt><label for="ingredients">Ingredients</label></dt>
      <dd>
        <textarea
          id="ingredients"
          name="ingredients"
          cols="80"
          rows="10"
          placeholder="Put each ingredient on its own line."
        />
      </dd>
    </dl>
    <dl>
      <dt><label for="steps">Directions</label></dt>
      <dd>
        <textarea
          id="steps"
          name="steps"
          cols="80"
          rows="10"
          placeholder="Put each step on its own line."
        />
      </dd>
    </dl>
    <dl>
      <dt><label for="notes">Notes</label></dt>
      <dd>
        <textarea
          id="notes"
          v-model="recipe.note"
          name="notes"
          cols="80"
          rows="10"
          placeholder="Put each note on its own line."
        />
      </dd>
    </dl>
    <input
      class="btn"
      type="submit"
      value="Create"
    >
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { StoreModulePath } from '~/store'
import Recipe from 'Models/recipe'
import { FlashActionTypes } from '~/store/modules/flash'
import { AxiosError, AxiosResponse } from 'axios'
import { SessionMutationTypes } from '~/store/modules/sessions/mutations'
import { HttpStatusCode } from '~/utils/httpUtils'
import { RecipeActionTypes } from '~/store/modules/recipes/actions'

interface Data {
  recipe: Recipe
}

export default defineComponent({
  name: 'RecipeEdit',
  setup(_props, _context): Data {
    const recipe = new Recipe()
    return {
      recipe,
    }
  },
  methods: {
    save() {
      this.$store.dispatch(StoreModulePath.Recipes + RecipeActionTypes.CREATE, this.recipe)
        .then((response) => this.createSuccessful(response))
        .catch((error) => this.createError(error))
    },
    createSuccessful(response: AxiosResponse) {
      if (response.data.error) {
        this.createFailed(response)
        return
      }
      this.$router.push({
        name: this.$routerExtension.names.Recipe,
        params: { clientId: this.recipe.clientId ?? '' },
      })
    },
    createFailed(error: AxiosResponse) {
      this.processFailedUpdate(error?.data?.error, { signOut: false })
    },
    createError(error: AxiosError) {
      let errorText = error.response?.data.error
      const opts: {signOut: boolean} = { signOut: false }
      switch (error.response?.status) {
        case (HttpStatusCode.Forbidden):
          opts.signOut = true
          break
        case (HttpStatusCode.NotFound):
          errorText = errorText ?? 'An unknown error occurred. Please contact the app admin.'
          break
        default:
          break
      }
      this.processFailedUpdate(errorText, opts)
    },
    processFailedUpdate(errorText: string | null | undefined, { signOut }: { signOut: boolean | null }) {
      if (signOut) this.$store.commit(StoreModulePath.Session + SessionMutationTypes.SIGN_OUT)
      this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
        flash: { alert: errorText || 'An unknown error occurred' },
      })
    },
  },
})
</script>
