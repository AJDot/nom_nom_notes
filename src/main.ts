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
import Row from '@/row.vue'
import Column from '@/column.vue'
import focus from '~/directives/focus'

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
  .directive('focus', focus)
  .mount('#app')
