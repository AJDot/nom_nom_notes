import { DirectiveBinding, VNode } from '@vue/runtime-core'

function toggleClassFactory(cssClass: string) {
  return (ev) => {
    ev.target.classList.toggle(cssClass)
  }
}

export const ToggleClass = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding, _vNode: VNode, _prevVNode: VNode | null): void {
    $(el).on(`click.toggleClass.${binding.value}`, toggleClassFactory(binding.value))
  },
  beforeUnmount(el: HTMLElement, binding: DirectiveBinding, _vNode: VNode, _prevVNode: VNode | null): void {
    $(el).off(`click.toggleClass.${binding.value}`)
  },
}
