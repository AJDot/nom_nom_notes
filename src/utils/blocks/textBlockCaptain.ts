import { Block, TextBlock, UBlockCaptain, UBlockDirector } from 'Interfaces/blockInterfaces'
import Guid from '../guid'

export default class TextBlockCaptain implements UBlockCaptain {
  constructor(public block: TextBlock, public director: UBlockDirector) {}

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
    this.block.content.text = (<HTMLElement>event.target)?.innerHTML
    if (!this.director.find(this.block.id)) {
      this.director.add(this.block)
    }
  }

  onMove({ block }: { block: Block }) {
    this.director.move(block, this.block)
  }
}