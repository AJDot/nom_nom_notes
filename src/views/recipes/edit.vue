<template>
  <form
    v-if="recipe"
    class="edit-recipe"
    enctype="multipart/form-data"
    @submit.prevent="save"
  >
    <h2>{{ headerText }}</h2>
    <input
      class="btn"
      type="submit"
      :value="submitText"
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
          v-model.number="cookTime.hours"
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
          v-model.number="cookTime.minutes"
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
          <search
            :searcher="categorySearcher"
            @select="addCategory"
          />
          <ul>
            <row
              v-for="cat in recipe.categories"
              :key="cat.clientId"
            >
              <column>
                {{ cat.name }}
              </column>
            </row>
          </ul>
        </dd>
      </dl>
    </div>

    <dl>
      <dt><label for="ingredient-0-description">Ingredients</label></dt>
      <dd>
        <ingredients-list
          :ingredients="unmarkedSortedIngredients"
          @add="addIngredient"
          @context-menu="openContextMenu($event.event, recipe.ingredients, $event.item)"
        />
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
                v-focus="focusId === step.clientId"
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
import { FlashActionTypes } from '~/store/modules/flash'
import { AxiosError, AxiosResponse } from 'axios'
import { SessionMutationTypes } from '~/store/modules/sessions/mutations'
import { HttpStatusCode } from '~/utils/httpUtils'
import { DurationFilter } from '~/plugins/filters/durationFilter'
import Step from 'Models/step'
import Sorter from 'Models/concerns/sorter'
import Ingredient from 'Models/ingredient'
import { Destroyable, Sortable } from 'Interfaces/modelInterfaces'
import IngredientsList from 'Views/ingredients/list.vue'
import Category, { RCategory } from 'Models/category'
import Search from '@/search.vue'
import Searcher from '~/utils/searcher'
import RoutePath from '~/router/path'
import { SearchOptions, SearchResult } from 'Interfaces/searchInterfaces'
import RecipeCategory from 'Models/recipeCategory'

interface Data {
  recipe: Recipe | null
  cookTime: { hours?: number, minutes?: number }
  showContextMenu: null | MouseEvent
  contextItem: Sortable | null
  contextCollection: Array<Sortable>
  focusId: string | null
}

export default defineComponent({
  name: 'RecipeEdit',
  components: {
    Search,
    IngredientsList,
  },
  props: {
    mode: {
      type: String as () => 'edit' | 'create',
      default: 'edit',
    },
  },
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
    headerText(): string {
      if (this.mode === 'create') {
        return 'Create Recipe'
      } else {
        return `Edit Recipe: ${this.recipe?.name}`
      }
    },
    submitText(): string {
      if (this.mode === 'create') {
        return 'Create'
      } else {
        return 'Update Recipe'
      }
    },
    categorySearcher(): Searcher<Category, string> {
      const options: SearchOptions<Category, string> = {
        label: 'name',
        value: 'clientId',
        valueString: 'clientId',
        collection: Category.all(),
        endpoint: RoutePath.apiBase() + RoutePath.categories(),
      }
      if (this.recipe) {
        options.query = {
          not: {
            client_id: this.recipe.categories.map(c => c.clientId),
          },
        }
      }
      return new Searcher(options)
    },
  },
  watch: {
    cookTime: {
      deep: true,
      handler(newVal: Data['cookTime'], _oldVal: Data['cookTime']) {
        if (this.recipe) {
          this.recipe.cookTime = new DurationFilter().toSeconds(newVal)
        }
      },
    },
  },
  async beforeMount() {
    if (this.mode === 'create') {
      this.recipe = new Recipe()
    } else {
      const store = useStore<RootState>(stateKey)
      const clientId = router.currentRoute.value.params.clientId
      await store.dispatch(
        StoreModulePath.Recipes + RecipeActionTypes.FIND_OR_FETCH,
        clientId,
      )
      this.recipe = Recipe.query().whereId(clientId).with('steps|ingredients|categories').first()
      if (this.recipe) this.cookTime = new DurationFilter().secondsToHash(this.recipe.cookTime, 'hours', 'minutes')
    }
  },
  methods: {
    async save() {
      if (!this.recipe) return
      let action: string
      if (this.mode === 'create') {
        action = StoreModulePath.Recipes + RecipeActionTypes.CREATE
      } else {
        action = StoreModulePath.Recipes + RecipeActionTypes.UPDATE
      }
      this.$store.dispatch(action, this.recipe)
        .then((response) => this.updateSuccessful(response))
        .catch((error) => this.updateError(error))
    },
    async updateSuccessful(response: AxiosResponse) {
      if (response.data.error) {
        this.updateFailed(response)
        return
      }
      if (this.recipe) {
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
      let errorText = error.response?.data.error
      const opts: { signOut: boolean | null } = { signOut: null }
      if (this.mode === 'create') {
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
      } else {
        switch (error.response?.status) {
          case (HttpStatusCode.Forbidden):
            opts.signOut = true
            break
          default:
            opts.signOut = false
            break
        }
      }
      this.processFailedUpdate(errorText, opts)
    },
    processFailedUpdate(errorText: string | null | undefined, { signOut }: { signOut: boolean | null }) {
      if (signOut) this.$store.commit(StoreModulePath.Session + SessionMutationTypes.SIGN_OUT)
      if (errorText) {
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { alert: errorText || 'An unknown error occurred' },
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
    async addCategory(item: { data: SearchResult<RCategory> }) {
      if (!this.recipe) return
      await Category.insertOrUpdate({ data: item.data.raw })
      const cat = Category.find(item.data.value)
      if (cat) {
        this.recipe.categories.push(cat)

        await RecipeCategory.insertOrUpdate({
          data: {
            recipeId: this.recipe.clientId,
            categoryId: cat.clientId,
          },
        })
        const rc = RecipeCategory.query()
          .where('recipeId', this.recipe.clientId)
          .where('categoryId', cat.clientId)
          .first()
        if (rc) this.recipe.recipeCategories.push(rc)
      }
    },
    destroyItem<T extends Destroyable>(item: T) {
      item.markForDestruction()
    },
    isFirst<T extends Sortable>(items: Array<T>, item: T) {
      return new Sorter().isFirst(items, item)
    },
    isLast<T extends Sortable>(items: Array<T>, item: T) {
      return new Sorter().isLast(items, item)
    },
    moveUp<T extends Sortable>(items: Array<T>, item: T) {
      return new Sorter().moveUp(items, item)
    },
    moveDown<T extends Sortable>(items: Array<T>, item: T) {
      return new Sorter().moveDown(items, item)
    },
    openContextMenu(e: MouseEvent, collection: Array<Sortable & Destroyable>, item: Sortable & Destroyable) {
      this.contextItem = item
      this.contextCollection = collection
      this.showContextMenu = e
    },
    resetStepContextMenu() {
      this.contextItem = null
      this.contextCollection = []
      this.showContextMenu = null
    },
  },
})
</script>
