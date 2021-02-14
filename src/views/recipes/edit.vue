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
        <img v-bind="imageAttrs">
      </dt>
      <dd>
        <label class="choose-file btn">
          Choose File
          <input
            type="file"
            name="image"
            @change="setImage"
          >
        </label>
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
        <dt><label for="ingredient-0-description">Ingredients</label></dt>
        <dd>
          <ingredients-list
            :ingredients="unmarkedSortedIngredients"
            @add="addIngredient"
            @context-menu="openContextMenu($event.event, recipe.ingredients, $event.item)"
          />
        </dd>
      </dl>
      <dl class="grid-1-2">
        <dt><label for="categories">Categories</label></dt>
        <dd>
          <search
            id="categories"
            :searcher="categorySearcher"
            @select="addCategory"
          />
          <ul>
            <row
              v-for="cat in unmarkedCategories"
              :key="cat.clientId"
              :data-test="`category-${cat.name}`"
            >
              <column class="grow-2">
                {{ cat.name }}
              </column>

              <column>
                <button
                  type="button"
                  class="btn-link"
                  data-test="category-destroy"
                  @click="destroyRecipeCategory(cat)"
                >
                  <i class="material-icons wiggle">delete</i>
                </button>
              </column>
            </row>
          </ul>
        </dd>
      </dl>
    </div>

    <dl>
      <dt><label for="step-0-description">Directions</label></dt>
      <dd>
        <steps-list
          :steps="unmarkedSortedSteps"
          @add="addStep"
          @context-menu="openContextMenu($event.event, recipe.steps, $event.item)"
        />
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
import Logger from '~/utils/logger'
import Uploader from '~/uploaders/uploader'
import ImagePlaceholder from 'Public/icons/image_placeholder.svg'
import { ImageSource } from 'Interfaces/imageInterfaces'
import loading from '~/mixins/loading'
import StepsList from 'Views/steps/list.vue'

interface Data {
  recipe: Recipe | null
  cookTime: { hours?: number, minutes?: number }
  showContextMenu: null | MouseEvent
  contextItem: Sortable | null
  contextCollection: Array<Sortable>
  focusId: string | null
  tmpImage: { image?: ImageSource, raw?: File }
}

interface ImageAttrs {
  src?: ImageSource
  alt: string
  id?: string
  class?: string
}

export default defineComponent({
  name: 'RecipeEdit',
  components: {
    Search,
    IngredientsList,
    StepsList,
  },
  mixins: [
    loading,
  ],
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
      tmpImage: {},
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
    unmarkedCategories(): Array<Category> {
      return this.recipe?.categories.filter(c => {
        const rc = this.recipe?.recipeCategories.find(rc => rc.categoryId === c.$id)
        return !rc?.markedForDestruction
      }) || []
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
    imageAttrs(): ImageAttrs {
      if (this.tmpImage.image) {
        return {
          src: this.tmpImage.image,
          alt: 'Upload an Image',
        }
      } else if (this.recipe?.image.url) {
        return {
          src: this.recipe.image.url,
          alt: 'Upload an Image',
        }
      } else {
        return {
          id: 'image',
          class: 'img-placeholder',
          src: ImagePlaceholder,
          alt: 'Upload an Image',
        }
      }
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
      try {
        await store.dispatch(
          StoreModulePath.Recipes + RecipeActionTypes.FIND_OR_FETCH,
          clientId,
        )
        this.recipe = Recipe.query().whereId(clientId).with('steps|ingredients|categories|recipeCategories').first()
        if (this.recipe) {
          this.cookTime = new DurationFilter().secondsToHash(this.recipe.cookTime, 'hours', 'minutes')
        }
      } catch {
        await this.$router.push({
          name: this.$routerExtension.names.Home,
        })
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { alert: 'Recipe not found.' },
        })
      }
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
      this.loading(async () => {
        await this.$store.dispatch(action, this.recipe)
          .then((response) => this.updateSuccessful(response))
          .catch((error) => this.updateError(error))
      })
    },
    async updateSuccessful(response: AxiosResponse) {
      if (response.data.error) {
        this.updateFailed(response)
        return
      }
      if (this.recipe) {
        // if image uploaded, then upload it
        if (this.tmpImage.raw) {
          const uploader = new Uploader(RoutePath.apiBase() + RoutePath.recipe(this.recipe.clientId))
          const imageResponse = await uploader.patch({
            root: 'recipe',
            data: {
              clientId: this.recipe.clientId,
              id: this.recipe.id,
              image: this.tmpImage.raw,
            },
          })
          await this.recipe.$update({ image: imageResponse.data.data.attributes.image })
        }
        await this.$router.push({
          name: this.$routerExtension.names.Recipe,
          params: { clientId: this.recipe.clientId ?? '' },
        })
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { success: `${this.recipe.name} was ${this.mode === 'create' ? 'created' : 'updated'} successfully.` },
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
        if (!this.recipe.categories.find(c => c.clientId === cat.clientId)) {
          this.recipe.categories.push(cat)
        }

        const recCatId = [this.recipe.clientId, cat.clientId]

        await RecipeCategory.insertOrUpdate({
          data: {
            recipeId: this.recipe.clientId,
            categoryId: cat.clientId,
          },
        })
        const rc = RecipeCategory.find(recCatId)
        if (rc) {
          const recCat = this.recipe.recipeCategories.find(x => x.$id === rc.$id)
          recCat ? recCat.unmarkForDestruction() : this.recipe.recipeCategories.push(rc)
        }
      }
    },
    destroyItem<T extends Destroyable>(item: T) {
      item.markForDestruction()
    },
    destroyRecipeCategory(item: Category) {
      if (this.recipe) {
        const rc = this.recipe.recipeCategories.find(rc => rc.categoryId === item.$id)
        const category = this.recipe.categories.find(c => c.$id === item.$id)
        if (category) {
          category.$delete()
          const categoryIndex = this.recipe.categories.indexOf(category)
          this.recipe.categories.splice(categoryIndex, 1)
        }
        if (rc) {
          rc.markForDestruction()
        } else {
          Logger.warn('RecipeCategory not found!')
        }
      }
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
    setImage(event: Event) {
      if (this.recipe) {
        this.onFileChange(this.recipe, event)
      } else {
        Logger.warn('Recipe or File does not exist!')
      }
    },
    onFileChange(recipe: Recipe, e: Event) {
      const target = e.target as HTMLInputElement
      const files = target.files
      if (!files?.length) return
      this.createImage(recipe, files[0])
    },
    createImage(recipe: Recipe, file: File) {
      const reader = new FileReader()

      reader.onload = (e) => {
        this.tmpImage.image = e.target?.result
      }

      this.tmpImage = {
        image: null,
        raw: file,
      }
      reader.readAsDataURL(file)
    },
  },
})
</script>
