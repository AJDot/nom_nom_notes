import { Block, BlockDirector, ColumnBlock, ContentBlockIdBlock, SidebarBlock, TextBlock, USidebarBlockCaptain } from 'Interfaces/blockInterfacesGeneral'
import assertNever from '../assertNever'
import Guid from '../guid'
import { ObjectUtils } from '../objectUtils'
import { RowBlock } from './../../interfaces/blockInterfacesGeneral'

export default class SidebarBlockCaptain<FType> implements USidebarBlockCaptain<FType> {
  // eslint-disable-next-line no-useless-constructor
  constructor(public block: SidebarBlock, public director: BlockDirector<FType>) {
  }

  get isEmpty(): boolean {
    if (ObjectUtils.dig(this.block, 'content', 'text')) return false

    return true
  }

  onChoose({ choice }: { event: PointerEvent, choice: { type: string, args: [ContentBlockIdBlock] } }): void {
    const block = choice.args[0]
    block.content.blockId = this.block.id
  }

  onEnter(_args: { event: KeyboardEvent }): void {
    const parent = this.director.find(this.block.parentId)
    const newBlock: TextBlock = { id: Guid.create(), type: 'text', content: { text: '' } }
    if (parent) newBlock.parentId = parent.id
    this.director.addAfter(newBlock, this.block)
  }

  onInput({ event }: { event: InputEvent }) {
    this.block.content.text = (<HTMLElement>event.target)?.innerHTML
  }

  onMove({ block }: { block: Block }) {
    const parent = this.director.find(this.block.parentId)
    switch (block.type) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'text':
      case 'row':
      case 'image':
      case 'ingredient':
      case 'number':
        if (parent?.type === 'row') {
          const newColumn: ColumnBlock = { id: Guid.create(), type: 'column' }
          this.director.addBefore(newColumn, this.block)
          this.director.moveInside(block, newColumn)
        } else {
          this.director.move(block, this.block)
        }
        break
      case 'column':
        if (parent?.type === 'row') {
          this.director.move(block, this.block)
        } else {
          const newRow: RowBlock = { id: Guid.create(), type: 'row' }
          this.director.addBefore(newRow, this.block)
          this.director.moveInside(block, newRow)
        }
        break
      case 'sidebar':
        this.director.move(block, this.block)
        break
      default:
        assertNever(block)
    }
  }
}
