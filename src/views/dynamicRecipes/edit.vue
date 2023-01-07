<template>
  <form v-if="dynamicRecipe" class="mx-3" @submit.prevent>
    <section class="max-w-screen-lg p-2.5 mx-auto mb-8 rounded-2xl shadow-card grid grid-cols-1 gap-x-4 sm:grid-cols-2">
      <dl class="mt-2 mb-4 sm:col-span-2">
        <dt class="text-lg border-b border-gray-400 mb-2"><label for="name">Name</label></dt>
        <dd>
          <a-input id="name" v-model="dynamicRecipeName" :editable="isEditable" type="text" name="name" placeholder="My Super Awesome Recipe" />
        </dd>
      </dl>
      <div class="sm:col-span-2">
        <base-block-group :blocks="topLevelBlocks" :mode="mode" :director="blockDirector" :draggable="isEditable" :droppable="isEditable" :editable="isEditable" />
        <base-block v-if="isEditable && !blockDirector.find(textBlock.id)" :block="textBlock" :mode="mode" :director="blockDirector" />
        <dropdown :state="dropdownState" position-type="cursor">
          <ul class="max-w-lg">
            <template v-if="commandSelector.collections.some(c => c.length)">
              <dropdown-item v-for="commandResult in commandSelector.collections.flat()" :class="{ 'select-blue': commandResult === commandSelector.current }">
                <dropdown-item-button @click="onCommandClick({ block: currentBlock!, command: commandResult.raw })" class="grid grid-cols-1 text-left">
                  <h1 class="font-sans text-lg bold">
                    {{ commandResult.label }}
                  </h1>
                  <p v-if="commandResult.raw.description" class="text-gray-500">{{ commandResult.raw.description }}</p>
                </dropdown-item-button>
              </dropdown-item>
            </template>
            <template v-else>
              <dropdown-item-empty>
                No results
              </dropdown-item-empty>
            </template>
          </ul>
        </dropdown>
      </div>
    </section>
  </form>
</template>

<script lang="ts">
import { debounce } from 'lodash'
import { AxiosError, AxiosResponse } from 'axios'
import { defineComponent, nextTick } from 'vue'
import { mapActions, mapState, useStore } from 'vuex'
import { UBlockDirector } from '~/interfaces/blockInterfaces'
import { AllBlock, Block, BlockCommand, BlockCommandType, ContentAttachmentIdBlock, FindAttachmentReturn, TextBlock } from '~/interfaces/blockInterfacesGeneral'
import { FileUpload as IFileUpload } from '~/interfaces/fileUploadInterfaces'
import { Uploader as IUploader } from '~/interfaces/imageInterfaces'
import { SearchResult, USearcher } from '~/interfaces/searchInterfaces'
import { USelector } from '~/interfaces/selectInterfaces'
import { default as DynamicRecipe, default as dynamicRecipe } from '~/models/dynamicRecipe'
import FileUpload, { FileUploadAttributes } from '~/models/fileUpload'
import router from '~/router'
import { ApiPath } from '~/router/path'
import { stateKey, StoreModulePath } from '~/store'
import { RootState } from '~/store/interfaces'
import { DynamicRecipeActionTypes } from '~/store/modules/dynamicRecipes/actions'
import { FlashActionTypes } from '~/store/modules/flash'
import { ChoiceActionTypes } from '~/store/modules/interfaces/modules/choice'
import { SessionMutationTypes } from '~/store/modules/sessions/mutations'
import Uploader from '~/uploaders/uploader'
import { default as blockDirector, default as BlockDirector } from '~/utils/blocks/blockDirector'
import Guid from '~/utils/guid'
import { HttpStatusCode } from '~/utils/httpUtils'
import { ObjectUtils } from '~/utils/objectUtils'
import Searcher from '~/utils/searcher'
import Selector from '~/utils/selector'

interface Data {
  dynamicRecipe: DynamicRecipe | null
  dropdownState: boolean
  q: string
  blockDirector: UBlockDirector
  commandSearch: USearcher<BlockCommand>
  commandSelector: USelector<SearchResult<BlockCommand>[][]>
  currentBlock: Block | null
  emptyCommandSearchTimes: number
  textBlock: TextBlock
}

