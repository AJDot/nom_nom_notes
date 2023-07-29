import { Block, BlockCommandDict, BlockDirector as GBlockDirector, BlockDirectorOptions, ColumnBlock, ContentAttachmentIdBlock, FindAttachmentReturn, ImageBlock, IngredientBlock, NumberBlock, RowBlock, TextBlock } from 'Interfaces/blockInterfacesGeneral'
import Uploader from '~/uploaders/uploader'
import { ObjectUtils } from '~/utils/objectUtils'
import assertNever from '../assertNever'
import Guid from '../guid'
import { TBlockCaptain } from './../../interfaces/blockInterfacesGeneral'
import ColumnBlockCaptain from './columnBlockCaptain'
import H1BlockCaptain from './h1BlockCaptain'
import H2BlockCaptain from './h2BlockCaptain'
import H3BlockCaptain from './h3BlockCaptain'
import ImageBlockCaptain from './imageBlockCaptain'
import IngredientBlockCaptain from './ingredientBlockCaptain'
import NumberBlockCaptain from './numberBlockCaptain'
import RowBlockCaptain from './rowBlockCaptain'
import SidebarBlockCaptain from './sidebarBlockCaptain'
import TextBlockCaptain from './textBlockCaptain'

export default class BlockDirector<FType> implements GBlockDirector<FType> {
  readonly COMMANDS: BlockCommandDict = {
    h1: {
      label: 'H1',
      description: 'Turn into large heading',
      call: block => {
        block.type = 'h1'
      },
    },
    h2: {
      label: 'H2',
      description: 'Turn into medium heading',
      call: block => {
        block.type = 'h2'
      },
    },
    h3: {
      label: 'H3',
      description: 'Turn into small heading',
      call: block => {
        block.type = 'h3'
      },
    },
    text: {
      label: 'Text',
      description: 'Turn into plain text',
      call: block => {
        block.type = 'text'
      },
    },
    columns: {
      label: 'Columns',
      description: 'Turn into two columns',
      call: (block: Block) => {
        const row: RowBlock = { id: Guid.create(), type: 'row' }
        const column1: ColumnBlock = { id: Guid.create(), type: 'column' }
        const column2: ColumnBlock = { id: Guid.create(), type: 'column' }
        const text2: TextBlock = { id: Guid.create(), type: 'text', content: { text: '' } }
        this.addBefore(row, block)
        this.addInside(column1, row)
        this.moveInside(block, column1)
        this.addInside(column2, row)
        this.addInside(text2, column2)
      },
    },
    addColumn: {
      label: 'Add Column',
      description: 'Tack on another column',
      call: block => {
        const row = this.findNearest(block, 'row')!
        const newColumn: ColumnBlock = { id: Guid.create(), type: 'column' }
        const newText: TextBlock = { id: Guid.create(), type: 'text', content: { text: '' } }
        this.add(newColumn)
        this.moveInside(newColumn, row)
        this.add(newText)
        this.moveInside(newText, newColumn)
      },
    },
    sidebar: {
      label: 'Sidebar',
      description: 'Link a block to reveal in a side panel. Place beside a column to display with full column height',
      call: block => {
        block.type = 'sidebar'
      },
    },
    image: {
      label: 'Image',
      description: 'Upload an image',
      call: block => {
        const newImage: ImageBlock = { id: Guid.create(), type: 'image', content: { attachmentId: null } }
        this.addAfter(newImage, block)
      },
    },
    ingredient: {
      label: 'Ingredient',
      description: 'Add an ingredient',
      call: block => {
        block.type = 'ingredient'
        const ingredientBlock: IngredientBlock = block as IngredientBlock
        ingredientBlock.content = { quantity: '', name: ingredientBlock.content.text, text: '' }
      },
    },
    number: {
      label: 'Number',
      description: 'Scaleable number',
      call: (block: TextBlock, payload: { position?: number }) => {
        const position = payload.position
        const blockParent = this.find(block.parentId)
        const parentBlock = blockParent?.type === 'text' ? blockParent : block
        const numberBlock: NumberBlock = { id: Guid.create(), type: 'number', content: { text: '' } }
        this.addInside(numberBlock, parentBlock)

        const left = block.content.text.slice(0, position)
        const right = block.content.text.slice(position)
        block.content.text = left
        if (right) {
          const textBlockRight: TextBlock = { id: Guid.create(), type: 'text', content: { text: right } }
          this.addInside(textBlockRight, parentBlock)
        }
      },
    },
  }

  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly options: BlockDirectorOptions<FType>) {
  }

  get blocks() {
    return this.options.blocks
  }

  add(newBlock: Block): void {
    this.blocks.push(newBlock)
  }

  addAfter(newBlock: Block, block: Block): void {
    const index = this.blocks.indexOf(block)
    this.blocks.splice(index + 1, 0, newBlock)
    newBlock.parentId = block.parentId
  }

  addBefore(newBlock: Block, block: Block): void {
    const index = this.blocks.indexOf(block)
    this.blocks.splice(index, 0, newBlock)
    newBlock.parentId = block.parentId
  }

  addInside(newBlock: Block, block: Block): void {
    const children = this.childrenFor(block)
    const index: number | null = children.length ? this.indexOf(children[children.length - 1])! + 1 : this.blocks.length
    this.blocks.splice(index, 0, newBlock)
    newBlock.parentId = block.id
  }

  ancestors(block: Block): Block[] {
    const ancestors: Block[] = []
    let currentBlock: Block | null = block
    while (currentBlock) {
      const parent = this.find(currentBlock.parentId)
      if (parent) ancestors.push(parent)
      currentBlock = parent
    }

    return ancestors
  }

  blockAfter(block: Block): Block | null {
    const index = this.indexOf(block)
    if (index === null) return null

    return this.blocks[index + 1] || null
  }

  blockBefore(block: Block): Block | null {
    const index = this.indexOf(block)
    if (index === null) return null

    return this.blocks[index - 1] || null
  }

  childrenFor(block: Block | null): Array<Block> {
    if (block === null) {
      return this.blocks.filter(b => !b.parentId)
    } else {
      return this.blocks.filter(b => b.parentId === block.id)
    }
  }

  /**
   * Destroy a block
   * Crawl up tree and destroy childless parents of +block+ until parent with child is found
   * Crawl down tree and destroy all children of +block+
   *
   * @param block {Block} lowest level block to destroy
   * @param direction {'down' | 'up' | 'both'} crawl up/down/both the tree to destroy childless parents and/or children of +block+
   * @returns {Boolean} successful operation
   */
  destroy(block: Block, direction: 'down' | 'up' | 'both' = 'both'): boolean {
    const destroyChildlessParents = ['up', 'both'].includes(direction)
    const destroyChildren = ['down', 'both'].includes(direction)

    const index = this.indexOf(block)
    if (index === null) return false

    this.blocks.splice(index, 1)

    if (destroyChildlessParents && block.parentId) {
      const parent = this.find(block.parentId)
      if (parent && this.childrenFor(parent).length === 0) this.destroy(parent, 'up')
    }

    if (destroyChildren) {
      for (const child of this.childrenFor(block)) {
        this.destroy(child, 'down')
      }
    }

    return true
  }

  destroyAll(...blocks: Array<Block>) {
    return blocks.map(block => this.destroy(block))
  }

  find(id: string | null | undefined): Block | null {
    if (!id) return null

    return this.blocks.find(block => block.id === id) || null
  }

  findAttachment({ id }: { id: string }): FindAttachmentReturn<FType> {
    return this.options.findAttachment({ id })
  }

  findNearest<T extends Block['type']>(block: Block, type: T): Extract<Block, { type: T }> | null {
    let currentBlock: Block | null = block
    while (currentBlock) {
      const parent = this.find(currentBlock.parentId)
      if (parent?.type === type) return parent as Extract<Block, { type: T }>
      currentBlock = parent
    }
    return null
  }

  findWhere<T extends Record<string, unknown>>(criteria: T, opts?: { order?: 'display' }): Extract<Block, T>[] {
    opts = opts ?? {}
    opts.order = opts.order ?? 'display'

    return this.order('display').filter<Extract<Block, T>>((block => {
      for (const [key, value] of Object.entries(criteria)) {
        const keys = key.split('.')
        if (value !== ObjectUtils.dig(block, ...keys)) {
          return false
        }
      }
      return true
    }) as ((block: Block) => block is Extract<Block, T>))
  }

  async focus(block: Block) {
    await this.options.focus(block)
  }

  async focusAfter(block: Block) {
    await this.options.focusAfter(block)
  }

  async focusBefore(block: Block) {
    await this.options.focusBefore(block)
  }

  indexOf(block: Block): number | null {
    const index = this.blocks.indexOf(block)
    return index >= 0 ? index : null
  }

  isEmpty(block: Block): boolean {
    return this.captainFor(block).isEmpty
  }

  move(block: Block, to: Block) {
    const moveIndex: number | null = this.indexOf(block)
    if (moveIndex === null) return
    const moved = this.blocks.splice(moveIndex, 1)[0]
    let toIndex: number | null = this.indexOf(to)
    if (toIndex === null) toIndex = moveIndex

    this.blocks.splice(toIndex, 0, moved)
    block.parentId = to.parentId
  }

  moveInside(block: Block, to: Block) {
    const moveIndex: number | null = this.indexOf(block)
    const children = this.childrenFor(to)
    const toIndex: number | null = children.length ? this.indexOf(children[children.length - 1])! + 1 : this.blocks.length
    if (moveIndex === null || toIndex === null) return

    this.blocks.splice(toIndex, 0, this.blocks.splice(moveIndex, 1)[0])
    block.parentId = to.id
  }

  onArrowDown({ block, event }: { block: Block, event: KeyboardEvent }): void {
    this.options.onArrowDown({ block, event })
  }

  onArrowUp({ block, event }: { block: Block, event: KeyboardEvent }): void {
    this.options.onArrowUp({ block, event })
  }

  onBackspace({ block, event, call }: { block: Block, event: InputEvent, call: () => void }) {
    this.options.onBackspace({ block, event, call })
  }

  onCreate({ block, inside }: { block: Block, inside?: Block }) {
    if (inside) {
      this.addAfter(block, inside)
      this.moveInside(block, inside)
    } else {
      this.add(block)
    }
  }

  async onDestroyAttachments({ block }: { block: Block }) {
    return this.options.onDestroyAttachments({ block })
  }

  onEnter({ block, event, call }: { block: Block, event: KeyboardEvent, call: () => void }): void {
    this.options.onEnter({ block, event, call })
  }

  onChoose({ block, event, choice }: { block: Block, event: PointerEvent, choice: { type: string, args: [Block] } }) {
    this.captainFor(block).onChoose({ event, choice })
  }

  async onImageUpload({ block, image }: { block: ContentAttachmentIdBlock, image: Uploader }) {
    this.options.onImageUpload({ block, image })
  }

  async onInput({ block, event, call }: { block: Block, event: InputEvent, call: () => void }) {
    this.options.onInput({ block, event, call })
  }

  onMove(data: ({ move: Block } | { moveId: string }) & ({ to: Block } | { toId: string })) {
    const move: Block | null = 'moveId' in data ? this.find(data.moveId) : data.move
    const to: Block | null = 'toId' in data ? this.find(data.toId) : data.to
    if (move && to) {
      this.captainFor(to).onMove({ block: move })
    }
  }

  onSave() {
    this.options.onSave()
  }

  order(order: 'display', blocks: Block[] = this.blocks.filter(b => !b.parentId)): Block[] {
    if (blocks.length === 0) {
      return []
    } else if (blocks.length === 1) {
      const block = blocks[0]
      return [block, ...this.order(order, this.childrenFor(block))].flat()
    } else {
      return blocks.map(b => this.order(order, [b])).flat()
    }
  }

  set(blocks: Block[]): void {
    this.options.blocks = blocks
  }

  captainFor<B extends Block>(block: B): TBlockCaptain<B, FType> {
    switch (block.type) {
      case 'h1':
        return new H1BlockCaptain<FType>(block, this) as TBlockCaptain<B, FType>
      case 'h2':
        return new H2BlockCaptain<FType>(block, this) as TBlockCaptain<B, FType>
      case 'h3':
        return new H3BlockCaptain<FType>(block, this) as TBlockCaptain<B, FType>
      case 'text':
        return new TextBlockCaptain<FType>(block, this) as TBlockCaptain<B, FType>
      case 'row':
        return new RowBlockCaptain<FType>(block, this) as TBlockCaptain<B, FType>
      case 'column':
        return new ColumnBlockCaptain<FType>(block, this) as TBlockCaptain<B, FType>
      case 'sidebar':
        return new SidebarBlockCaptain<FType>(block, this) as TBlockCaptain<B, FType>
      case 'image':
        return new ImageBlockCaptain<FType>(block, this) as TBlockCaptain<B, FType>
      case 'ingredient':
        return new IngredientBlockCaptain<FType>(block, this) as TBlockCaptain<B, FType>
      case 'number':
        return new NumberBlockCaptain<FType>(block, this) as TBlockCaptain<B, FType>
      default:
        assertNever(block)
    }
  }
}
