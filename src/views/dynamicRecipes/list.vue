<template>
  <div class="px-5 pt-5 overflow-hidden">
    <main class="overflow-hidden after:block after:clear-both">
      <ul class="flex gap-4 flex-wrap mb-2 justify-center">
        <li v-for="dynamicRecipe in dynamicRecipesForList" :key="dynamicRecipe.clientId" class="w-72 shadow-md rounded-3xl flex justify-center justify-items-center">
          <router-link :to="{ name: $routerExtension.names.DynamicRecipe, params: { clientId: dynamicRecipe.clientId } }" class="w-full h-full uppercase transition-all place-content-center text-center border border-gray-400 rounded-3xl overflow-hidden group hover:cursor-pointer">
            <article class="flex flex-col h-full">
              <h1 class="text-xl p-2 group-hover:text-green group-hover:bg-black">{{ dynamicRecipe.name }}</h1>
              <HoverSlideShow :images="images(dynamicRecipe)" class="w-full grow h-60" />
            </article>
          </router-link>
        </li>
      </ul>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ImgHTMLAttributes } from 'vue'
import { useStore } from 'vuex'
import HoverSlideShow from '~/components/structure/hover-slide-show.vue'
import { UBlockDirector } from '~/interfaces/blockInterfaces'
import DynamicRecipe from '~/models/dynamicRecipe'
import { ApiPath } from '~/router/path'
import { stateKey, StoreModulePath } from '~/store'
import { DynamicRecipeActionTypes } from '~/store/modules/dynamicRecipes/actions'
import { ArrayUtils } from '~/utils/arrayUtils'
import BlockDirector from '~/utils/blocks/blockDirector'
import ImagePlaceholder from '/icons/image_placeholder.svg'

export default defineComponent({
  name: "DynamicRecipesIndex",
  components: {
    HoverSlideShow,
  },
  setup() {
    const store = useStore(stateKey)
    store.dispatch(StoreModulePath.DynamicRecipes + DynamicRecipeActionTypes.FETCH_ALL)
    return {}
  },
  computed: {
    dynamicRecipes(): Array<DynamicRecipe> {
      return DynamicRecipe.query().with("attachments").get()
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
      return this.sortedDynamicRecipes
    },
  },
  methods: {
    images(dynamicRecipe: DynamicRecipe): ImgHTMLAttributes[] {
      const imgBlocks = this.blockDirector(dynamicRecipe).findWhere<{ type: "image" }>({ type: "image" }, { order: 'display' })
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
          class: "img-placeholder p-6 object-contain",
          src: ImagePlaceholder,
          alt: dynamicRecipe.name,
        })
      }
      return attrs
    },
    blockDirector(dynamicRecipe: DynamicRecipe): UBlockDirector {
      return new BlockDirector({ blocks: dynamicRecipe.blocks })
    },
  },
})
</script>
