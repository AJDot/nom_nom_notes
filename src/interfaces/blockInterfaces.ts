
export interface BaseBlock {
  id: string
  type: string
  parentId?: string
}

export interface H1Block extends BaseBlock {
  type: 'h1'
  content: { text: string }
}

export interface H2Block extends BaseBlock {
  type: 'h2'
  content: { text: string }
}

export interface H3Block extends BaseBlock {
  type: 'h3'
  content: { text: string }
}

export interface TextBlock extends BaseBlock {
  type: 'text'
  content: { text: string }
}

export interface RowBlock extends BaseBlock {
  type: 'row'
  content: { text: string }
}

export interface ColumnBlock extends BaseBlock {
  type: 'column'
  content: { text: string }
}

export type Block = H1Block | H2Block | H3Block | TextBlock | RowBlock | ColumnBlock

export interface BlockCommand {
  label: 'H1' | 'H2' | 'H3' | 'Text' | 'Columns' | 'Add Column'
  call(block: Block): void
}

export interface BlockDirectorOptions {
  blocks: Array<Block>
  onArrowDown?(args: { block: Block, event: KeyboardEvent, call: () => void }): void
  onArrowUp?(args: { block: Block, event: KeyboardEvent, call: () => void }): void
  onBackspace?(args: { block: Block, event: InputEvent, call: () => void }): void
  onCreate?(args: { block: Block, inside?: Block, call: () => void }): void
  onDelete?(args: { block: Block, event: InputEvent, call: () => void }): void
  onDestroy?(args: { block: Block, call: () => void }): void
  onDrop?(args: { moveBlockId: string, toBlockId: string, call: () => void }): void
  onEnter?(args: { block: Block, event: KeyboardEvent, call: () => void }): void
  onInput?(args: { block: Block, event: InputEvent, call: () => void }): void
  onMove?(args: { move: Block, to: Block, call: () => void }): void
}

export interface UBlockDirector {
  readonly COMMANDS: Array<BlockCommand>
  readonly blocks: Array<Block>
  add(newBlock: Block): void
  addAfter(newBlock: Block, block: Block): void
  addBefore(newBlock: Block, block: Block): void
  blockAfter(block: Block): Block | null
  blockBefore(block: Block): Block | null
  captainFor(block: Block, director: this): UBlockCaptain
  childrenFor(block: Block | null): Array<Block>
  destroy(block: Block): boolean
  destroyAll(...blocks: Array<Block>): Array<boolean>
  find(id: string | null | undefined): Block | null
  indexOf(block: Block): number | null
  isEmpty(block: Block): boolean
  move(block: Block, to: Block): void
  moveInside(block: Block, to: Block): void
  onArrowDown(args: { block: Block, event: KeyboardEvent }): void
  onArrowUp(args: { block: Block, event: KeyboardEvent }): void
  onBackspace(args: { block: Block, event: InputEvent }): void
  onCreate(args: { block: Block, inside?: Block }): void
  onDelete(args: { block: Block, event: InputEvent }): void
  onDestroy(args: { block: Block }): void
  onDrop(args: { moveBlockId: string, toBlockId: string }): void
  onEnter(args: { block: Block, event: KeyboardEvent }): void
  onInput(args: { block: Block, event: InputEvent }): void
  onMove(args: { move: Block, to: Block }): void
  set(blocks: Array<Block>): void
}

export interface UBlockCaptain<B = Block> {
  director: UBlockDirector
  block: B
  onEnter(args: { event: KeyboardEvent }): void
  onInput(args: { event: InputEvent }): void
  onMove(args: { block: Block }): void
}
