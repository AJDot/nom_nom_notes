import { Block, BlockDirector, ColumnBlock, ContentBlockIdBlock, UBlockCaptain } from '~/interfaces/blockInterfacesGeneral'
import assertNever from '../assertNever'

export default class ColumnBlockCaptain<FType> implements UBlockCaptain<ColumnBlock, FType> {
  constructor(public block: ColumnBlock, public director: BlockDirector<FType>) {
  }

  onChoose({ event, choice }: { event: PointerEvent, choice: { type: string; args: [ContentBlockIdBlock] } }): void {
    const block = choice.args[0]
    block.content.blockId = this.block.id
  }

  onEnter({ event }: { event: KeyboardEvent }): void {
    throw new Error('Method not implemented.')
  }

  onInput({ event }: { event: InputEvent }) {
    throw new Error('Method not implemented.')
  }

  onMove({ block }: { block: Block }) {
    switch (block.type) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'text':
      case 'row':
      case 'image':
        this.director.moveInside(block, this.block)
        break
      case 'column':
      case 'sidebar':
        this.director.move(block, this.block)
        break
      default:
        assertNever(block)
    }
  }
}