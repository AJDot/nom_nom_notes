// Register a global custom directive called `v-focus`
import { Directive, DirectiveBinding, VNode } from 'vue'

export const Focus = {
  // When the bound element is inserted into the DOM...
  mounted(el: HTMLElement, binding: DirectiveBinding, _vNode: VNode, _prevVNode: VNode | null) {
    // Focus the element
    if (binding.value === undefined || binding.value === true) {
      el.focus()
    }
  },
} as Directive
