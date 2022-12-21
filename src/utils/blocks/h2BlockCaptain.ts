import { Block, H2Block, UBlockCaptain, UBlockDirector } from '~/interfaces/blockInterfaces'
import Guid from '../guid'

export default class H2BlockCaptain implements UBlockCaptain {
  constructor(public block: H2Block, public director: UBlockDirector) {
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