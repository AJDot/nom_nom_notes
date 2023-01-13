import BaseBlockGroup from '@/modules/base-block-group.vue'
import BaseBlock from '@/modules/base-block.vue'
import AInput from '@/structure/a-input.vue'
import ATextarea from '@/structure/a-textarea.vue'
import 'Styles/index.css'
import { createApp } from 'vue'
import VueAxios from 'vue-axios'
import App from '~/App.vue'
import { plainAxiosInstance, securedAxiosInstance } from '~/backend/axios'
import DropdownItemButton from '~/components/structure/dropdown-item-button.vue'
import DropdownItemEmpty from '~/components/structure/dropdown-item-empty.vue'
import DropdownItem from '~/components/structure/dropdown-item.vue'
import Dropdown from '~/components/structure/dropdown.vue'
import { Focus } from '~/directives/focus'
import { Hover } from '~/directives/hover'
import { ToggleClass } from '~/directives/toggleClass'
import { ToggleState } from '~/directives/toggleState'
import currentUserMixin from '~/mixins/currentUserMixin'
import filters from '~/plugins/filters'
import flipper from '~/plugins/flipper'
import modalStore from '~/plugins/store/modals'
import router from '~/router'
import routerExtension from '~/router/routerExtension'
import { stateKey, store } from '~/store'
import '~/vendor'

createApp(App)
  .use(router)
  .use(store, stateKey)
  .use(VueAxios, {
    secured: securedAxiosInstance,
    plain: plainAxiosInstance,
  })
  .use(routerExtension)
  .use(filters)
  .use(modalStore)
  .use(flipper)
  .component('dropdown', Dropdown)
  .component('dropdown-item', DropdownItem)
  .component('dropdown-item-empty', DropdownItemEmpty)
  .component('dropdown-item-button', DropdownItemButton)
  .component('a-input', AInput)
  .component('a-textarea', ATextarea)
  .component('base-block', BaseBlock)
  .component('base-block-group', BaseBlockGroup)
  .mixin(currentUserMixin)
  .directive('focus', Focus)
  .directive('hover', Hover)
  .directive('toggle-class', ToggleClass)
  .directive('toggle-state', ToggleState)
  .mount('#app')
