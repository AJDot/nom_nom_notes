import { DirectiveBinding, VNode } from '@vue/runtime-core'

function toggleStateFactory(state: Record<string, boolean>, key: PropertyKey | null) {
  return (ev) => {
    if (key) state[key.toString()] = !state[key.toString()]
  }
}

export const ToggleState = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding, vNode: VNode, _prevVNode: VNode | null): void {
    $(el).on(`click.toggleState.${vNode.key?.toString()}.`, toggleStateFactory(binding.value, vNode.key))
  },
  beforeUnmount(el: HTMLElement, binding: DirectiveBinding, vNode: VNode, _prevVNode: VNode | null): void {
    $(el).off(`click.toggleState.${vNode.key?.toString()}`)
  },
}
