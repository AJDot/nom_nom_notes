import { Block, RowBlock, UBlockCaptain, UBlockDirector } from '~/interfaces/blockInterfaces'
import assertNever from '../assertNever'
import Guid from '../guid'

export default class RowBlockCaptain implements UBlockCaptain {
  constructor(public block: RowBlock, public director: UBlockDirector) {
  }

  onEnter({ event }: { event: KeyboardEvent }): void {
    throw new Error('Method not implemented.')
  }

  onInput({ event }: { event: InputEvent }) {
    this.block.content.text = (<HTMLElement>event.target)?.innerText
  }

  onMove({ block }: { block: Block }): void {
    switch (block.type) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'text':
        const children = this.director.childrenFor(this.block)
        let lastChild: Block | null = children[children.length - 1]
        if (!lastChild) {
          lastChild = { id: Guid.create(), type: 'column', content: { text: '' } }
          this.director.addAfter(lastChild, this.block)
          this.director.moveInside(lastChild, this.block)
        }
        this.director.moveInside(block, lastChild)
        break
      case 'column':
        this.director.moveInside(block, this.block)
        break
      case 'row':
        this.director.move(block, this.block)
        break
      default:
        assertNever(block)
    }
  }
}