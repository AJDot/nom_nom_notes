<template>
  <div class="px-5 pt-5 overflow-hidden">
    <aside class="mb-5">
      <h2>
        <label for="filter-tag">
          Filter by Tag
        </label>
      </h2>
      <div
        :key="tags.length"
        class="flex items-center gap-1"
      >
        <search
          id="filter-tag"
          class="grow"
          :searcher="tagFilterSearcher"
          @select="filterByTag"
        />
        <button
          type="button"
          class="btn-clear flex"
          @click="clearTagFilter"
        >
          Clear
          <i class="material-icons">close</i>
        </button>
      </div>
    </aside>
    <main class="overflow-hidden after:block after:clear-both">
      <ul
        class="flex gap-4 flex-wrap mb-2 justify-center"
        data-test="dynamic-recipe-list"
      >
        <li
          v-for="dynamicRecipe in dynamicRecipesForList"
          :key="dynamicRecipe.clientId"
          class="w-72 shadow-md rounded-3xl flex justify-center justify-items-center"
          data-test="dynamic-recipe-list-item"
        >
          <router-link
            :to="{ name: $routerExtension.names.DynamicRecipe, params: { clientId: dynamicRecipe.clientId } }"
            class="w-full h-full uppercase transition-all place-content-center text-center border border-gray-400 rounded-3xl overflow-hidden group hover:cursor-pointer"
          >
            <article class="flex flex-col h-full">
              <h1 class="text-xl p-2 group-hover:text-green group-hover:bg-black">
                {{ dynamicRecipe.name }}
              </h1>
              <ul
                v-if="dynamicRecipe.tags.length"
                class="flex flex-wrap gap-1 mx-2 mt-2"
              >
                <li
                  v-for="tag in dynamicRecipe.tags"
                  :key="tag.clientId"
                  class="font-thin text-gray-500 text-xs"
                >
                  {{ tag.name }}
                </li>
              </ul>
              <HoverSlideShow
                :images="images(dynamicRecipe)"
                class="w-full grow h-60"
              />
            </article>
          </router-link>
        </li>
      </ul>
    </main>
  </div>
</template>

<script lang="ts">
import Search from '@/structure/search.vue'
import { defineComponent, ImgHTMLAttributes, ref } from 'vue'
import { useStore } from 'vuex'
import HoverSlideShow from '~/components/structure/hover-slide-show.vue'
import { UBlockDirector } from '~/interfaces/blockInterfaces'
import { SearchResult } from '~/interfaces/searchInterfaces'
import DynamicRecipe from '~/models/dynamicRecipe'
import Tag from '~/models/tag'
import { ApiPath } from '~/router/path'
import { stateKey, StoreModulePath } from '~/store'
import { DynamicRecipeActionTypes } from '~/store/modules/dynamicRecipes/actions'
import { ArrayUtils } from '~/utils/arrayUtils'
import BlockDirector from '~/utils/blocks/blockDirector'
import Searcher from '~/utils/searcher'
import ImagePlaceholder from '/icons/image_placeholder.svg'
import { FileUpload } from '~/interfaces/fileUploadInterfaces'

export default defineComponent({
  name: 'DynamicRecipesIndex',
  components: {
    HoverSlideShow,
    Search,
  },
  setup() {
    const store = useStore(stateKey)
    store.dispatch(StoreModulePath.DynamicRecipes + DynamicRecipeActionTypes.FETCH_ALL)
    const dynamicRecipeFilters = ref<{ tagName: string | null }>({ tagName: null })
    return {
      dynamicRecipeFilters,
    }
  },
  computed: {
    dynamicRecipes(): Array<DynamicRecipe> {
      return DynamicRecipe.query().with('attachments|tags').get()
    },
    sortedDynamicRecipes(): Array<DynamicRecipe> {
      return ArrayUtils.sort(this.dynamicRecipes, (a: DynamicRecipe, b: DynamicRecipe) => {
        const nameB = b.name && b.name.toLowerCase()
        const nameA = a.name && a.name.toLowerCase()
        if (!nameB) return 1
        if (!nameA) return -1
        if (nameA > nameB) return 1
        if (nameA < nameB) return -1
        return 0
      })
    },
    dynamicRecipesForList(): Array<DynamicRecipe> {
      return this.sortedDynamicRecipes.filter(r => {
        const tagName = this.dynamicRecipeFilters.tagName
        return !tagName || r.tags.some(tag => tag.name === tagName)
      })
    },
    tags(): Array<Tag> {
      return Tag.all()
    },
    tagFilterSearcher(): Searcher<Tag> {
      return new Searcher({
        type: 'result',
        label: 'name',
        valueString: 'name',
        collection: this.tags,
        matcher(item, q) {
          return Boolean(item.name.toLocaleLowerCase().match(q.toLocaleLowerCase()))
        },
      })
    },
  },
  methods: {
    images(dynamicRecipe: DynamicRecipe): ImgHTMLAttributes[] {
      const imgBlocks = this.blockDirector(dynamicRecipe).findWhere<{ type: 'image' }>({ type: 'image' }, { order: 'display' })
      const attrs = imgBlocks.reduce((attrs, block) => {
        const attachment = dynamicRecipe.attachments.find(a => a.clientId === block.content.attachmentId)
        if (attachment) {
          attrs.push({
            src: ApiPath.base() + ApiPath.fileUpload(attachment.clientId),
            alt: dynamicRecipe.name,
            title: dynamicRecipe.name,
            class: 'object-cover',
          })
        }
        return attrs
      }, [] as ImgHTMLAttributes[])
      if (!attrs.length) {
        attrs.push({
          class: 'img-placeholder p-6 object-contain',
          src: ImagePlaceholder,
          alt: dynamicRecipe.name,
        })
      }
      return attrs
    },
    blockDirector(dynamicRecipe: DynamicRecipe): UBlockDirector {
      return new BlockDirector<FileUpload>({
        blocks: dynamicRecipe.blocks,
        findAttachment: () => { return { attachment: null, url: null, alt: null } },
        focus: () => Promise.resolve(),
        focusAfter: () => Promise.resolve(),
        focusBefore: () => Promise.resolve(),
        onImageUpload: () => null,
        onInput: () => null,
        onSave: () => null,
        onBackspace: () => null,
        onDestroyAttachments: () => Promise.resolve(),
        onEnter: () => null,
        onArrowDown: () => null,
        onArrowUp: () => null,
      })
    },
    filterByTag(result: { data: SearchResult<Tag> }): void {
      this.dynamicRecipeFilters.tagName = result.data.value
    },
    clearTagFilter(): void {
      this.dynamicRecipeFilters.tagName = null
    },
  },
})
</script>
