import { FileUpload } from "./fileUploadInterfaces"
import { Uploader } from "./imageInterfaces"

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

export type Block = H1Block | H2Block | H3Block | TextBlock | RowBlock | ColumnBlock | SidebarBlock | ImageBlock
// A merge of all the block types
export type AllBlock = Omit<H1Block, 'type'> & Omit<H2Block, 'type'> & Omit<H3Block, 'type'> & Omit<TextBlock, 'type'> & Omit<RowBlock, 'type'> & Omit<ColumnBlock, 'type'> & Omit<SidebarBlock, 'type'> & Omit<ImageBlock, 'type'> & { type: Block['type'] }
export type ContentBlockIdBlock = Extract<Block, { content: { blockId: string | null } }>
export type ContentAttachmentIdBlock = Extract<Block, { content: { attachmentId: string | null } }>

export type BlockCommandType = 'h1' | 'h2' | 'h3' | 'text' | 'columns' | 'addColumn' | 'sidebar' | 'image'

export interface BlockCommand {
  description: string
  label: string
  call(block: Block): void
}

export type BlockCommandDict = { [key in BlockCommandType]: BlockCommand }

export type FindAttachmentReturn<T> = { attachment: T, url: string } | { attachment: null, url: null }

export interface BlockDirectorOptions<FType> {
  blocks: Array<Block>
  findAttachment?(args: { id: string | null | undefined }): FindAttachmentReturn<FType>
  onArrowDown?(args: { block: Block, event: KeyboardEvent, call: () => void }): void
  onArrowUp?(args: { block: Block, event: KeyboardEvent, call: () => void }): void
  onBackspace?(args: { block: Block, event: InputEvent, call: () => void }): void
  onChoose?(args: { block: Block, event: PointerEvent, choice: { type: string, args: any[] }, call: () => void }): void
  onClick?(args: { block: Block, event: PointerEvent, call: () => void }): void
  onCreate?(args: { block: Block, inside?: Block, call: () => void }): void
  onDelete?(args: { block: Block, event: InputEvent, call: () => void }): void
  onDestroy?(args: { block: Block, call: () => void }): void
  onDrop?(args: { moveBlockId: string, toBlockId: string, call: () => void }): void
  onEnter?(args: { block: Block, event: KeyboardEvent, call: () => void }): void
  onImageUpload?(args: { block: ContentAttachmentIdBlock, image: Uploader, call: () => void }): void
  onInput?(args: { block: Block, event: InputEvent, call: () => void }): void
  onMove?(args: { move: Block, to: Block, call: () => void }): void
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
  captainFor(block: Block, director: this): UBlockCaptain<Block, FType>
  childrenFor(block: Block | null): Array<Block>
  destroy(block: Block): boolean
  destroyAll(...blocks: Array<Block>): Array<boolean>
  find(id: string | null | undefined): Block | null
  findAttachment(args: { id: string | null | undefined }): FindAttachmentReturn<FType>
  findNearest(block: Block, type: Block['type']): Block | null
  indexOf(block: Block): number | null
  isEmpty(block: Block): boolean
  move(block: Block, to: Block): void
  moveInside(block: Block, to: Block): void
  onArrowDown(args: { block: Block, event: KeyboardEvent }): void
  onArrowUp(args: { block: Block, event: KeyboardEvent }): void
  onBackspace(args: { block: Block, event: InputEvent }): void
  onChoose(args: { block: Block, event: PointerEvent, choice: { type: string, args: any[] } }): void
  onClick(args: { block: Block, event: PointerEvent }): void
  onCreate(args: { block: Block, inside?: Block }): void
  onDelete(args: { block: Block, event: InputEvent }): void
  onDestroy(args: { block: Block }): void
  onDrop(args: { moveBlockId: string, toBlockId: string }): void
  onEnter(args: { block: Block, event: KeyboardEvent }): void
  onImageUpload(args: { block: Block, image: Uploader }): void
  onInput(args: { block: Block, event: Event }): void
  onMove(args: { move: Block, to: Block }): void
  set(blocks: Array<Block>): void
}

export interface UBlockCaptain<B, FType> {
  director: BlockDirector<FType>
  block: B
  onChoose(args: { event: PointerEvent, choice: { type: string, args: [Block] } }): void
  onEnter(args: { event: KeyboardEvent }): void
  onInput(args: { event: InputEvent }): void
  onMove(args: { block: Block }): void
}
