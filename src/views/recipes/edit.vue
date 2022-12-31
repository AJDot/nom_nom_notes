<template>
  <form v-if="recipe" class="mx-3" enctype="multipart/form-data" @submit.prevent="save">
    <section class="max-w-screen-lg p-2.5 mx-auto mb-8 rounded-2xl shadow-card grid grid-cols-1 gap-x-4 sm:grid-cols-2">
      <h2 class="text-3xl border-b border-gray-400 col-span-2">{{ headerText }}</h2>
      <input class="btn col-span-2" type="submit" :value="submitText">

      <div class="grid col-span-2 sm:grid-cols-2">
        <dl class="sm:col-span-1 sm:order-1">
          <dt>
            <img v-bind="imageAttrs" class="w-full mx-auto mb-4 rounded-2xl max-x-52 max-h-52 object-contain">
          </dt>
          <dd>
            <label class="float-right btn w-full">
              Choose File
              <input type="file" name="image" class="hidden" @change="setImage">
            </label>
          </dd>
        </dl>

        <div class="sm:col-span-1">
          <dl class="mt-2 mb-4">
            <dt class="text-lg border-b border-gray-400 mb-2"><label for="name">Name</label></dt>
            <dd>
              <a-input id="name" v-model="recipe.name" type="text" name="name" placeholder="My Super Awesome Recipe" />
            </dd>
          </dl>
          <dl class="mt-2 mb-4 flex flex-wrap gap-2">
            <dt class="basis-full text-lg border-b border-gray-400"><label for="hours">Cook Time</label></dt>
            <dd>
              <h3 class="border-b border-gray-400 mb-2 font-bold"><label for="hours">Hours</label></h3>
              <a-input id="hours" v-model.number="cookTime.hours" type="number" name="hours" min="0" max="191" />
            </dd>
            <dd>
              <h3 class="border-b border-gray-400 mb-2 font-bold"><label for="minutes">Minutes</label></h3>
              <a-input id="minutes" v-model.number="cookTime.minutes" type="number" name="minutes" min="0" max="59" />
            </dd>
          </dl>
        </div>
      </div>


      <dl class="col-span-2 mt-2 mb-4">
        <dt class="text-lg border-b border-gray-400 mb-2"><label for="description">Description</label></dt>
        <dd>
          <a-textarea id="description" v-model="recipe.description" name="description" cols="80" rows="10" placeholder="Enter recipe description" class="w-full" />
        </dd>
      </dl>
      <dl class="col-span-2 mt-2 mb-4 sm:col-span-1">
        <dt class="text-lg border-b border-gray-400"><label for="ingredient-0-description">Ingredients</label></dt>
        <dd class="mt-2">
          <ingredients-list :ingredients="unmarkedSortedIngredients" @add="addIngredient" />
        </dd>
      </dl>
      <dl class="col-span-2 mt-2 mb-4 sm:col-span-1">
        <dt class="text-lg border-b border-gray-400"><label for="categories">Categories</label></dt>
        <dd>
          <search id="categories" :searchers="[categorySearcher, createCategorySearcher]" @select="addCategory" />
          <ul class="grid grid-cols-1">
            <li v-for="cat in unmarkedCategories" :key="cat.clientId" :data-test="`category-${cat.name}`" class="flex p-1">
              <span class="grow inline-block my-auto">
                {{ cat.name }}
              </span>
              <button type="button" class="btn" data-test="category-destroy" @click="destroyRecipeCategory(cat)">
                <i class="material-icons align-middle">delete</i>
              </button>
            </li>
          </ul>
        </dd>
      </dl>

      <dl class="col-span-2 mt-2 mb-4">
        <dt class="text-lg border-b border-gray-400"><label for="step-0-description">Directions</label></dt>
        <dd class="mt-2">
          <steps-list :steps="unmarkedSortedSteps" @add="addStep" />
        </dd>
      </dl>
      <dl class="col-span-2 mt-2 mb-4">
        <dt class="text-lg border-b border-gray-400"><label for="note">Notes</label></dt>
        <dd class="mt-2">
          <a-textarea id="note" v-model="recipe.note" name="note" cols="80" rows="10" class="w-full" />
        </dd>
      </dl>
      <input class="btn col-span-2" type="submit" :value="submitText">
    </section>
  </form>
