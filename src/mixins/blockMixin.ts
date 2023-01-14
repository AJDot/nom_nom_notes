import { defineComponent, nextTick } from 'vue'
import { UBlockDirector } from '~/interfaces/blockInterfaces'
import { Block } from '~/interfaces/blockInterfacesGeneral'
import SelectionUtils from '~/utils/selectionUtils'
import draggableMixin from './draggableMixin'

export default function <B extends Block>() {
  return defineComponent({
    mixins: [draggableMixin],
    props: {
      block: {
        type: Object as () => B,
        required: true,
      },
      director: {
        type: Object as () => UBlockDirector,
        required: true,
      },
      mode: {
        type: String,
        default: 'show',
        validator: prop => typeof prop === 'string' && ['create', 'show', 'edit', 'choose'].includes(prop)
      },
      editable: {
        type: Boolean,
        default: true,
      },
    },
    computed: {
      droppableTest(): (blockId: string) => boolean {
        const thisBlock = this.block as B
        return ([blockId]: string) => {
          const draggedBlock = this.director.find(blockId)
          if (!draggedBlock) return false
          return (
            this.droppable &&
            !this.director.ancestors(thisBlock).includes(draggedBlock)
          )
        }
      },
      isShowMode(): boolean {
        return this.mode === 'show'
      },
      isCreateMode(): boolean {
        return this.mode === 'create'
      },
      isEditMode(): boolean {
        return this.mode === 'edit'
      },
      isChooseMode(): boolean {
        return this.mode === 'choose'
      },
      isEditable(): boolean {
        return this.editable && (this.isCreateMode || this.isEditMode)
      },
      hoverColor(): string {
        return this.isChooseMode ? 'bg-green-100' : 'bg-gray-100'
      },
      blockListeners(): Record<string, Function> {
        return {
          input: this.onInput,
          keydown: this.onKeydown,
          click: this.onClick,
        }
      },
    },
    methods: {
      async preserveCaret() {
        const element = this.$refs.content as HTMLElement
        if (!element) return
        const position = SelectionUtils.getCaret(element)
        if (!position) return
        await nextTick()
        // catch when element is removed from DOM - happens when TextBlock is converted to Rows and Columns
        if (document.body.contains(element))
          SelectionUtils.moveCaret(element, position)
      },
      onClick(event: PointerEvent) {
        if (!this.isEditable) return

        this.director.onClick({ block: this.block as B, event })
      },
      onInput(event: InputEvent) {
        if (!this.isEditable) return

        this.director.onInput({ block: this.block as B, event })
      },
      onKeydown(event: KeyboardEvent) {
        if (!this.isEditable) return

        switch (event.key) {
          case 'ArrowDown':
            this.onArrowDown(event)
            break
          case 'ArrowUp':
            this.onArrowUp(event)
            break
          case 'Enter':
            this.onEnter(event)
            break
          case 'Backspace':
            this.onBackspace(event)
            break
          case 'Delete':
            this.onDelete(event)
            break
        }
      },
      onEnter(event: KeyboardEvent) {
        if (!this.isEditable) return

        if (event.shiftKey) {
        } else {
          this.director.onEnter({ block: this.block as B, event })
          event.preventDefault()
        }
      },
      onArrowDown(event) {
        if (!this.isEditable) return

        this.director.onArrowDown({ block: this.block as B, event })
      },
      onArrowUp(event) {
        if (!this.isEditable) return

        this.director.onArrowUp({ block: this.block as B, event })
      },
      onBackspace(event) {
        if (!this.isEditable) return

        this.director.onBackspace({ block: this.block as B, event })
      },
      onDelete(event) {
        if (!this.isEditable) return

        this.director.onDelete({ block: this.block as B, event })
      },
    },
    watch: {
      'block.content.text'(newVal, oldVal) {
        this.preserveCaret()
      },
    },
  })
}
