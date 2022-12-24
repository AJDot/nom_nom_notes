<template>
  <form v-if="dynamicRecipe" class="mx-3" @submit.prevent>
    <section class="max-w-screen-lg p-2.5 mx-auto mb-8 rounded-2xl shadow-card grid grid-cols-1 gap-x-4 sm:grid-cols-2">
      <dl class="mt-2 mb-4 sm:col-span-2">
        <dt class="text-lg border-b border-gray-400 mb-2"><label for="name">Name</label></dt>
        <dd>
          <a-input id="name" v-model="dynamicRecipeName" type="text" name="name" placeholder="My Super Awesome Recipe" />
        </dd>
      </dl>
      <div class="sm:col-span-2">
        <base-block-group :blocks="topLevelBlocks" :director="blockDirector" draggable droppable />
        <base-block v-if="!blockDirector.find(textBlock.id)" :block="textBlock" :director="blockDirector" />
        <dropdown :state="dropdownState" position-type="cursor">
          <ul>
            <template v-if="commandSelector.collections.some(c => c.length)">
              <dropdown-item v-for="commandResult in commandSelector.collections.flat()" :class="{ 'select-blue': commandResult === commandSelector.current }">
                <dropdown-item-button @click="onCommandClick({ block: currentBlock!, command: commandResult.raw })">
                  {{ commandResult.label }}
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
import { AxiosError, AxiosResponse } from 'axios'
import { Block, BlockCommand, TextBlock, UBlockDirector } from 'Interfaces/blockInterfaces'
import { defineComponent, nextTick } from 'vue'
import { useStore } from 'vuex'
import { SearchResult, USearcher } from '~/interfaces/searchInterfaces'
import { USelector } from '~/interfaces/selectInterfaces'
import { default as DynamicRecipe, default as dynamicRecipe } from '~/models/dynamicRecipe'
import router from '~/router'
import { stateKey, StoreModulePath } from '~/store'
import { RootState } from '~/store/interfaces'
import { DynamicRecipeActionTypes } from '~/store/modules/dynamicRecipes/actions'
import { FlashActionTypes } from '~/store/modules/flash'
import { SessionMutationTypes } from '~/store/modules/sessions/mutations'
import BlockDirector from '~/utils/blocks/blockDirector'
import Guid from '~/utils/guid'
import { HttpStatusCode } from '~/utils/httpUtils'
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
    mode(): 'create' | 'edit' {
      return this.dynamicRecipe?.id ? 'edit' : 'create'
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
    onArrowDown({ block }) {
      if (!this.dynamicRecipe) return

      if (this.dropdownState) {
        this.commandSelector.down()
        return
      }

      this.focusAfter(block)
    },
    onArrowUp({ block }) {
      if (!this.dynamicRecipe) return

      if (this.dropdownState) {
        this.commandSelector.up()
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
    onDestroy({ block, call }: { block: Block, call: Function }) {
      call()
      this.save()
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
      const text = block.content.text
      block.content.text = text + ' '
      await nextTick()
      block.content.text = text

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
      const $focusables = $('[data-id]:not([data-focusable="false"])')
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
    save() {
      let action: string
      if (this.mode === 'create') {
        action = StoreModulePath.DynamicRecipes + DynamicRecipeActionTypes.CREATE
      } else {
        action = StoreModulePath.DynamicRecipes + DynamicRecipeActionTypes.UPDATE
      }
      this.$store.dispatch(action, this.dynamicRecipe)
        .then((response) => this.updateSuccessful(response))
        .catch((error) => this.updateError(error))
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
        this.dynamicRecipe = DynamicRecipe.query().whereId(clientId).first()!
        if (!this.dynamicRecipe.blocks) this.dynamicRecipe.blocks = []
        if (this.dynamicRecipe.blocks.length === 0) {
          this.dynamicRecipe.blocks.push(
            { id: Guid.create(), type: 'h1', content: { text: 'My First Block' } }
          )
        }

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
      this.dynamicRecipe = new DynamicRecipe({
        blocks: [
          { id: Guid.create(), type: 'h1', content: { text: 'My First Block' } }
        ]
      })
    }

    this.blockDirector = new BlockDirector({
      blocks: this.dynamicRecipe.blocks,
      onArrowDown: this.onArrowDown.bind(this),
      onArrowUp: this.onArrowUp.bind(this),
      onBackspace: this.onBackspace.bind(this),
      onCreate: this.onCreate.bind(this),
      onDelete: this.onDelete.bind(this),
      onDestroy: this.onDestroy.bind(this),
      onEnter: this.onEnter.bind(this),
      onInput: this.onInput.bind(this),
      onMove: this.onMove.bind(this),
    })

    this.commandSearch = new Searcher({
      label: 'label',
      valueString: 'label',
      type: 'command',
      collection: () => {
        const allowableCommands: Array<BlockDirector['COMMANDS'][number]['label']> = ['H1', 'H2', 'H3', 'Text', 'Columns']
        if (this.blockDirector.find(this.currentBlock?.parentId)?.type === 'column')  {
          allowableCommands.push('Add Column')
        }
        return this.blockDirector.COMMANDS.filter(c => allowableCommands.includes(c.label))
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
