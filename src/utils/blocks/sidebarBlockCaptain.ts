import { Block, ColumnBlock, ContentBlockIdBlock, SidebarBlock, TextBlock, UBlockCaptain, UBlockDirector } from '~/interfaces/blockInterfaces'
import assertNever from '../assertNever'
import Guid from '../guid'

export default class SidebarBlockCaptain implements UBlockCaptain {
  constructor(public block: SidebarBlock, public director: UBlockDirector) {
  }

  onChoose({ event, choice }: { event: PointerEvent, choice: { type: string; args: [ContentBlockIdBlock] } }): void {
    const block = choice.args[0]
    block.content.blockId = this.block.id
  }

  onEnter({ event }: { event: KeyboardEvent }): void {
    const parent = this.director.find(this.block.parentId)
    const newBlock: TextBlock = { id: Guid.create(), type: 'text', content: { text: '' } }
    if (parent) newBlock.parentId = parent.id
    this.director.addAfter(newBlock, this.block)
  }

  onInput({ event }: { event: InputEvent }) {
    this.block.content.text = (<HTMLElement>event.target)?.innerHTML
  }

  onMove({ block }: { block: Block }) {
    switch (block.type) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'text':
      case 'row':
        const parent = this.director.find(this.block.parentId)
        if (parent?.type === 'row') {
          const newColumn: ColumnBlock = { id: Guid.create(), type: 'column' }
          this.director.addBefore(newColumn, this.block)
          this.director.moveInside(block, newColumn)
        } else {
          this.director.move(block, this.block)
        }
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