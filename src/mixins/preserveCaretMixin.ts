import { defineComponent, nextTick } from 'vue'
import SelectionUtils from '~/utils/selectionUtils'

export default defineComponent({
  props: {
    draggable: {
      type: Boolean,
      default: false,
    },
    droppable: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.preserveCaret()
  },
  methods: {
    async preserveCaret() {
      const element = this.$refs.content as HTMLElement
      const position = SelectionUtils.getCaret(element)
      if (position) {
        await nextTick()
        // catch when element is removed from DOM - happens when TextBlock is converted to Rows and Columns
        if (document.body.contains(element))
          SelectionUtils.moveCaret(element, position)
      }
    },
  },
  watch: {
    'block.content.text'(newVal, oldVal) {
      this.preserveCaret()
    },
  },
})
