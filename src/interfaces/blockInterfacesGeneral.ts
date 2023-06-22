import { Uploader } from './imageInterfaces'

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
}

export interface ColumnBlock extends BaseBlock {
  type: 'column'
}

export interface SidebarBlock extends BaseBlock {
  type: 'sidebar'
  content: { text: string, blockId: string | null }
}

export interface ImageBlock extends BaseBlock {
  type: 'image'
  content: { attachmentId: string | null }
}

export interface IngredientBlock extends BaseBlock {
  type: 'ingredient'
  content: { amount: string | null, text: string | null }
}

export type Block = H1Block | H2Block | H3Block | TextBlock | RowBlock | ColumnBlock | SidebarBlock | ImageBlock | IngredientBlock

export type ContentBlockIdBlock = Extract<Block, { content: { blockId: string | null } }>
export type ContentAttachmentIdBlock = Extract<Block, { content: { attachmentId: string | null } }>

export type BlockCommandType = 'h1' | 'h2' | 'h3' | 'text' | 'columns' | 'addColumn' | 'sidebar' | 'image' | 'ingredient'

export interface BlockCommand {
  description: string
  label: string
  call(block: Block): void
}

export type BlockCommandDict = { [key in BlockCommandType]: BlockCommand }

export type FindAttachmentReturn<T> = { attachment: T, url: string, alt?: string | null } | { attachment: null, url: null, alt: null }

export interface BlockDirectorOptions<FType> {
  blocks: Array<Block>
  findAttachment(args: { id: string | null | undefined }): FindAttachmentReturn<FType>
  focusAfter(block: Block): Promise<void>
  focusBefore(block: Block): Promise<void>
  onArrowDown(args: { block: Block, event: KeyboardEvent }): void
  onArrowUp(args: { block: Block, event: KeyboardEvent }): void
  onBackspace(args: { block: Block, event: InputEvent, call: () => void }): void
  onChoose(args: { block: Block, event: PointerEvent, choice: { type: string, args: any[] }, call: () => void }): void
  onDestroyAttachments(args: { block: Block }): Promise<void>
  onEnter(args: { block: Block, event: KeyboardEvent, call: () => void }): void
  onImageUpload(args: { block: ContentAttachmentIdBlock, image: Uploader }): void
  onInput(args: { block: Block, event: InputEvent, call: () => void }): void
  onSave(): void
}

export interface BlockDirector<FType> {
  readonly COMMANDS: BlockCommandDict
  readonly blocks: Array<Block>
  add(newBlock: Block): void
  addAfter(newBlock: Block, block: Block): void
  addBefore(newBlock: Block, block: Block): void
  addInside(newBlock: Block, block: Block): void
  ancestors(block: Block): Block[]
  blockAfter(block: Block): Block | null
  blockBefore(block: Block): Block | null
  captainFor<B extends Block>(block: B): TBlockCaptain<B, FType>
  childrenFor(block: Block | null): Array<Block>
  destroy(block: Block, direction: 'down' | 'up' | 'both'): boolean
  destroyAll(...blocks: Array<Block>): Array<boolean>
  find(id: string | null | undefined): Block | null
  findAttachment(args: { id: string | null | undefined }): FindAttachmentReturn<FType>
  findNearest(block: Block, type: Block['type']): Block | null
  findWhere<T extends Record<string, any>>(criteria: T, opts?: { order?: 'display' }): Extract<Block, T>[]
  focusAfter(block: Block): Promise<void>
  focusBefore(block: Block): Promise<void>
  indexOf(block: Block): number | null
  isEmpty(block: Block): boolean
  move(block: Block, to: Block): void
  moveInside(block: Block, to: Block): void
  onArrowDown(args: { block: Block, event: KeyboardEvent }): void
  onArrowUp(args: { block: Block, event: KeyboardEvent }): void
  onBackspace(args: { block: Block, event: InputEvent, call: () => void }): void
  onChoose(args: { block: Block, event: PointerEvent, choice: { type: string, args: any[] } }): void
  onCreate(args: { block: Block, inside?: Block }): void
  onDestroyAttachments(args: { block: Block }): Promise<void>
  onEnter(args: { block: Block, event: KeyboardEvent, call: () => void }): void
  onImageUpload(args: { block: Block, image: Uploader }): void
  onInput(args: { block: Block, event: Event, call: () => void }): void
  onMove(args: ({ move: Block } | { moveId: string }) & ({ to: Block } | { toId: string })): void
  onSave(): void
  order(order: 'display'): Block[]
  set(blocks: Array<Block>): void
}

export interface UBlockCaptainBase<B, FType> {
  director: BlockDirector<FType>
  block: B
  isEmpty: boolean
  onChoose(args: { event: PointerEvent, choice: { type: string, args: [Block] } }): void
  onEnter(args: { event: KeyboardEvent }): void
  onInput(args: { event: InputEvent }): void
  onMove(args: { block: Block }): void
}

export interface UH1BlockCaptain<FType> extends UBlockCaptainBase<H1Block, FType> {

}
export interface UH2BlockCaptain<FType> extends UBlockCaptainBase<H2Block, FType> {

}
export interface UH3BlockCaptain<FType> extends UBlockCaptainBase<H3Block, FType> {

}
export interface UTextBlockCaptain<FType> extends UBlockCaptainBase<TextBlock, FType> {

}
export interface URowBlockCaptain<FType> extends UBlockCaptainBase<RowBlock, FType> {

}
export interface UColumnBlockCaptain<FType> extends UBlockCaptainBase<ColumnBlock, FType> {

}
export interface USidebarBlockCaptain<FType> extends UBlockCaptainBase<SidebarBlock, FType> {

}
export interface UImageBlockCaptain<FType> extends UBlockCaptainBase<ImageBlock, FType> {

}
export interface UIngredientBlockCaptain<FType> extends UBlockCaptainBase<IngredientBlock, FType> {
  onInput(args: { event: InputEvent, contentType: 'amount' | 'text' }): void
}

export type TBlockCaptain<B extends Block, FType> = B extends H1Block ? UH1BlockCaptain<FType> : B extends H2Block ? UH2BlockCaptain<FType> : B extends H3Block ? UH3BlockCaptain<FType> : B extends TextBlock ? UTextBlockCaptain<FType> : B extends RowBlock ? URowBlockCaptain<FType> : B extends ColumnBlock ? UColumnBlockCaptain<FType> : B extends SidebarBlock ? USidebarBlockCaptain<FType> : B extends ImageBlock ? UImageBlockCaptain<FType> : B extends IngredientBlock ? UIngredientBlockCaptain<FType> : never