export default defineComponent({
  name: 'DynamicRecipeEdit',
  props: {
    view: {
      type: String,
      default: 'show',
      validator: prop => typeof prop === 'string' && ['show', 'edit'].includes(prop)
    }
  },
  data(): Data {
    const commandSelector = new Selector()
    return {
      dynamicRecipe: null,
      dropdownState: false,
      q: '',
      blockDirector: null!,
      commandSearch: null!,
      commandSelector,
      currentBlock: null,
      emptyCommandSearchTimes: 0,
      textBlock: {
        id: Guid.create(),
        type: 'text',
        content: { text: '' },
      },
    }
  },
  computed: {
    ...mapState(StoreModulePath.Interfaces + StoreModulePath.Choice, { currentChoice: 'current' }),
    blocks: {
      get(): Block[] {
        if (!this.dynamicRecipe) return []

        return this.dynamicRecipe.blocks
      },
      set(value: Block[]) {
        if (!this.dynamicRecipe) return []

        this.dynamicRecipe.blocks = value
      }
    },
    topLevelBlocks: {
      get(): Block[] {
        return this.blocks.filter(b => !b.parentId)
      },
      set(value: Block[]) {
        this.blocks = value
      },
    },
    mode(): 'create' | 'show' | 'edit' | 'choose' {
      switch (this.view) {
        case 'show':
          return 'show'
        case 'edit':
          if (this.currentChoice) {
            return 'choose'
          } else if (this.dynamicRecipe?.id) {
            return 'edit'
          } else {
            return 'create'
          }
        default:
          return 'show'
      }
    },
    isShowMode(): boolean {
      return this.mode === 'show'
    },
    isCreateMode(): boolean {
      return this.mode === 'create'
    },
    isEditMode(): boolean {
      return this.mode === 'edit'
    },
    isChooseMode(): boolean {
      return this.mode === 'choose'
    },
    isEditable(): boolean {
      if (this.currentChoice) return false

      return this.isCreateMode || this.isEditMode
    },
    textBlockAttached(): boolean {
      return !!this.blockDirector?.find(this.textBlock.id)
    },
    dynamicRecipeName: {
      get(): string | undefined {
        return this.dynamicRecipe?.name
      },
      set(value: string) {
        if (!this.dynamicRecipe) return
        this.dynamicRecipe.name = value
        this.save()
      }
    }
  },
  methods: {
    ...mapActions(StoreModulePath.Interfaces + StoreModulePath.Choice, { unsetCurrentChoice: ChoiceActionTypes.UNSET }),
    onClick({ block, event, call }: { block: Block, event: PointerEvent, call: Function }) {
      if (this.currentChoice) {
        this.blockDirector.onChoose({ block, event, choice: this.currentChoice })
        this.unsetCurrentChoice()
      }
      call()
      this.save()
    },
    async onImageUpload({ block, image, call }: { block: ContentAttachmentIdBlock, image: IUploader, call: Function }) {
      if (this.dynamicRecipe && image.raw) {
        const uploader = new Uploader(ApiPath.base() + ApiPath.fileUploads())
        const imageResponse = await uploader.post<FileUploadAttributes>({
          root: 'file_upload',
          data: {
            clientId: Guid.create(),
            file: image.raw,
            attachableType: 'DynamicRecipe',
            attachableId: this.dynamicRecipe.clientId,
          },
        })
        await FileUpload.insertOrUpdate({ data: { id: imageResponse.data.data.id, ...imageResponse.data.data.attributes } })
        const imageUpload = FileUpload.find(imageResponse.data.data.attributes.clientId!)!
        this.dynamicRecipe.attachments.push(imageUpload)
        const oldAttachmentId = block.content.attachmentId
        let oldAttachment: FileUpload | null = null
        block.content.attachmentId = imageUpload.clientId

        if (oldAttachmentId) {
          ({ attachment: oldAttachment } = this.findAttachment({ id: oldAttachmentId }))
          oldAttachment?.markForDestruction()
        }
        call()
        await this.save()
        if (oldAttachment) {
          const index = this.dynamicRecipe.attachments.indexOf(oldAttachment)
          if (index >= 0) this.dynamicRecipe.attachments.splice(index, 1)
        }
      }
    },
    findAttachment({ id }: { id: string | null | undefined }): FindAttachmentReturn<FileUpload> {
      if (!this.dynamicRecipe) return { attachment: null, url: null }

      const attachment: FileUpload | null = this.dynamicRecipe.attachments.find(a => a.clientId === id) as FileUpload | null
      if (attachment) {
        return { attachment, url: ApiPath.base() + ApiPath.fileUpload(attachment.clientId) }
      } else {
        return { attachment: null, url: null }
      }
    },
    async onInput({ block, event, call }: { block: Block, event: InputEvent, call: Function }) {
      if (!this.dynamicRecipe) return

      const data = event.data
      if (!this.dropdownState && data === '/') {
        this.openSearch({ block, data })
        return
      }
      if (this.dropdownState) {
        if (event.inputType === 'deleteContentBackward') {
          if (this.q) {
            this.q = this.q.slice(0, this.q.length - 1)
            this.commandSearch.search(this.q)
            this.commandSelector.collections = [this.commandSearch.results]
            this.commandSelector.set(0)
            if (this.emptyCommandSearchTimes) this.emptyCommandSearchTimes--
          } else {
            this.closeSearch()
          }
        } else {
          this.q += data
          this.commandSearch.search(this.q)
          this.commandSelector.collections = [this.commandSearch.results]
          this.commandSelector.set(0)

          if (this.commandSelector.collections.some(c => c.length)) {
            this.emptyCommandSearchTimes = 0
          } else {
            this.emptyCommandSearchTimes++
          }
          if (this.emptyCommandSearchTimes > 3) {
            this.closeSearch()
          }
        }

        return
      }

      call()
      this.save()
      this.focus(block)
    },
    onEnter({ block, event, call }: { block: Block, event: KeyboardEvent, call: Function }) {
      if (!this.dynamicRecipe) return

      if (this.dropdownState) {
        if (!this.commandSelector.current) return

        this.executeCommand({ block: this.currentBlock, command: this.commandSelector.current.raw })
        this.focus(block)
        this.save()
        return
      }

      call()
      this.focusAfter(block)
      this.save()
    },
    onArrowDown({ block, event }) {
      if (!this.dynamicRecipe) return

      if (this.dropdownState) {
        this.commandSelector.down()
        event.preventDefault()
        return
      }

      this.focusAfter(block)
    },
    onArrowUp({ block, event }) {
      if (!this.dynamicRecipe) return

      if (this.dropdownState) {
        this.commandSelector.up()
        event.preventDefault()
        return
      }

      this.focusBefore(block)
    },
    onBackspace({ block, event, call }: { block: Block, event: InputEvent, call: Function }) {
      if (!this.dynamicRecipe) return

      const data = event.data
      if (this.dropdownState) return

      if (!this.blockDirector.isEmpty(block)) return

      const beforeBlock = this.blockDirector.blockBefore(block)
      if (beforeBlock) {
        this.focusBefore(block)
        call()
      }
      this.save()
    },
    onDelete({ block, event, call }: { block: Block, event: InputEvent, call: Function }) {
      if (!this.dynamicRecipe) return
      if (!this.blockDirector.isEmpty(block)) return

      const blockAfter = this.blockDirector.blockAfter(block)
      if (blockAfter) {
        this.focusAfter(block)
        call()
      }
      this.save()
    },
    onMove({ move, to, call }: { move: Block, to: Block, call: Function }) {
      call()
      this.save()
    },
    onCreate({ block, inside, call }: { block: Block, inside?: Block, call: Function }) {
      call()
      this.save()
    },
    async onDestroy({ block, call }: { block: Block, call: Function }) {
      call()
      const b: AllBlock = block as AllBlock
      const attachmentId = ObjectUtils.dig(b, 'content', 'attachmentId')
      let attachment: FileUpload | null = null
      if (attachmentId) b.content.attachmentId = null
      if (this.dynamicRecipe) {
        attachment = this.dynamicRecipe!.attachments.find(a => a.clientId === attachmentId) || null
        attachment?.markForDestruction()
      }
      await this.save()
      if (this.dynamicRecipe && attachment) {
        const index = this.dynamicRecipe.attachments.indexOf(attachment)
        if (index >= 0) this.dynamicRecipe.attachments.splice(index, 1)
      }
    },
    onCommandClick({ block, command }: { block: Block, command: BlockCommand }) {
      this.executeCommand({ block, command })
      this.focus(block)
    },
    async executeCommand({ block, command }: { block: Block | null, command: BlockCommand }) {
      if (block === null) return

      if (block === this.textBlock) this.blockDirector.add(this.textBlock)
      command.call(block)

      // hack to make block component reload - which wipe the "fake" characters used for command search
      if ('content' in block && 'text' in block.content) {
        const text = block.content.text
        block.content.text = text + ' '
        await nextTick()
        block.content.text = text
      }

      this.closeSearch()
    },
    async focus(block: Block) {
      await nextTick()
      this.focusWithinBlock(block).trigger('focus')
    },
    async focusBefore(block: Block) {
      await nextTick()
      this.focusStepBlock(block, -1).trigger('focus')
    },
    async focusAfter(block: Block) {
      await nextTick()
      this.focusStepBlock(block, 1).trigger('focus')
    },
    focusWithinBlock(block: Block) {
      return $(`[data-id="${block.id}"]`).find('[data-id]').addBack().find('[data-focus]').first()
    },
    focusStepBlock(block: Block, step: number) {
      const $focusables = $('[data-id]:not([data-focusable="false"],[aria-disabled="true"])')
      let index = $focusables.index($(`[data-id="${block.id}"]`)) + step
      index %= $focusables.length
      const $focusableRoot = $focusables.eq(index)
      return $focusableRoot.is('[data-focus]') ? $focusableRoot : $focusableRoot.find('[data-focus]')
    },
    openSearch({ block, data }) {
      this.currentBlock = block
      this.dropdownState = true
      this.q = ''
      this.commandSearch.search(this.q)
      this.commandSelector.collections = [this.commandSearch.results]
      this.commandSelector.set(0)
    },
    closeSearch() {
      this.dropdownState = false
      this.q = ''
      this.emptyCommandSearchTimes = 0
    },
    async updateSuccessful(response: AxiosResponse) {
      if (response.data.error) {
        this.updateFailed(response)
        return
      }
      if (response.status === HttpStatusCode.Created) {
        await this.$routerExtension.replace({ name: this.$routerExtension.names.EditDynamicRecipe, params: { clientId: this.dynamicRecipe!.clientId } })
      }
    },
    updateFailed(error: AxiosResponse) {
      this.processFailedUpdate(error?.data?.error, { signOut: false })
    },
    updateError(error: AxiosError) {
      let errorText = error.response?.data.error
      const opts: { signOut: boolean | null } = { signOut: null }
      if (this.isCreateMode) {
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
    save: debounce(function (this) {
      let action: string
      if (this.isCreateMode) {
        action = StoreModulePath.DynamicRecipes + DynamicRecipeActionTypes.CREATE
      } else {
        action = StoreModulePath.DynamicRecipes + DynamicRecipeActionTypes.UPDATE
      }
      this.$store.dispatch(action, this.dynamicRecipe)
        .then((response) => this.updateSuccessful(response))
        .catch((error) => this.updateError(error))
    }, 500)
  },
  async beforeMount() {
    const clientId = router.currentRoute.value.params.clientId
    const store = useStore<RootState>(stateKey)
    if (clientId) {
      try {
        await store.dispatch(
          StoreModulePath.DynamicRecipes + DynamicRecipeActionTypes.FIND_OR_FETCH,
          clientId,
        )
        this.dynamicRecipe = DynamicRecipe.query().whereId(clientId).with('attachments').first()!
        if (!this.dynamicRecipe.blocks) this.dynamicRecipe.blocks = []
      } catch (e) {
        await this.$router.push({
          name: this.$routerExtension.names.Home,
        })
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { alert: 'Recipe not found.' },
        })
        return
      }
    } else {
      this.dynamicRecipe = new DynamicRecipe()
    }

    this.blockDirector = new BlockDirector<IFileUpload>({
      blocks: this.dynamicRecipe.blocks,
      findAttachment: this.findAttachment.bind(this),
      onArrowDown: this.onArrowDown.bind(this),
      onArrowUp: this.onArrowUp.bind(this),
      onBackspace: this.onBackspace.bind(this),
      onClick: this.onClick.bind(this),
      onCreate: this.onCreate.bind(this),
      onDelete: this.onDelete.bind(this),
      onDestroy: this.onDestroy.bind(this),
      onEnter: this.onEnter.bind(this),
      onImageUpload: this.onImageUpload.bind(this),
      onInput: this.onInput.bind(this),
      onMove: this.onMove.bind(this),
    })

    this.commandSearch = new Searcher({
      label: 'label',
      valueString: 'label',
      type: 'command',
      collection: () => {
        const allowableCommands: Array<BlockCommandType> = ['h1', 'h2', 'h3', 'text', 'columns', 'sidebar', 'image']
        if (
          this.blockDirector.find(this.currentBlock?.parentId)?.type === 'column' ||
          this.currentBlock?.type === 'sidebar' && this.blockDirector.find(this.currentBlock?.parentId)?.type === 'row'
        ) {
          allowableCommands.push('addColumn')
        }
        return allowableCommands.reduce<BlockCommand[]>((commands, commandId) => {
          commands.push(this.blockDirector.COMMANDS[commandId])
          return commands
        }, [])
      },
      matcher(item, q) {
        return Boolean(item.label.toLocaleLowerCase().match(q.toLocaleLowerCase()))
      },
    })
  },
  watch: {
    textBlockAttached(newVal, oldVal) {
      if (newVal) {
        this.textBlock = {
          id: Guid.create(),
          type: 'text',
          content: { text: '' },
        }
      }
    },
  },
})
</script>
