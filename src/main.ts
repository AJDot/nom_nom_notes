import '~/vendor'
import 'Styles/index.css'
import { createApp } from 'vue'
import App from '~/App.vue'
import router from '~/router'
import { stateKey, store } from '~/store'
import VueAxios from 'vue-axios'
import { plainAxiosInstance, securedAxiosInstance } from '~/backend/axios'
import routerExtension from '~/router/routerExtension'
import filters from '~/plugins/filters'
import modalStore from '~/plugins/store/modals'
import Dropdown from '~/components/structure/dropdown.vue'
import DropdownItem from '~/components/structure/dropdown-item.vue'
import DropdownItemEmpty from '~/components/structure/dropdown-item-empty.vue'
import DropdownItemButton from '~/components/structure/dropdown-item-button.vue'
import AInput from '@/structure/a-input.vue'
import ATextarea from '@/structure/a-textarea.vue'
import { Focus } from '~/directives/focus'
import currentUserMixin from '~/mixins/currentUserMixin'
import { Hover } from '~/directives/hover'
import flipper from '~/plugins/flipper'
import { ToggleClass } from '~/directives/toggleClass'
import { ToggleState } from '~/directives/toggleState'

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
  .mixin(currentUserMixin)
  .directive('focus', Focus)
  .directive('hover', Hover)
  .directive('toggle-class', ToggleClass)
  .directive('toggle-state', ToggleState)
  .mount('#app')
