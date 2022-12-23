import { defineComponent, nextTick } from 'vue'
import { Block, UBlockDirector } from '~/interfaces/blockInterfaces'
import SelectionUtils from '~/utils/selectionUtils'
import draggableMixin from './draggableMixin'

export default function<B extends Block>() {
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
    },
    watch: {
      'block.content.text'(newVal, oldVal) {
        this.preserveCaret()
      },
    },
  })
}
