import { Block, BlockDirector, ContentBlockIdBlock, ImageBlock, RowBlock, UBlockCaptain } from '~/interfaces/blockInterfacesGeneral'
import assertNever from '../assertNever'
import Guid from '../guid'

export default class ImageBlockCaptain<FType> implements UBlockCaptain<ImageBlock, FType> {
  constructor(public block: ImageBlock, public director: BlockDirector<FType>) {
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