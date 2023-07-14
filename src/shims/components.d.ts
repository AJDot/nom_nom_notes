import AInput from '../components/structure/a-input.vue'
import ATextarea from '../components/structure/a-textarea.vue'
import BaseBlock from '../components/modules/base-block.vue'
import BaseBlockGroup from '../components/modules/base-block-group.vue'
import Dropdown from '../components/structure/dropdown.vue'
import DropdownItemButton from '../components/structure/dropdown-item-button.vue'
import DropdownItemEmpty from '../components/structure/dropdown-item-empty.vue'
import DropdownItem from '../components/structure/dropdown-item.vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    AInput: typeof AInput
    ATextarea: typeof ATextarea
    BaseBlock: typeof BaseBlock
    BaseBlockGroup: typeof BaseBlockGroup
    Dropdown: typeof Dropdown
    DropdownItem: typeof DropdownItem
    DropdownItemButton: typeof DropdownItemButton
    DropdownItemEmpty: typeof DropdownItemEmpty
  }
}
