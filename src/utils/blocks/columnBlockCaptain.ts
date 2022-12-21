import { Block, ColumnBlock, UBlockCaptain, UBlockDirector } from '~/interfaces/blockInterfaces'

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
    this.director.moveInside(block, this.block)
  }
}