</template>

<script lang="ts">
import { defineComponent, ImgHTMLAttributes } from 'vue'
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
import Ingredient from 'Models/ingredient'
import IngredientsList from 'Views/ingredients/list.vue'
import Category, { RCategory } from 'Models/category'
import { CategoryActionTypes } from '~/store/modules/categories/actions'
import Search from '@/structure/search.vue'
import Searcher from '~/utils/searcher'
import { ApiPath } from '~/router/path'
import { SearchOptions, SearchResult } from 'Interfaces/searchInterfaces'
import RecipeCategory from 'Models/recipeCategory'
import Logger from '~/utils/logger'
import Uploader from '~/uploaders/uploader'
import ImagePlaceholder from '/icons/image_placeholder.svg'
import { ImageSource } from 'Interfaces/imageInterfaces'
import loading from '~/mixins/loading'
import StepsList from 'Views/steps/list.vue'
import { Command } from '~/enums/command'

interface Data {
  recipe: Recipe | null
  cookTime: { hours?: number, minutes?: number }
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
    categorySearcher(): Searcher<Category> {
      const options: SearchOptions<Category> = {
        type: 'result',
        label: 'name',
        valueString: 'clientId',
        endpoint: ApiPath.base() + ApiPath.categories(),
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
    createCategorySearcher(): Searcher<{ command: Command, name: string }> {
      return new Searcher<{ command: Command, name: string }>({
        type: 'command',
        label: (item, { q }) => `${item.name} ${q}`,
        valueString: (_item, { q }) => {
          const categoryExists = Category.query().where((category: Category) => {
            return category.name.toLocaleLowerCase() === q.toLocaleLowerCase().trim()
          }).exists()
          // ? never match : always match
          return categoryExists ? '' : q
        },
        collection: [{ command: Command.CreateCategory, name: '+ Create category' }],
      })
    },
    imageAttrs(): ImgHTMLAttributes {
      if (this.tmpImage.image) {
        return {
          src: this.tmpImage.image.toString(),
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
    const store = useStore<RootState>(stateKey)
    if (this.mode === 'create') {
      this.recipe = new Recipe()
    } else {
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
    await store.dispatch(StoreModulePath.Categories + CategoryActionTypes.FETCH_ALL)
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
        await Promise.all(Category.query().where('id', null).get().map(category => {
          return this.$store.dispatch(StoreModulePath.Categories + CategoryActionTypes.CREATE, category)
        }))
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
          const uploader = new Uploader(ApiPath.base() + ApiPath.recipe(this.recipe.clientId))
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
    async addCategory(item: { data: SearchResult<RCategory, 'result'> | SearchResult<{ command: Command, name: string }, 'command'> }) {
      if (!this.recipe) return
      let cat
      if (item.data.type === 'command') {
        if (item.data.raw.command)
          cat = (await Category.insertOrUpdate({ data: { name: item.data.value.trim() } })).categories[0]
      } else {
        await Category.insertOrUpdate({ data: item.data.raw })
        cat = Category.find(item.data.value)
      }

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
    destroyRecipeCategory(item: Category) {
      if (this.recipe) {
        const rc = this.recipe.recipeCategories.find(rc => rc.categoryId === item.$id)
        const category = this.recipe.categories.find(c => c.$id === item.$id)
        if (category) {
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
    exactCategoryNameMatch(collections: Array<Array<SearchResult<Category>>>, name: string): boolean {
      return collections.some(items => items.some(item => item.label.toLocaleLowerCase() === name.toLocaleLowerCase()))
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
