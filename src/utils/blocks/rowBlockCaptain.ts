import { RowBlock, UBlockCaptain, UBlockDirector } from '~/interfaces/blockInterfaces'

export default class RowBlockCaptain implements UBlockCaptain {
  constructor(public block: RowBlock, public director: UBlockDirector) {
  }

  onEnter({ event }: { event: KeyboardEvent }): void {
    throw new Error('Method not implemented.')
  }

  onInput({ event }: { event: InputEvent }) {
    this.block.content.text = (<HTMLElement>event.target)?.innerText
  }
}