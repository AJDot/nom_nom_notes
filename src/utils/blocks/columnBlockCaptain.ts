import { Block, ColumnBlock, ContentBlockIdBlock, UBlockCaptain, UBlockDirector } from '~/interfaces/blockInterfaces'
import assertNever from '../assertNever'

export default class ColumnBlockCaptain implements UBlockCaptain {
  constructor(public block: ColumnBlock, public director: UBlockDirector) {
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