import { Block, BlockDirector, ContentBlockIdBlock, RowBlock, URowBlockCaptain } from 'Interfaces/blockInterfacesGeneral'
import assertNever from '../assertNever'

export default class RowBlockCaptain<FType> implements URowBlockCaptain<FType> {
  // eslint-disable-next-line no-useless-constructor
  constructor(public block: RowBlock, public director: BlockDirector<FType>) {
  }

  get isEmpty(): boolean {
    return this.director.childrenFor(this.block).length === 0
  }

  onChoose({ choice }: { event: PointerEvent, choice: { type: string, args: [ContentBlockIdBlock] } }): void {
    const block = choice.args[0]
    block.content.blockId = this.block.id
  }

  onEnter(_args: { event: KeyboardEvent }): void {
    throw new Error('Method not implemented.')
  }

  onInput(_args: { event: InputEvent }) {
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
      case 'number':
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
