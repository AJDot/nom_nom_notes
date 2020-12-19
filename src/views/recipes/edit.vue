<template>
  <form
    v-if="recipe"
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
        <ul>
          <row
            v-for="(ing, i) in unmarkedSortedIngredients"
            :key="ing.clientId"
            tag="li"
          >
            <column>
              <label :for="`ing-${i}-description`">{{ i + 1 }}</label>
            </column>
            <column class="grow-2">
              <input
                :id="`ing-${i}-description`"
                v-model="ing.description"
                v-focus="focusId === ing.clientId"
                type="text"
              >
            </column>
            <column>
              <button
                class="btn"
                type="button"
                @click="openContextMenu($event, recipe.ingredients, ing)"
              >
                <span class="material-icons">
                  more_vert
                </span>
              </button>
            </column>
          </row>
          <row tag="li">
            <button
              class="btn"
              type="button"
              @click="addIngredient"
            >
              + Add Ingredient
            </button>
          </row>
        </ul>
      </dd>
    </dl>
    <dl>
      <dt><label for="step-0-description">Directions</label></dt>
      <dd>
        <ul>
          <row
            v-for="(step, i) in unmarkedSortedSteps"
            :key="step.clientId"
            tag="li"
          >
            <column>
              <label :for="`step-${i}-description`">{{ i + 1 }}</label>
            </column>
            <column class="grow-2">
              <textarea
                :id="`step-${i}-description`"
                v-model="step.description"
                v-focus="focusId = step.clientId"
                :name="`step-${i}-description`"
                placeholder="Next step..."
              />
            </column>
            <column>
              <div class="row">
                <div class="col">
                  <button
                    class="btn"
                    type="button"
                    @click="openContextMenu($event, recipe.steps, step)"
                  >
                    <span class="material-icons">
                      more_vert
                    </span>
                  </button>
                </div>
              </div>
            </column>
          </row>
          <row tag="li">
            <button
              class="btn"
              type="button"
              @click="addStep"
            >
              + Add Step
            </button>
          </row>
        </ul>
      </dd>
    </dl>
    <dl>
      <dt><label for="note">Notes</label></dt>
      <dd>
        <textarea
          id="note"
          v-model="recipe.note"
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
    <context-menu
      ref="menu"
      :display="showContextMenu"
      @close="resetStepContextMenu"
    >
      <ul
        v-if="showContextMenu"
        class="dropdown"
      >
        <li
          v-if="!isFirst(contextCollection, contextItem)"
          class="dropdown-item"
        >
          <button
            class="dropdown-btn"
            type="button"
            @click="moveUp(contextCollection, contextItem)"
          >
            Up
          </button>
        </li>
        <li
          v-if="!isLast(contextCollection, contextItem)"
          class="dropdown-item"
        >
          <button
            class="dropdown-btn"
            type="button"
            @click="moveDown(contextCollection, contextItem)"
          >
            Down
          </button>
        </li>
        <li class="dropdown-item">
          <button
            class="dropdown-btn"
            type="button"
            @click="destroyItem(contextItem)"
          >
            Delete
          </button>
        </li>
      </ul>
    </context-menu>
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
import Sorter from 'Models/concerns/sorter'
import Ingredient from 'Models/ingredient'
import { Sortable } from 'Interfaces/modelInterfaces'

interface Data {
  recipe: Recipe | null
  cookTime: { hours: number, minutes: number }
  showContextMenu: null | MouseEvent
  contextItem: Sortable | null
  contextCollection: Array<Sortable>
  focusId: string | null
}

export default defineComponent({
  name: 'RecipeEdit',
  data(): Data {
    return {
      recipe: null,
      cookTime: {
        hours: 0,
        minutes: 0,
      },
      showContextMenu: null,
      contextItem: null,
      contextCollection: [],
      focusId: null,
    }
  },
  computed: {
    unmarkedSortedSteps(): Array<Step> {
      return (this.recipe?.steps.filter(s => !s.markedForDestruction) ?? [])
        .sort((a, b) => a.sortOrder - b.sortOrder)
    },
    unmarkedSortedIngredients(): Array<Ingredient> {
      return (this.recipe?.ingredients.filter(s => !s.markedForDestruction) ?? [])
        .sort((a, b) => a.sortOrder - b.sortOrder)
    },
  },
  async beforeMount() {
    const store = useStore<RootState>(stateKey)
    const clientId = router.currentRoute.value.params.clientId
    await store.dispatch(
      StoreModulePath.Recipes + RecipeActionTypes.FIND_OR_FETCH,
      clientId,
    )
    this.recipe = Recipe.query().whereId(clientId).with('steps|ingredients').first()
    if (this.recipe) {
      const parsed = new DurationFilter().parseSeconds(this.recipe.cookTime, 'hours', 'minutes')
      this.cookTime.hours = parsed.find(d => d.unit.one === 'hour')?.amount ?? 0
      this.cookTime.minutes = parsed.find(d => d.unit.one === 'minute')?.amount ?? 0
    }
  },
  methods: {
    save() {
      if (!this.recipe) return
      this.recipe.cookTime = new DurationFilter().toSeconds(this.cookTime)
      const json = this.recipe.$toJson()
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
      if (this.recipe) {
        await this.recipe.save()
        await this.recipe.steps.forEach(s => {
          if (s.markedForDestruction) {
            Step.delete(s.clientId)
          } else {
            Step.insertOrUpdate({ data: s.$toJson() })
          }
        })
        await this.recipe.ingredients.forEach(ing => {
          if (ing.markedForDestruction) {
            Ingredient.delete(ing.clientId)
          } else {
            Ingredient.insertOrUpdate({ data: ing.$toJson() })
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
      if (!this.recipe) return
      const step = await Step.new() as Step
      step.sortOrder = this.recipe.steps.length
      step.recipeId = this.recipe?.clientId
      this.focusId = step.clientId
      this.recipe.steps.push(step)
    },
    async addIngredient() {
      if (!this.recipe) return
      const ingredient = await Ingredient.new() as Ingredient
      ingredient.sortOrder = this.recipe.ingredients.length
      ingredient.recipeId = this.recipe?.clientId
      this.focusId = ingredient.clientId
      this.recipe.ingredients.push(ingredient)
    },
    destroyItem<T>(item: T) {
      item.markForDestruction()
    },
    isFirst<T>(items: Array<T>, item: T) {
      return new Sorter().isFirst(items, item)
    },
    isLast<T>(items: Array<T>, item: T) {
      return new Sorter().isLast(items, item)
    },
    moveUp<T>(items: Array<T>, item: T) {
      return new Sorter().moveUp(items, item)
    },
    moveDown<T>(items: Array<T>, item: T) {
      return new Sorter().moveDown(items, item)
    },
    openContextMenu(e: MouseEvent, collection, item) {
      this.contextItem = item
      this.contextCollection = collection
      this.showContextMenu = e
    },
    resetStepContextMenu() {
      this.contextItem = null
      this.contextCollection = null
      this.showContextMenu = null
    },
  },
})
</script>
