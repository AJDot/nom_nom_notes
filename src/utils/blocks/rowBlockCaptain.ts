import { Block, BlockDirector, ContentBlockIdBlock, RowBlock, URowBlockCaptain } from '~/interfaces/blockInterfacesGeneral'
import assertNever from '../assertNever'

export default class RowBlockCaptain<FType> implements URowBlockCaptain<FType> {
  constructor(public block: RowBlock, public director: BlockDirector<FType>) {
  }

  get isEmpty(): boolean {
    return this.director.childrenFor(this.block).length === 0
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

  onMove({ block }: { block: Block }): void {
    switch (block.type) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'text':
      case 'row':
      case 'image':
      case 'ingredient':
        this.director.move(block, this.block)
        break
      case 'column':
      case 'sidebar':
        this.director.moveInside(block, this.block)
        break
      default:
        assertNever(block)
    }
  }
}