import { defineComponent } from 'vue'
import { UBlockDirector } from '~/interfaces/blockInterfaces'
import { Block } from '~/interfaces/blockInterfacesGeneral'

export default defineComponent({
  props: {
    block: {
      type: Object as () => Block,
      required: true,
    },
    director: {
      type: Object as () => UBlockDirector,
      required: true,
    },
  },
  computed: {
    blockListeners(): Record<string, Function> {
      return {
        input: this.onInput,
        keydown: this.onKeydown,
        click: this.onClick,
      }
    },
  },
  methods: {
    onClick(event: PointerEvent) {
      this.director.onClick({ block: this.block, event })
    },
    onInput(event: InputEvent) {
      this.director.onInput({ block: this.block, event })
    },
    onKeydown(event: KeyboardEvent) {
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
      if (event.shiftKey) {
      } else {
        this.director.onEnter({ block: this.block, event })
        event.preventDefault()
      }
    },
    onArrowDown(event) {
      this.director.onArrowDown({ block: this.block, event })
    },
    onArrowUp(event) {
      this.director.onArrowUp({ block: this.block, event })
    },
    onBackspace(event) {
      this.director.onBackspace({ block: this.block, event })
    },
    onDelete(event) {
      this.director.onDelete({ block: this.block, event })
    },
  },
})
