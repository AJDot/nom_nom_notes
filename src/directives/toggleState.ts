import { DirectiveBinding, VNode } from 'vue'

function toggleStateFactory<K extends PropertyKey | null = PropertyKey | null>(state: Record<string, boolean> | ((key: K) => void), key: K) {
  return (_ev) => {
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
    const key = vNode.props!['data-toggle-key'] ?? vNode.key
    $(el).on(`click.toggleState.${vNode.key?.toString()}.`, toggleStateFactory(binding.value, key))
  },
  beforeUnmount(el: HTMLElement, binding: DirectiveBinding, vNode: VNode, _prevVNode: VNode | null): void {
    const key = vNode.props!['data-toggle-key'] ?? vNode.key
    $(el).off(`click.toggleState.${key?.toString()}`)
  },
}
