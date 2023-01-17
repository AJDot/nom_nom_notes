import { Block, BlockDirector, ContentBlockIdBlock, H3Block, RowBlock, TextBlock, UBlockCaptain } from '~/interfaces/blockInterfacesGeneral'
import assertNever from '../assertNever'
import Guid from '../guid'

export default class H3BlockCaptain<FType> implements UBlockCaptain<H3Block, FType> {
  constructor(public block: H3Block, public director: BlockDirector<FType>) {
  }

  onChoose({ event, choice }: { event: PointerEvent, choice: { type: string; args: [ContentBlockIdBlock] } }): void {
    const block = choice.args[0]
    block.content.blockId = this.block.id
  }

  onEnter({ event }: { event: KeyboardEvent }): void {
    const parent = this.director.find(this.block.parentId)
    const newBlock: TextBlock = { id: Guid.create(), type: 'text', content: { text: '' } }
    if (parent) newBlock.parentId = parent.id
    this.director.addAfter(newBlock, this.block)
  }

  onInput({ event }: { event: InputEvent }) {
    this.block.content.text = (<HTMLElement>event.target)?.innerText
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
        this.director.move(block, this.block)
        break
      case 'column':
        const row: RowBlock = { id: Guid.create(), type: 'row' }
        this.director.addBefore(row, this.block)
        this.director.moveInside(block, row)
        break
      default:
        assertNever(block)
    }
  }
}