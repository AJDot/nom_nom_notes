import { AllBlock, Block, BlockCommandDict, BlockDirector as GBLockDirector, BlockDirectorOptions, ColumnBlock, ContentAttachmentIdBlock, FindAttachmentReturn, ImageBlock, RowBlock, TextBlock, UBlockCaptain } from '~/interfaces/blockInterfacesGeneral'
import { Uploader } from '~/interfaces/imageInterfaces'
import { ObjectUtils } from '~/utils/objectUtils'
import assertNever from '../assertNever'
import Guid from '../guid'
import ColumnBlockCaptain from './columnBlockCaptain'
import H1BlockCaptain from './h1BlockCaptain'
import H2BlockCaptain from './h2BlockCaptain'
import H3BlockCaptain from './h3BlockCaptain'
import ImageBlockCaptain from './imageBlockCaptain'
import RowBlockCaptain from './rowBlockCaptain'
import SidebarBlockCaptain from './sidebarBlockCaptain'
import TextBlockCaptain from './textBlockCaptain'

export default class BlockDirector<FType> implements GBLockDirector<FType> {
  readonly COMMANDS: BlockCommandDict = {
    h1: {
      label: 'H1',
      description: 'Turn into large heading',
      call: block => block.type = 'h1'
    },
    h2: {
      label: 'H2',
      description: 'Turn into medium heading',
      call: block => block.type = 'h2'
    },
    h3: {
      label: 'H3',
      description: 'Turn into small heading',
      call: block => block.type = 'h3'
    },
    text: {
      label: 'Text',
      description: 'Turn into plain text',
      call: block => block.type = 'text'
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
      }
    },
    sidebar: {
      label: 'Sidebar',
      description: 'Link a block to reveal in a side panel. Place beside a column to display with full column height',
      call: block => block.type = 'sidebar'
    },
    image: {
      label: 'Image',
      description: 'Upload an image',
      call: block => {
        const newImage: ImageBlock = { id: Guid.create(), type: 'image', content: { attachmentId: null } }
        this.addAfter(newImage, block)
      }
    }
  }

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
    let index: number | null = children.length ? this.indexOf(children[children.length - 1])! + 1 : this.blocks.length
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
  destroy(block: Block, direction: 'down' | 'up' | 'both' = 'both') {
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
    if (this.options.findAttachment) {
      return this.options.findAttachment({ id })
    } else {
      return this.findAttachmentDefault({ id })
    }
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

  indexOf(block: Block): number | null {
    const index = this.blocks.indexOf(block)
    return index >= 0 ? index : null
  }

  isEmpty(block: AllBlock): boolean {
    if (ObjectUtils.dig(block, 'content', 'text')) return false

    return this.childrenFor(block).length === 0
  }

  move(block: Block, to: Block) {
    let moveIndex: number | null = this.indexOf(block)
    if (moveIndex === null) return
    const moved = this.blocks.splice(moveIndex, 1)[0]
    let toIndex: number | null = this.indexOf(to)
    if (toIndex === null) toIndex = moveIndex

    this.blocks.splice(toIndex, 0, moved)
    block.parentId = to.parentId
  }

  moveInside(block: Block, to: Block) {
    let moveIndex: number | null = this.indexOf(block)
    const children = this.childrenFor(to)
    let toIndex: number | null = children.length ? this.indexOf(children[children.length - 1])! + 1 : this.blocks.length
    if (moveIndex === null || toIndex === null) return

    this.blocks.splice(toIndex, 0, this.blocks.splice(moveIndex, 1)[0])
    block.parentId = to.id
  }

  async onDrop({ moveBlockId, toBlockId, }: { moveBlockId: string, toBlockId: string }) {
    if (this.options.onDrop) {
      this.options.onDrop({ moveBlockId, toBlockId, call: () => this.onDropDefault({ moveBlockId, toBlockId }) })
    } else {
      this.onDropDefault({ moveBlockId, toBlockId })
    }
  }

  onArrowDown({ block, event }: { block: Block; event: KeyboardEvent }): void {
    if (this.options.onArrowDown) {
      this.options.onArrowDown({ block, event, call: () => this.onArrowDownDefault({ block, event }) })
    } else {
      this.onArrowDownDefault({ block, event })
    }
  }

  onArrowUp({ block, event }: { block: Block; event: KeyboardEvent }): void {
    if (this.options.onArrowUp) {
      this.options.onArrowUp({ block, event, call: () => this.onArrowUpDefault({ block, event }) })
    } else {
      this.onArrowUpDefault({ block, event })
    }
  }

  onBackspace({ block, event }: { block: Block; event: InputEvent }) {
    if (this.options.onBackspace) {
      this.options.onBackspace({ block, event, call: () => this.onBackspaceDefault({ block, event }) })
    } else {
      this.onBackspaceDefault({ block, event })
    }
  }

  onCreate({ block, inside }: { block: Block, inside?: Block }) {
    if (this.options.onCreate) {
      this.options.onCreate({ block, inside, call: () => this.onCreateDefault({ block, inside }) })
    } else {
      this.onCreateDefault({ block, inside })
    }
  }

  onDelete({ block, event }: { block: Block, event: InputEvent }) {
    if (this.options.onDelete) {
      this.options.onDelete({ block, event, call: () => this.onDeleteDefault({ block, event }) })
    } else {
      this.onDeleteDefault({ block, event })
    }
  }

  onDestroy({ block }: { block: Block }) {
    if (this.options.onDestroy) {
      this.options.onDestroy({ block, call: () => this.onDestroyDefault({ block }) })
    } else {
      this.onDestroyDefault({ block })
    }
  }

  onEnter({ block, event }: { block: Block, event: KeyboardEvent }): void {
    if (this.options.onEnter) {
      this.options.onEnter({ block, event, call: () => this.onEnterDefault({ block, event }) })
    } else {
      this.onEnterDefault({ block, event })
    }
  }

  onChoose({ block, event, choice }: { block: Block, event: PointerEvent, choice: { type: string, args: [Block] } }) {
    if (this.options.onChoose) {
      this.options.onChoose({ block, event, choice, call: () => this.onChooseDefault({ block, event, choice }) })
    } else {
      this.onChooseDefault({ block, event, choice })
    }
  }

  onClick({ block, event }: { block: Block; event: PointerEvent }) {
    if (this.options.onClick) {
      this.options.onClick({ block, event, call: () => this.onClickDefault({ block, event }) })
    } else {
      this.onClickDefault({ block, event })
    }
  }

  async onImageUpload({ block, image }: { block: ContentAttachmentIdBlock; image: Uploader }) {
    if (this.options.onImageUpload) {
      this.options.onImageUpload({ block, image, call: () => this.onImageUploadDefault({ block, image }) })
    } else {
      this.onImageUploadDefault({ block, image })
    }
  }

  async onInput({ block, event }: { block: Block; event: InputEvent }) {
    if (this.options.onInput) {
      this.options.onInput({ block, event, call: () => this.onInputDefault({ block, event }) })
    } else {
      this.onInputDefault({ block, event })
    }
  }

  onMove({ move, to }: { move: Block, to: Block }) {
    if (this.options.onMove) {
      this.options.onMove({ move, to, call: () => this.onMoveDefault({ move, to }), })
    } else {
      this.onMoveDefault({ move, to })
    }
  }

  set(blocks: Block[]): void {
    this.options.blocks = blocks
  }

  captainFor(block: Block): UBlockCaptain<Block, FType> {
    switch (block.type) {
      case 'h1':
        return new H1BlockCaptain<FType>(block, this)
      case 'h2':
        return new H2BlockCaptain<FType>(block, this)
      case 'h3':
        return new H3BlockCaptain<FType>(block, this)
      case 'text':
        return new TextBlockCaptain<FType>(block, this)
      case 'row':
        return new RowBlockCaptain<FType>(block, this)
      case 'column':
        return new ColumnBlockCaptain<FType>(block, this)
      case 'sidebar':
        return new SidebarBlockCaptain<FType>(block, this)
      case 'image':
        return new ImageBlockCaptain<FType>(block, this)
      default:
        assertNever(block)
    }
  }

  private findAttachmentDefault({ id }: { id: string | null | undefined }): FindAttachmentReturn<FType> {
    return { attachment: null, url: null }
  }

  private onArrowDownDefault({ block, event }: { block: Block, event: KeyboardEvent }) {
  }

  private onArrowUpDefault({ block, event }: { block: Block, event: KeyboardEvent }) {
  }

  private onBackspaceDefault({ block, event }: { block: Block, event: InputEvent }) {
    return this.destroy(block)
  }

  private onChooseDefault({ block, event, choice }: { block: Block, event: PointerEvent, choice: { type: string, args: [Block] } }) {
    this.captainFor(block).onChoose({ event, choice })
  }

  private onClickDefault({ block, event }: { block: Block; event: PointerEvent }) {
  }

  private onDeleteDefault({ block, event }: { block: Block; event: InputEvent }) {
    return this.destroy(block)
  }

  private onDestroyDefault({ block }: { block: Block }) {
    return this.destroy(block, 'down')
  }

  private onEnterDefault({ block, event }: { block: Block; event: KeyboardEvent }) {
    this.captainFor(block).onEnter({ event })
  }

  private onImageUploadDefault({ block, image }: { block: Block; image: Uploader }) {
  }

  private onInputDefault({ block, event }: { block: Block; event: InputEvent }) {
    this.captainFor(block).onInput({ event })
  }

  private onMoveDefault({ move, to }: { move: Block, to: Block }): void {
    this.captainFor(to).onMove({ block: move })
  }

  private onDropDefault({ moveBlockId, toBlockId, }: { moveBlockId: string, toBlockId: string }) {
    const moveBlock = this.find(moveBlockId)
    const toBlock = this.find(toBlockId)
    if (moveBlock && toBlock)
      this.onMove({ move: moveBlock, to: toBlock })
  }

  private onCreateDefault({ block, inside }: { block: Block, inside?: Block }) {
    if (inside) {
      this.addAfter(block, inside)
      this.moveInside(block, inside)
    } else {
      this.add(block)
    }
  }
}
