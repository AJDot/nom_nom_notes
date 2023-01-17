import { DirectiveBinding, VNode } from '@vue/runtime-core'

function toggleStateFactory<K = PropertyKey | null>(state: Record<string, boolean> | ((key: K) => void), key: K) {
  return (ev) => {
    if (key) {
      if (typeof state === 'function') {
        state(key)
      } else {
        state[key.toString()] = !state[key.toString()]
      }
    }
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
