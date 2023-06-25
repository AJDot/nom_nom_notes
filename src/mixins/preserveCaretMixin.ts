import { defineComponent, nextTick, watch } from 'vue'
import SelectionUtils from '~/utils/selectionUtils'
import { ContentBlockIdBlock, Block } from './../interfaces/blockInterfacesGeneral'

export default function (...keys: string[]) {
  return defineComponent({
    props: {
      block: {
        type: Object as () => Block,
        required: true,
      },
    },
    mounted() {
      for (const key of keys) {
        watch(() => (<ContentBlockIdBlock> this.block).content[key], () => this.preserveCaret(key), { immediate: true })
      }
    },
    methods: {
      async preserveCaret(key: string) {
        const element = this.$refs[key] as HTMLElement
        const position = SelectionUtils.getCaret(element)
        if (position) {
          await nextTick()
          // catch when element is removed from DOM - happens when TextBlock is converted to Rows and Columns
          if (document.body.contains(element)) {
            SelectionUtils.moveCaret(element, position)
          }
        }
      },
    },
  })
}
