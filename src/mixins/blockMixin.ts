import { defineComponent, nextTick } from 'vue'
import { UBlockDirector } from '~/interfaces/blockInterfaces'
import SelectionUtils from '~/utils/selectionUtils'

export default function<B>() {
  return defineComponent({
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
