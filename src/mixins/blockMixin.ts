import { defineComponent } from 'vue'
import { UBlockDirector } from 'Interfaces/blockInterfaces'
import { Block } from 'Interfaces/blockInterfacesGeneral'
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
        validator: prop => typeof prop === 'string' && ['create', 'show', 'edit', 'choose', 'shopping'].includes(prop),
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
      isShoppingListMode(): boolean {
        return this.mode === 'shopping'
      },
      isEditable(): boolean {
        return this.editable && (this.isCreateMode || this.isEditMode)
      },
      hoverColor(): string {
        return this.isChooseMode ? 'bg-green-100' : 'bg-gray-100'
      },
    },
  })
}
