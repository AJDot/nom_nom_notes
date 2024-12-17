<template>
  <div
    v-if="canScale"
    class="mx-3 mb-3"
  >
    <div class="container max-w-screen-lg mb-3 mx-auto">
      <div class="relative float-right">
        <dropdown
          :state="scaleDropdownState"
          right
          @close="scaleDropdownState = false"
        >
          <template #control>
            <button
              class="btn"
              type="button"
              data-test="more"
              @click="scaleDropdownState = !scaleDropdownState"
            >
              <span v-if="scaleDisplay">({{ scaleDisplay }})</span> Scale
            </button>
          </template>
          <ul class="max-w-lg grid grid-cols-2">
            <dropdown-item class="col-span-2">
              <label class="grid grid-cols-3 p-2 items-center">
                <span>Custom:</span>
                <a-input
                  placeholder="ex: 1.33, 1 1/3"
                  class="col-span-2 border focus:border focus:shadow-none hover:shadow-none hover:border placeholder:text-green"
                  @keydown.enter="onScaleEnter"
                />
              </label>
            </dropdown-item>
            <dropdown-item
              v-for="scale in scaleSelector.collections.flat()"
              :key="scale.value"
              :class="{ 'select-blue': scale === scaleSelector.current }"
            >
              <dropdown-item-button
                class="justify-center"
                @click="onScaleClick(scale)"
              >
                {{ scale.label }}
              </dropdown-item-button>
            </dropdown-item>
          </ul>
        </dropdown>
      </div>
    </div>
  </div>
  <form
    v-if="dynamicRecipe"
    class="mx-3"
    @submit.prevent
  >
    <section class="max-w-screen-lg p-2.5 mx-auto mb-8 rounded-2xl shadow-card grid grid-cols-1 gap-x-4 sm:grid-cols-2">
      <dl class="mt-2 mb-4 sm:col-span-1">
        <dt class="text-lg border-b border-gray-400 mb-2">
          <label for="name">Name</label>
        </dt>
        <dd>
          <a-input
            id="name"
            v-model="dynamicRecipeName"
            :editable="isEditable"
            type="text"
            name="name"
            placeholder="My Super Awesome Recipe"
          />
        </dd>
      </dl>
      <dl class="mt-2 mb-4 sm:col-span-1">
        <dt class="text-lg border-b border-gray-400 mb-2">
          <label for="tags">Tags</label>
        </dt>
        <dd>
          <search
            v-if="!isShowMode"
            id="tags"
            :searchers="[tagSearcher, createTagSearcher]"
            :disabled="!isEditMode"
            @select="addTag"
          />
          <ul :class="isShowMode ? 'flex flex-wrap gap-x-2' : ''">
            <li
              v-for="tag in unmarkedTags"
              :key="tag.clientId"
              :data-test="`tag-${tag.name}`"
              class="mt-2"
              :class="isShowMode ? 'inline-block' : 'flex'"
            >
              <span class="grow my-auto">
                {{ tag.name }}
              </span>
              <button
                v-if="isEditMode"
                type="button"
                class="btn"
                data-test="tag-destroy"
                @click="destroyTagging(tag)"
              >
                <i class="material-icons align-middle">delete</i>
              </button>
            </li>
          </ul>
        </dd>
      </dl>
      <div class="sm:col-span-2">
        <base-block-group
          :blocks="topLevelBlocks"
          :mode="mode"
          :director="blockDirector"
          :draggable="isEditable"
          :droppable="isEditable"
          :editable="isEditable"
        />
        <base-block
          v-if="isEditable && !blockDirector.find(textBlock.id)"
          :block="textBlock"
          :mode="mode"
          :director="blockDirector"
        />
        <dropdown
          :state="dropdownState"
          position-type="cursor"
        >
          <ul class="max-w-lg">
            <template v-if="commandSelector.collections.some(c => c.length)">
              <dropdown-item
                v-for="commandResult in commandSelector.collections.flat()"
                :key="commandResult.value"
                :class="{ 'select-blue': commandResult === commandSelector.current }"
              >
                <dropdown-item-button
                  class="grid grid-cols-1 text-left"
                  @click="onCommandClick({ block: currentBlock!, command: commandResult.raw, event: $event })"
                >
                  <h1 class="font-sans text-lg bold">
                    {{ commandResult.label }}
                  </h1>
                  <p
                    v-if="commandResult.raw.description"
                    class="text-gray-500"
                  >
                    {{ commandResult.raw.description }}
                  </p>
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
import Search from '@/structure/search.vue'
import { Item } from '@vuex-orm/core'
import { UBlockDirector } from 'Interfaces/blockInterfaces'
import { Block, BlockCommand, BlockCommandType, ContentAttachmentIdBlock, FindAttachmentReturn, TextBlock } from 'Interfaces/blockInterfacesGeneral'
import { FileUpload as IFileUpload } from 'Interfaces/fileUploadInterfaces'
import { Uploader as IUploader } from 'Interfaces/imageInterfaces'
import { SearchOptions, SearchResult, USearcher } from 'Interfaces/searchInterfaces'
import { USelector } from 'Interfaces/selectInterfaces'
import { debounce } from 'lodash'
import { defineComponent, nextTick } from 'vue'
import { mapActions, mapState, useStore } from 'vuex'
import { Command } from '~/enums/command'
import DynamicRecipe from '~/models/dynamicRecipe'
import FileUpload, { FileUploadAttributes } from '~/models/fileUpload'
import Tag, { RTag } from '~/models/tag'
import Tagging from '~/models/tagging'
import router from '~/router'
import { ApiPath } from '~/router/path'
import { StoreModulePath, stateKey } from '~/store'
import { RootState } from '~/store/interfaces'
import { DynamicRecipeActionTypes } from '~/store/modules/dynamicRecipes/actions'
import { FlashActionTypes } from '~/store/modules/flash'
import { ChoiceActionTypes } from '~/store/modules/interfaces/modules/choice'
import { ScaleActionTypes } from '~/store/modules/scale'
import { TagActionTypes } from '~/store/modules/tags/actions'
import Uploader from '~/uploaders/uploader'
import BlockDirector from '~/utils/blocks/blockDirector'
import Guid from '~/utils/guid'
import { HttpStatusCode } from '~/utils/httpUtils'
import Logger from '~/utils/logger'
import math from '~/utils/math'
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
  scaleDropdownState: boolean
  scaleSelector: USelector<{ label: string, value: string }[][]>
}

