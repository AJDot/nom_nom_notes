import { Block, BlockDirector, ContentBlockIdBlock, H3Block, RowBlock, TextBlock, UH3BlockCaptain } from '~/interfaces/blockInterfacesGeneral'
import assertNever from '../assertNever'
import Guid from '../guid'
import { ObjectUtils } from '../objectUtils'

export default class H3BlockCaptain<FType> implements UH3BlockCaptain<FType> {
  constructor(public block: H3Block, public director: BlockDirector<FType>) {
  }

  get isEmpty(): boolean {
    if (ObjectUtils.dig(this.block, 'content', 'text')) return false

    return true
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
    this.block.content.text = (<HTMLElement>event.target)?.innerText
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
      case 'ingredient':
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