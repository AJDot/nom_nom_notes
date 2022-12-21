import { Block, ColumnBlock, UBlockCaptain, UBlockDirector } from '~/interfaces/blockInterfaces'
import assertNever from '../assertNever'

export default class ColumnBlockCaptain implements UBlockCaptain {
  constructor(public block: ColumnBlock, public director: UBlockDirector) {
  }

  canDestroy(): boolean {
    throw new Error('Method not implemented.')
  }

  onEnter({ event }: { event: KeyboardEvent }): void {
    throw new Error('Method not implemented.')
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
        this.director.moveInside(block, this.block)
        break
      case 'column':
        this.director.move(block, this.block)
        break
      case 'row':
        this.director.moveInside(block, this.block)
        break
      default:
        assertNever(block)
    }   
  }
}