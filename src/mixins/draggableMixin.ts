import { defineComponent } from 'vue'

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
})
