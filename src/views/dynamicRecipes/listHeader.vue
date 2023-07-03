<template>
  <ul class="flex flex-col xs:flex-row gap-5 place-items-center text-2xl mt-4">
    <li
      data-test="new-dynamic-recipe-group"
      class="flex items-center relative"
    >
      <router-link
        :to="{ name: $routerExtension.names.NewDynamicRecipe }"
        class="flex items-center"
      >
        <i class="material-icons">add_circle_outline</i>
        <span>New Dynamic Recipe</span>
      </router-link>
      <dropdown
        v-if="signedIn"
        :state="newDynamicRecipeDropdownState"
        position-type="mouse"
        @close="closeNewDynamicRecipeDropdown"
      >
        <template #control>
          <button
            type="button"
            data-test="new-dynamic-recipe-dropdown-button"
            class="flex items-center outline-none transition-transform active:shadow-inner hover:text-green"
            :class="{ 'rotate-180': newDynamicRecipeDropdownState }"
            @click="toggleNewDynamicRecipeDropdown"
          >
            <i class="material-icons-outlined">arrow_drop_down_circle</i>
          </button>
        </template>
        <ul data-test="new-dynamic-recipe-dropdown">
          <dropdown-item>
            <dropdown-item-button @click="openSelectTemplateModal">
              New from Template
            </dropdown-item-button>
          </dropdown-item>
        </ul>
      </dropdown>
    </li>
    <li>
      <router-link
        :to="{ name: $routerExtension.names.Recipes }"
        class="flex"
      >
        <i class="material-icons my-auto">view_comfy</i>
        <span>Recipe Cards</span>
      </router-link>
    </li>
  </ul>
  <Modal
    :state="modalState"
    center
    width="lg"
  >
    <template #header>
      <h3>Select template</h3>
    </template>
    <template #body>
      <div class="flex">
        <section class="basis-1/4">
          <ul class="w-full pr-2 border-r border-r-gray-300">
            <li
              v-for="template in templates"
              :key="template.name"
              class="w-full py-2 px-1 border-y border-y-gray-300 hover:bg-blue-100"
              :class="isTemplateSelected(template) ? 'bg-blue-300 hover:bg-blue-300' : ''"
            >
              <button
                type="button"
                class="text-left w-full h-full"
                @click="selectedTemplate = template"
              >
                <p>{{ template.name }}</p>
                <p class="text-gray-500">
                  {{ template.description }}
                </p>
              </button>
            </li>
          </ul>
        </section>
        <section class="grow overflow-auto">
          <template v-if="selectedTemplate">
            <base-block-group
              :blocks="selectedTemplate.blocks.filter(b => !b.parentId)"
              :director="blockDirector(selectedTemplate)"
            />
          </template>
        </section>
      </div>
    </template>
    <template #footer>
      <button
        class="btn ml-3 text-white bg-green hover:text-white hover:bg-green-700 disabled:bg-green-100"
        type="button"
        :disabled="!Boolean(selectedTemplate)"
        @click="startDynamicRecipe"
      >
        Select
      </button>
      <button
        class="btn ml-3 text-gray-900 bg-white border-solid border border-gray-400 hover:bg-gray-100 active:bg-gray-100 focus:bg-gray-100"
        @click="resetSelectTemplateModal"
      >
        Cancel
      </button>
    </template>
  </Modal>
</template>

<script lang="ts">
import Modal from '@/modal.vue'
import { UBlockDirector } from 'Interfaces/blockInterfaces'
import { FileUpload } from 'Interfaces/fileUploadInterfaces'
import { AxiosError } from 'axios'
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
import { ModalId } from '~/enums/modalId'
import DynamicRecipeTemplateFactory, { DynamicRecipeTemplate } from '~/factories/dynamicRecipeTemplateFactory'
import loading from '~/mixins/loading'
import DynamicRecipe from '~/models/dynamicRecipe'
import { StoreModulePath } from '~/store'
import { DynamicRecipeActionTypes } from '~/store/modules/dynamicRecipes/actions'
import { FlashActionTypes } from '~/store/modules/flash'
import { SessionGetterTypes } from '~/store/modules/sessions/getters'
import { SessionMutationTypes } from '~/store/modules/sessions/mutations'
import BlockDirector from '~/utils/blocks/blockDirector'
import Guid from '~/utils/guid'
import { HttpStatusCode } from '~/utils/httpUtils'

interface Data {
  newDynamicRecipeDropdownState: boolean
  templates: DynamicRecipeTemplate[]
  selectedTemplate: DynamicRecipeTemplate | null
}

export default defineComponent({
  name: 'DynamicRecipeListHeader',
  components: {
    Modal,
  },
  mixins: [
    loading,
  ],
  data(): Data {
    return {
      newDynamicRecipeDropdownState: false,
      templates: DynamicRecipeTemplateFactory.templates,
      selectedTemplate: null,
    }
  },
  computed: {
    ...mapGetters('sessions', { signedIn: SessionGetterTypes.SIGNED_IN }),
    modalState(): boolean {
      return this.$modal.state(ModalId.SelectDynamicRecipeTemplate)
    },
  },
  methods: {
    closeNewDynamicRecipeDropdown() {
      this.newDynamicRecipeDropdownState = false
    },
    openNewDynamicRecipeDropdown() {
      this.newDynamicRecipeDropdownState = true
    },
    toggleNewDynamicRecipeDropdown() {
      this.newDynamicRecipeDropdownState = !this.newDynamicRecipeDropdownState
    },
    openSelectTemplateModal() {
      this.closeNewDynamicRecipeDropdown()
      this.$modal.show(ModalId.SelectDynamicRecipeTemplate)
    },
    resetSelectTemplateModal() {
      this.$modal.hide(ModalId.SelectDynamicRecipeTemplate)
      this.selectedTemplate = null
    },
    isTemplateSelected(template): boolean {
      return this.selectedTemplate === template
    },
    async startDynamicRecipe() {
      const dynamicRecipe = new DynamicRecipe({ name: `New Recipe ${Guid.create()}`, blocks: this.selectedTemplate!.blocks, owner: this.currentUser, ownerId: this.currentUser.clientId })
      this.loading(async () => {
        await this.$store.dispatch(StoreModulePath.DynamicRecipes + DynamicRecipeActionTypes.CREATE, dynamicRecipe)
          .then(async (_response) => {
            await this.$router.push({
              name: this.$routerExtension.names.EditDynamicRecipe,
              params: { clientId: dynamicRecipe.clientId },
            })
          })
          .catch((error) => this.updateError(error))
          .finally(() => this.resetSelectTemplateModal())
      })
    },
    updateError(error: AxiosError) {
      let errorText = error.response?.data.error
      const opts: { signOut: boolean | null } = { signOut: null }
      switch (error.response?.status) {
        case (HttpStatusCode.Unauthorized):
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
      if (errorText) {
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { alert: errorText || 'An unknown error occurred' },
        })
      }
    },
    blockDirector(template: DynamicRecipeTemplate): UBlockDirector {
      return new BlockDirector<FileUpload>({
        blocks: template.blocks,
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
  },
})
</script>
