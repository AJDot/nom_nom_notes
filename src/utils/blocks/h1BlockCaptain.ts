import { Block, H1Block, UBlockCaptain, UBlockDirector } from 'Interfaces/blockInterfaces'
import Guid from '../guid'

export default class H1BlockCaptain implements UBlockCaptain {
  constructor(public block: H1Block, public director: UBlockDirector) {
  }

  canDestroy(): boolean {
    return !this.block.content.text
  }

  onEnter({ event }: { event: KeyboardEvent }): void {
    const parent = this.director.find(this.block.parentId)
    const newBlock: Block = { id: Guid.create(), type: 'text', content: { text: '' } }
    if (parent) newBlock.parentId = parent.id
    this.director.addAfter(newBlock, this.block)
  }

  onInput({ event }: { event: InputEvent }) {
    this.block.content.text = (<HTMLElement>event.target)?.innerText
  }
}