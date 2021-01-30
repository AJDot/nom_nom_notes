import '~/vendor'
import 'Styles/index'
import { createApp } from 'vue'
import App from '~/App.vue'
import router from '~/router'
import { stateKey, store } from '~/store'
import VueAxios from 'vue-axios'
import { plainAxiosInstance, securedAxiosInstance } from '~/backend/axios'
import routerExtension from '~/router/routerExtension'
import filters from '~/plugins/filters'
import modalStore from '~/plugins/store/modals'
import ContextMenu from '@/context-menu.vue'
import Row from '@/structure/row.vue'
import Column from '@/structure/column.vue'
import AInput from '@/structure/a-input.vue'
import { Focus } from '~/directives/focus'
import currentUserMixin from '~/mixins/currentUserMixin'
import { Hover } from '~/directives/hover'

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
  .component('context-menu', ContextMenu)
  .component('row', Row)
  .component('column', Column)
  .component('a-input', AInput)
  .mixin(currentUserMixin)
  .directive('focus', Focus)
  .directive('hover', Hover)
  .mount('#app')
