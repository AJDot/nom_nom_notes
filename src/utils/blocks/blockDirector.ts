import { Block, BlockCommandDict, BlockDirectorOptions, ColumnBlock, TextBlock } from '~/interfaces/blockInterfaces'
import assertNever from '../assertNever'
import Guid from '../guid'
import { UBlockCaptain, UBlockDirector } from './../../interfaces/blockInterfaces'
import ColumnBlockCaptain from './columnBlockCaptain'
import H1BlockCaptain from './h1BlockCaptain'
import H2BlockCaptain from './h2BlockCaptain'
import H3BlockCaptain from './h3BlockCaptain'
import RowBlockCaptain from './rowBlockCaptain'
import TextBlockCaptain from './textBlockCaptain'

export default class BlockDirector implements UBlockDirector {
  readonly COMMANDS: BlockCommandDict = {
    h1: { label: 'H1', call: block => block.type = 'h1' },
    h2: { label: 'H2', call: block => block.type = 'h2' },
    h3: { label: 'H3', call: block => block.type = 'h3' },
    text: {
      label: 'Text',
      call: block => {
        block.type = 'text'
        const children = this.childrenFor(block)
        if (children.length) {
          block.content.text += '\n' + children.map(b => b.content.text).join('\n')
        }
        for (const child of children) {
          this.destroy(child)
        }
      },
    },
    columns: {
      label: 'Columns',
      call: block => {
        const oldType = block.type
        const oldText = block.content.text
        block.type = 'row'
        const column1: ColumnBlock = { id: Guid.create(), type: 'column', content: { text: '' }, parentId: block.id }
        const text1: Block = { id: Guid.create(), type: oldType, content: { text: oldText }, parentId: column1.id }
        const column2: ColumnBlock = { id: Guid.create(), type: 'column', content: { text: '' }, parentId: block.id }
        const text2: TextBlock = { id: Guid.create(), type: 'text', content: { text: '' }, parentId: column2.id }
        this.blocks.splice(this.indexOf(block)! + 1, 0, column1, column2, text1, text2)
        block.content.text = ''
      },
    },
    addColumn: {
      label: 'Add Column',
      call: block => {
        const column = this.find(block.parentId)!
        const newColumn: ColumnBlock = { id: Guid.create(), type: 'column', content: { text: '' } }
        const newText: TextBlock = { id: Guid.create(), type: 'text', content: { text: '' } }
        this.addAfter(newColumn, column)
        this.add(newText)
        this.moveInside(newText, newColumn)
      }
    },
  }

  constructor(private readonly options: BlockDirectorOptions) {
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

  indexOf(block: Block): number | null {
    const index = this.blocks.indexOf(block)
    return index >= 0 ? index : null
  }

  isEmpty(block: Block): boolean {
    return !block.content.text && this.childrenFor(block).length === 0
  }

  move(block: Block, to: Block) {
    let moveIndex: number | null = this.indexOf(block)
    let toIndex: number | null = this.indexOf(to)
    if (moveIndex === null || toIndex === null) return

    this.blocks.splice(toIndex, 0, this.blocks.splice(moveIndex, 1)[0])
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

  onEnter({ block, event }: { block: Block; event: KeyboardEvent }): void {
    if (this.options.onEnter) {
      this.options.onEnter({ block, event, call: () => this.onEnterDefault({ block, event }) })
    } else {
      this.onEnterDefault({ block, event })
    }
  }

  async onInput({ block, event }: { block: Block; event: InputEvent }) {
    if (this.options.onInput) {
      this.options.onInput({ block, event, call: () => this.onInputDefault({ block, event }) })
    } else {
      this.onInputDefault({ block, event })
    }
  }

  onMove({ move, to }: { move: Block , to: Block }) {
    if (this.options.onMove) {
      this.options.onMove({ move, to, call: () => this.onMoveDefault({ move, to }), })
    } else {
      this.onMoveDefault({ move, to })
    }
  }

  set(blocks: Block[]): void {
    this.options.blocks = blocks
  }

  captainFor(block: Block): UBlockCaptain {
    switch (block.type) {
      case 'h1':
        return new H1BlockCaptain(block, this)
      case 'h2':
        return new H2BlockCaptain(block, this)
      case 'h3':
        return new H3BlockCaptain(block, this)
      case 'text':
        return new TextBlockCaptain(block, this)
      case 'row':
        return new RowBlockCaptain(block, this)
      case 'column':
        return new ColumnBlockCaptain(block, this)
      default:
        assertNever(block)
    }
  }

  private onArrowDownDefault({ block, event }: { block: Block; event: KeyboardEvent }) {
  }

  private onArrowUpDefault({ block, event }: { block: Block; event: KeyboardEvent }) {
  }

  private onBackspaceDefault({ block, event }: { block: Block; event: InputEvent }) {
    return this.destroy(block)
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

  private onInputDefault({ block, event }: { block: Block; event: InputEvent }) {
    this.captainFor(block).onInput({ event })
  }

  private onMoveDefault({ move, to }: { move: Block, to: Block }): void {
    this.captainFor(to).onMove({block: move})
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
