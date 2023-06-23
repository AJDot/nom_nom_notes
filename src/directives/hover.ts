import { DirectiveBinding, VNode } from 'vue'

export const Hover = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding, _vNode: VNode, _prevVNode: VNode | null): void {
    $(el).on('mouseover.hover', e => {
      binding.value(e, true)
    })
    $(el).on('mouseleave.hover', e => {
      binding.value(e, false)
    })
  },
  beforeUnmount(el: HTMLElement, _binding: DirectiveBinding, _vNode: VNode, _prevVNode: VNode | null): void {
    $(el).off('mouseover.hover mouseleave.hover')
  },
}
