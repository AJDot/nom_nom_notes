<template>
  <form
    v-if="tRecipe && recipe"
    class="edit-recipe"
    enctype="multipart/form-data"
    @submit.prevent="save"
  >
    <h2>Edit Recipe: {{ recipe.name }}</h2>
    <input
      class="btn"
      type="submit"
      value="Update Recipe"
      placeholder="My Super Awesome Recipe"
    >
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
          id="name"
          v-model="tRecipe.name"
          type="text"
          name="name"
          placeholder="My Super Awesome Recipe"
        >
      </dd>
    </dl>
    <dl class="cook-time grid grid-1-4">
      <dt><label for="hours">Cook Time</label></dt>
      <dd class="grid-1-2">
        <h3><label for="hours">Hours</label></h3>
        <input
          id="hours"
          v-model="cookTime.hours"
          type="number"
          name="hours"
          min="0"
          max="191"
        >
      </dd>
      <dd class="grid-1-2 last">
        <h3><label for="minutes">Minutes</label></h3>
        <input
          id="minutes"
          v-model="cookTime.minutes"
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
          v-model="tRecipe.description"
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
      <dl class="grid-1-2">
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
      <dt>Directions</dt>
      <dd>
        <ul>
          <li
            v-for="(step, i) in unmarkedSteps"
            :key="step.clientId"
            class="row"
          >
            <div class="cell">
              <label :for="`step-${i}-description`">{{ i }}</label>
            </div>
            <div class="cell grow-2">
              <textarea
                :id="`step-${i}-description`"
                v-model="step.description"
                type="text"
                :name="`step-${i}-description`"
                placeholder="Next step..."
              />
            </div>
            <div class="cell">
              <button
                class="btn"
                type="button"
                @click="destroyStep(step)"
              >
                x
              </button>
            </div>
          </li>
          <li>
            <button
              class="btn"
              type="button"
              @click="addStep"
            >
              + Add Step
            </button>
          </li>
        </ul>
      </dd>
    </dl>
    <dl>
      <dt><label for="note">Notes</label></dt>
      <dd>
        <textarea
          id="note"
          v-model="tRecipe.note"
          name="note"
          cols="80"
          rows="10"
          placeholder="Put each note on its own line."
        />
      </dd>
    </dl>
    <input
      class="btn"
      type="submit"
      value="Update Recipe"
    >
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { stateKey, StoreModulePath } from '~/store'
import router from '~/router'
import { RootState } from '~/store/interfaces'
import { RecipeActionTypes } from '~/store/modules/recipes/actions'
import Recipe from 'Models/recipe'
import RoutePath from '~/router/path'
import { FlashActionTypes } from '~/store/modules/flash'
import { AxiosError, AxiosResponse } from 'axios'
import { SessionMutationTypes } from '~/store/modules/sessions/mutations'
import { HttpStatusCode } from '~/utils/httpUtils'
import { DurationFilter } from '~/plugins/filters/durationFilter'
import Step from 'Models/step'

interface Data {
  tRecipe: Recipe | null
  recipe: Recipe | null
  cookTime: { hours: number, minutes: number }
}

export default defineComponent({
  name: 'RecipeEdit',
  data(): Data {
    return {
      tRecipe: null,
      recipe: null,
      cookTime: {
        hours: 0,
        minutes: 0,
      },
    }
  },
  computed: {
    unmarkedSteps(): Array<Step> {
      return this.tRecipe?.steps.filter(s => !s.markedForDestruction) ?? []
    },
  },
  async beforeMount() {
    const store = useStore<RootState>(stateKey)
    const clientId = router.currentRoute.value.params.clientId
    await store.dispatch(
      StoreModulePath.Recipes + RecipeActionTypes.FIND_OR_FETCH,
      clientId,
    )
    this.recipe = Recipe.query().whereId(clientId).with('steps').first()
    if (this.recipe) {
      this.tRecipe = new Recipe(this.recipe.$toJson())
      this.tRecipe.steps = this.recipe.steps
      const parsed = new DurationFilter().parseSeconds(this.tRecipe.cookTime, 'hours', 'minutes')
      this.cookTime.hours = parsed.find(d => d.unit.one === 'hour')?.amount ?? 0
      this.cookTime.minutes = parsed.find(d => d.unit.one === 'minute')?.amount ?? 0
    }
  },
  methods: {
    save() {
      if (!this.tRecipe || !this.recipe) return
      this.tRecipe.cookTime = new DurationFilter().toSeconds(this.cookTime)
      const json = this.tRecipe.$toJson()
      json.id = this.recipe.id
      json.clientId = this.recipe.clientId
      this.$http.secured
        .patch(RoutePath.apiBase() + RoutePath.recipe(this.recipe.clientId), {
          recipe: json,
        })
        .then((response) => this.updateSuccessful(response))
        .catch((error) => this.updateError(error))
    },
    async updateSuccessful(response: AxiosResponse) {
      if (response.data.error) {
        this.updateFailed(response)
        return
      }
      if (this.tRecipe && this.recipe) {
        const json = this.tRecipe.$toJson()
        delete json.id
        delete json.clientId
        await this.recipe.$update(json)
        await this.tRecipe.steps.forEach(s => {
          if (s.markedForDestruction) {
            Step.delete(s.clientId)
          } else {
            Step.insertOrUpdate({ data: s.$toJson() })
          }
        })
        await this.$router.push({
          name: this.$routerExtension.names.Recipe,
          params: { clientId: this.recipe.clientId ?? '' },
        })
      }
    },
    updateFailed(error: AxiosResponse) {
      this.processFailedUpdate(error?.data?.error, { signOut: false })
    },
    updateError(error: AxiosError) {
      const errorText = error.response?.data.error
      const opts: { signOut: boolean | null } = { signOut: null }
      switch (error.response?.status) {
        case (HttpStatusCode.Forbidden):
          opts.signOut = true
          break
        default:
          opts.signOut = false
          break
      }
      this.processFailedUpdate(errorText, opts)
    },
    processFailedUpdate(errorText: string | null | undefined, { signOut }: { signOut: boolean | null }) {
      if (signOut) this.$store.commit(StoreModulePath.Session + SessionMutationTypes.SIGN_OUT)
      if (errorText) {
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { alert: errorText },
        })
      }
    },
    async addStep() {
      const step = await Step.new() as Step
      step.recipeId = this.recipe?.clientId
      this.tRecipe?.steps.push(step)
    },
    destroyStep(step: Step) {
      step.markForDestruction()
    },
  },
})
</script>