interface ScaleOption {
  label: string
  value: string
}

export default defineComponent({
  name: 'DynamicRecipeEdit',
  components: {
    Search,
  },
  props: {
    view: {
      type: String,
      default: 'show',
      validator: prop => typeof prop === 'string' && ['show', 'edit'].includes(prop),
    },
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
      scaleDropdownState: false,
      scaleSelector: new Selector<ScaleOption[][]>([[
        { value: '0.5', label: '1/2' },
        { value: '1', label: '1' },
        { value: '1.5', label: '1 1/2' },
        { value: '2', label: '2' },
      ]]),
    }
  },
  computed: {
    ...mapState(StoreModulePath.Interfaces + StoreModulePath.Choice, { currentChoice: 'current' }),
    ...mapState(StoreModulePath.Interfaces + StoreModulePath.Mode, { currentMode: 'current' }),
    ...mapState(StoreModulePath.Scale, { scale: 'scale' }),
    blocks: {
      get(): Block[] {
        if (!this.dynamicRecipe) return []

        return this.dynamicRecipe.blocks
      },
      set(value: Block[]) {
        if (!this.dynamicRecipe) return []

        this.dynamicRecipe.blocks = value
      },
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
      if (this.currentMode) return this.currentMode

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
      },
    },
    unmarkedTags(): Array<Tag> {
      return this.dynamicRecipe?.tags.filter(tag => {
        const tagging = this.dynamicRecipe?.taggings.find(tagging => tagging.tagId === tag.$id)
        return !tagging?.markedForDestruction
      }) || []
    },
    tagSearcher(): Searcher<Tag> {
      const options: SearchOptions<Tag> = {
        type: 'result',
        label: 'name',
        valueString: 'clientId',
        endpoint: ApiPath.base() + ApiPath.tags(),
      }
      if (this.dynamicRecipe) {
        options.query = {
          not: {
            client_id: this.dynamicRecipe.tags.map(tag => tag.clientId),
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
    canScale(): boolean {
      return this.isShowMode
    },
    scaleDisplay(): string | null {
      if (this.scale !== '1') {
        return math.format(math.parseUnit(this.scale, { unitFallback: 'scale' }), { unitTypeLess: true })
      } else {
        return null
      }
    },
  },
  watch: {
    textBlockAttached(newVal, _oldVal) {
      if (newVal) {
        this.textBlock = {
          id: Guid.create(),
          type: 'text',
          content: { text: '' },
        }
      }
    },
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
        this.dynamicRecipe = DynamicRecipe.query().whereId(clientId).with('attachments|tags|taggings').first()!
        if (!this.dynamicRecipe.blocks) this.dynamicRecipe.blocks = []
      } catch (e) {
        await this.$router.push({
          name: this.$routerExtension.names.DynamicRecipes,
        })
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { alert: 'Dynamic Recipe not found.' },
        })
        return
      }
    } else {
      this.dynamicRecipe = new DynamicRecipe({ ownerId: this.currentUser.clientId, owner: this.currentUser })
    }

    this.blockDirector = new BlockDirector<IFileUpload>({
      blocks: this.dynamicRecipe.blocks,
      findAttachment: this.findAttachment.bind(this),
      focus: async (block) => this.focusStepBlock(block, 0).get(0).focus(),
      focusAfter: this.focusAfter.bind(this),
      focusBefore: this.focusBefore.bind(this),
      onArrowDown: this.onArrowDown.bind(this),
      onArrowUp: this.onArrowUp.bind(this),
      onBackspace: this.onBackspace.bind(this),
      onDestroyAttachments: this.onDestroyAttachments.bind(this),
      onEnter: this.onEnter.bind(this),
      onImageUpload: this.onImageUpload.bind(this),
      onInput: this.onInput.bind(this),
      onSave: this.onSave.bind(this),
    })

    this.commandSearch = new Searcher({
      label: 'label',
      valueString: 'label',
      type: 'command',
      collection: () => {
        const allowableCommands: Array<BlockCommandType> = ['h1', 'h2', 'h3', 'text', 'columns', 'sidebar', 'image', 'ingredient']
        if (
          this.blockDirector.find(this.currentBlock?.parentId)?.type === 'column' ||
          (this.currentBlock?.type === 'sidebar' && this.blockDirector.find(this.currentBlock?.parentId)?.type === 'row')
        ) {
          allowableCommands.push('addColumn')
        }
        if (this.currentBlock?.type === 'text') {
          allowableCommands.push('number')
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
  methods: {
    ...mapActions(StoreModulePath.Interfaces + StoreModulePath.Choice, { unsetCurrentChoice: ChoiceActionTypes.UNSET }),
    ...mapActions(StoreModulePath.Scale, { setScaleState: ScaleActionTypes.SET }),
    getDynamicRecipe(): DynamicRecipe {
      const clientId = router.currentRoute.value.params.clientId
      this.dynamicRecipe = DynamicRecipe.query().whereId(clientId).with('attachments|tags|taggings').first()!
      return this.dynamicRecipe
    },
    async onImageUpload({ block, image }: { block: ContentAttachmentIdBlock, image: IUploader }) {
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
          contentType: null,
        })
        const imageJson = await imageResponse.json()
        await FileUpload.insertOrUpdate({ data: { id: imageJson.data.id, ...imageJson.data.attributes } })
        const imageUpload = FileUpload.find(imageJson.data.attributes.clientId!)!
        this.dynamicRecipe.attachments.push(imageUpload)
        const oldAttachmentId = block.content.attachmentId
        let oldAttachment: FileUpload | null = null
        block.content.attachmentId = imageUpload.clientId

        if (oldAttachmentId) {
          ({ attachment: oldAttachment } = this.findAttachment({ id: oldAttachmentId }))
          oldAttachment?.markForDestruction()
        }
        await this.save()
        if (oldAttachment) {
          const index = this.dynamicRecipe.attachments.indexOf(oldAttachment)
          if (index >= 0) this.dynamicRecipe.attachments.splice(index, 1)
        }
      }
    },
    findAttachment({ id }: { id: string | null | undefined }): FindAttachmentReturn<FileUpload> {
      if (!this.dynamicRecipe) return { attachment: null, url: null, alt: null }

      const attachment: FileUpload | null = this.dynamicRecipe.attachments.find(a => a.clientId === id) as FileUpload | null
      if (attachment) {
        return { attachment, url: ApiPath.base() + ApiPath.fileUpload(attachment.clientId), alt: this.dynamicRecipe.name }
      } else {
        return { attachment: null, url: null, alt: null }
      }
    },
    async onInput({ block, event, call }: { block: Block, event: InputEvent, call: () => void }) {
      if (!this.dynamicRecipe) return

      const data = event.data
      if (!this.dropdownState && data === '/') {
        this.openSearch({ block, data, call })
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
    },
    onEnter({ block, call, event, index }: { block: Block, event: KeyboardEvent, call: () => void, index: number | null }) {
      if (!this.dynamicRecipe) return

      if (this.dropdownState) {
        if (!this.commandSelector.current) return

        this.executeCommand({ block: this.currentBlock, command: this.commandSelector.current.raw, event, position: Math.max(0, (window?.getSelection()?.getRangeAt(0).startOffset ?? 0) - (this.q.length + 1)), index })
        this.focus(block)
        this.save()
        return
      }

      call()
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
    onBackspace({ call }: { block: Block, event: InputEvent, call: () => void }) {
      if (!this.dynamicRecipe) return
      if (this.dropdownState) return

      call()
    },
    async onDestroyAttachments({ block }: { block: ContentAttachmentIdBlock }) {
      const b: ContentAttachmentIdBlock = block
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
    onCommandClick({ block, command, event }: { block: Block, command: BlockCommand, event: MouseEvent }) {
      this.executeCommand({ block, command, event })
      this.focus(block)
      this.save()
    },
    async executeCommand({ block, command, event, position, index }: { block: Block | null, command: BlockCommand, event: Event, position?: number, index?: number | null }) {
      if (block === null) return

      if (block === this.textBlock) this.blockDirector.add(this.textBlock)
      command.call(block, { event, position, index })

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
      return $focusableRoot.is('[data-focus]') ? $focusableRoot : step > 0 ? $focusableRoot.find('[data-focus]').first() : $focusableRoot.find('[data-focus]').last()
    },
    openSearch({ block, call }: { block: Block, data: unknown, call: () => void }) {
      this.currentBlock = block
      this.dropdownState = true
      this.q = ''
      this.commandSearch.search(this.q)
      this.commandSelector.collections = [this.commandSearch.results]
      this.commandSelector.set(0)
      $(':focus').on('keydown.search', (event) => {
        if (event.key === 'Tab' || event.key === 'Escape') {
          $(event.target).off('keydown.search')
          this.closeSearch()
          call()
        }
      })
    },
    closeSearch() {
      this.dropdownState = false
      this.q = ''
      this.emptyCommandSearchTimes = 0
    },
    async updateSuccessful(response: Response) {
      const responseClone = response.clone()
      const json = await response.json()
      if (json?.error) {
        this.updateFailed(responseClone)
        return
      }
      if (response.status === HttpStatusCode.Created) {
        await this.$routerExtension.replace({ name: this.$routerExtension.names.EditDynamicRecipe, params: { clientId: this.dynamicRecipe!.clientId } })
      }
    },
    async updateFailed(response: Response) {
      const json = await response.json()
      this.processFailedUpdate(json?.error, { signOut: false })
    },
    async updateError(response: Response) {
      const json = await response.json()
      let errorText = json?.error
      const opts: { signOut: boolean | null } = { signOut: null }
      if (this.isCreateMode) {
        switch (json?.status) {
          case (HttpStatusCode.Unauthorized):
            opts.signOut = true
            break
          case (HttpStatusCode.Forbidden):
            errorText = errorText ?? 'You are not authorized to create this dynamic recipe.'
            break
          case (HttpStatusCode.NotFound):
            errorText = errorText ?? 'An unknown error occurred. Please contact the app admin.'
            break
          default:
            break
        }
      } else {
        switch (json?.status) {
          case (HttpStatusCode.Unauthorized):
            opts.signOut = true
            break
          case (HttpStatusCode.Forbidden):
            errorText = errorText ?? 'You are not authorized to update this dynamic recipe.'
            break
          default:
            opts.signOut = false
            break
        }
      }
      this.processFailedUpdate(errorText, opts)
    },
    processFailedUpdate(errorText: string | null | undefined, { signOut }: { signOut: boolean | null }) {
      // if (signOut) this.$store.commit(StoreModulePath.Session + SessionMutationTypes.SIGN_OUT)
      if (errorText) {
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { alert: errorText || 'An unknown error occurred' },
        })
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    save: debounce(async function (this: any) {
      let action: string
      if (this.isCreateMode) {
        action = StoreModulePath.DynamicRecipes + DynamicRecipeActionTypes.CREATE
      } else {
        action = StoreModulePath.DynamicRecipes + DynamicRecipeActionTypes.UPDATE
      }
      await Promise.all(Tag.query().where('id', null).get().map(tag => {
        return this.$store.dispatch(StoreModulePath.Tags + TagActionTypes.CREATE, tag)
      }))
        .then((responses: Response[]) => {
          const badResponse = responses.filter(response => !response.ok)[0]
          if (badResponse) {
            this.updateError(badResponse)
            return Promise.reject(badResponse)
          }
        })
        .then(() => {
          this.$store.dispatch(action, this.dynamicRecipe)
            .then((response: unknown) => this.updateSuccessful(response))
            .catch((error: unknown) => this.updateError(error))
        })
    }, 500),
    async onSave() {
      await this.save()
    },
    async addTag(item: { data: SearchResult<RTag, 'result'> | SearchResult<{ command: Command, name: string }, 'command'> }) {
      if (!this.dynamicRecipe) return
      let tag: Item<Tag> = null
      if (item.data.type === 'command') {
        if (item.data.raw.command) {
          tag = (await Tag.insertOrUpdate({ data: { name: item.data.value.trim() } })).Tag[0] as Item<Tag>
        }
      } else {
        await Tag.insertOrUpdate({ data: item.data.raw })
        tag = Tag.find(item.data.value)
      }

      if (tag) {
        if (!this.dynamicRecipe.tags.find(c => c.clientId === tag!.clientId)) {
          this.dynamicRecipe.tags.push(tag)
        }

        const taggingId = [tag.clientId, this.dynamicRecipe.clientId]

        await Tagging.insertOrUpdate({
          data: {
            tagId: tag.clientId,
            taggableId: this.dynamicRecipe.clientId,
            taggableType: this.dynamicRecipe.selfClass.modelName,
          },
        })
        const tagging = Tagging.find(taggingId)
        if (tagging) {
          const dynamicRecipeTagging = this.dynamicRecipe.taggings.find(x => x.$id === tagging.$id)
          if (dynamicRecipeTagging) {
            dynamicRecipeTagging.unmarkForDestruction()
          } else {
            this.dynamicRecipe.taggings.push(tagging)
          }
        }
      }
      this.save()
    },
    destroyTagging(item: Tag) {
      if (this.dynamicRecipe) {
        const tagging = this.dynamicRecipe.taggings.find(tagging => tagging.tagId === item.$id)
        const tag = this.dynamicRecipe.tags.find(tag => tag.$id === item.$id)
        if (tag) {
          const tagIndex = this.dynamicRecipe.tags.indexOf(tag)
          this.dynamicRecipe.tags.splice(tagIndex, 1)
        }
        if (tagging) {
          tagging.markForDestruction()
        } else {
          Logger.warn('Tagging not found!')
        }
      }
      this.save()
    },
    onScaleClick(scale: ScaleOption) {
      this.setScale(scale.value)
    },
    onScaleEnter(event: KeyboardEvent) {
      const target = event.target as HTMLInputElement
      this.setScale(target.value)
    },
    setScale(scale: string) {
      this.scaleDropdownState = false
      this.setScaleState(scale)
    },
  },
})
</script>
