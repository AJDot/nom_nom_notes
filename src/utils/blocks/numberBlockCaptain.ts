import { Block, BlockDirector, ContentBlockIdBlock, RowBlock, NumberBlock, UNumberBlockCaptain, TextBlock } from 'Interfaces/blockInterfacesGeneral'
import { ObjectUtils } from '~/utils/objectUtils'
import assertNever from '../assertNever'
import Guid from '../guid'

export default class NumberBlockCaptain<FType> implements UNumberBlockCaptain<FType> {
  // eslint-disable-next-line no-useless-constructor
  constructor(public block: NumberBlock, public director: BlockDirector<FType>) {}

  get isEmpty(): boolean {
    if (ObjectUtils.dig(this.block, 'content', 'text')) return false
    if (this.director.childrenFor(this.block).length !== 0) return false

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
    if (!this.director.find(this.block.id)) {
      this.director.add(this.block)
    }
  }

  onMove({ block }: { block: Block }) {
    switch (block.type) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'text':
      case 'row':
      case 'sidebar':
      case 'image':
      case 'ingredient':
      case 'number':
        this.director.move(block, this.block)
        break
      case 'column': {
        const row: RowBlock = { id: Guid.create(), type: 'row' }
        this.director.addBefore(row, this.block)
        this.director.moveInside(block, row)
        break
      }
      default:
        assertNever(block)
    }
  }
}
