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
        <dt class="text-lg border-b border-gray-400"><label for="tags">Tags</label></dt>
        <dd>
          <search id="tags" :searchers="[tagSearcher, createTagSearcher]" @select="addTag" />
          <ul class="grid grid-cols-1">
            <li v-for="tag in unmarkedTags" :key="tag.clientId" :data-test="`tag-${tag.name}`" class="flex p-1">
              <span class="grow inline-block my-auto">
                {{ tag.name }}
              </span>
              <button type="button" class="btn" data-test="tag-destroy" @click="destroyTagging(tag)">
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
import Search from '@/structure/search.vue'
import { AxiosError, AxiosResponse } from 'axios'
import { ImageSource } from 'Interfaces/imageInterfaces'
import { SearchOptions, SearchResult } from 'Interfaces/searchInterfaces'
import Ingredient from 'Models/ingredient'
import Recipe from 'Models/recipe'
import Step from 'Models/step'
import Tagging from 'Models/tagging'
import IngredientsList from 'Views/ingredients/list.vue'
import StepsList from 'Views/steps/list.vue'
import { defineComponent, ImgHTMLAttributes } from 'vue'
import { useStore } from 'vuex'
import { Command } from '~/enums/command'
import loading from '~/mixins/loading'
import Tag, { RTag } from "~/models/tag"
import { DurationFilter } from '~/plugins/filters/durationFilter'
import router from '~/router'
import { ApiPath } from '~/router/path'
import { stateKey, StoreModulePath } from '~/store'
import { RootState } from '~/store/interfaces'
import { FlashActionTypes } from '~/store/modules/flash'
import { RecipeActionTypes } from '~/store/modules/recipes/actions'
import { SessionMutationTypes } from '~/store/modules/sessions/mutations'
import { TagActionTypes } from "~/store/modules/tags/actions"
import Uploader from '~/uploaders/uploader'
import { HttpStatusCode } from '~/utils/httpUtils'
import Logger from '~/utils/logger'
import Searcher from '~/utils/searcher'
import ImagePlaceholder from '/icons/image_placeholder.svg'

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
    unmarkedTags(): Array<Tag> {
      return this.recipe?.tags.filter(tag => {
        const tagging = this.recipe?.taggings.find(tagging => tagging.tagId === tag.$id)
        return !tagging?.markedForDestruction
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
    tagSearcher(): Searcher<Tag> {
      const options: SearchOptions<Tag> = {
        type: 'result',
        label: 'name',
        valueString: 'clientId',
        endpoint: ApiPath.base() + ApiPath.tags(),
      }
      if (this.recipe) {
        options.query = {
          not: {
            client_id: this.recipe.tags.map(c => c.clientId),
          },
        }
      }
      return new Searcher(options)
    },
    createTagSearcher(): Searcher<{ command: Command, name: string }> {
      return new Searcher<{ command: Command, name: string }>({
        type: 'command',
        label: (item, { q }) => `${item.name} ${q}`,
        valueString: (_item, { q }) => {
          const tagExists = Tag.query().where((tag: Tag) => {
            return tag.name.toLocaleLowerCase() === q.toLocaleLowerCase().trim()
          }).exists()
          // ? never match : always match
          return tagExists ? '' : q
        },
        collection: [{ command: Command.CreateTag, name: '+ Create tag' }],
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
      this.recipe = new Recipe({ ownerId: this.currentUser.clientId, owner: this.currentUser })
    } else {
      const clientId = router.currentRoute.value.params.clientId
      try {
        await store.dispatch(
          StoreModulePath.Recipes + RecipeActionTypes.FIND_OR_FETCH,
          clientId,
        )
        this.recipe = Recipe.query().whereId(clientId).with('steps|ingredients|tags|taggings').first()
        if (this.recipe) {
          this.cookTime = new DurationFilter().secondsToHash(this.recipe.cookTime, 'hours', 'minutes')
        }
      } catch {
        await this.$router.push({
          name: this.$routerExtension.names.Recipes,
        })
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { alert: 'Recipe not found.' },
        })
      }
    }
    await store.dispatch(StoreModulePath.Tags + TagActionTypes.FETCH_ALL)
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
        await Promise.all(Tag.query().where('id', null).get().map(tag => {
          return this.$store.dispatch(StoreModulePath.Tags + TagActionTypes.CREATE, tag)
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
          case (HttpStatusCode.Unauthorized):
            opts.signOut = true
            break
          case (HttpStatusCode.Forbidden):
            errorText = errorText ?? 'You are not authorized to create this recipe.'
            break
          case (HttpStatusCode.NotFound):
            errorText = errorText ?? 'An unknown error occurred. Please contact the app admin.'
            break
          default:
            break
        }
      } else {
        switch (error.response?.status) {
          case (HttpStatusCode.Unauthorized):
            opts.signOut = true
            break
          case (HttpStatusCode.Forbidden):
            errorText = errorText ?? 'You are not authorized to update this recipe.'
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
    async addTag(item: { data: SearchResult<RTag, 'result'> | SearchResult<{ command: Command, name: string }, 'command'> }) {
      if (!this.recipe) return
      let tag
      if (item.data.type === 'command') {
        if (item.data.raw.command)
          tag = (await Tag.insertOrUpdate({ data: { name: item.data.value.trim() } })).tags[0]
      } else {
        await Tag.insertOrUpdate({ data: item.data.raw })
        tag = Tag.find(item.data.value)
      }

      if (tag) {
        if (!this.recipe.tags.find(c => c.clientId === tag.clientId)) {
          this.recipe.tags.push(tag)
        }

        const taggingId = [tag.clientId, this.recipe.clientId]

        await Tagging.insertOrUpdate({
          data: {
            tagId: tag.clientId,
            taggableId: this.recipe.clientId,
            taggableType: this.recipe.selfClass.name,
          },
        })
        const tagging = Tagging.find(taggingId)
        if (tagging) {
          const recipeTagging = this.recipe.taggings.find(x => x.$id === tagging.$id)
          if (recipeTagging) {
            recipeTagging.unmarkForDestruction()
          } else {
            this.recipe.taggings.push(tagging)
          }
        }
      }
    },
    destroyTagging(item: Tag) {
      if (this.recipe) {
        const tagging = this.recipe.taggings.find(tagging => tagging.tagId === item.$id)
        const tag = this.recipe.tags.find(tag => tag.$id === item.$id)
        if (tag) {
          const tagIndex = this.recipe.tags.indexOf(tag)
          this.recipe.tags.splice(tagIndex, 1)
        }
        if (tagging) {
          tagging.markForDestruction()
        } else {
          Logger.warn('Tagging not found!')
        }
      }
    },
    exactTagNameMatch(collections: Array<Array<SearchResult<Tag>>>, name: string): boolean {
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
