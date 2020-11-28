import '~/vendor'
import 'Styles/index'
import { createApp } from 'vue'
import App from '~/App.vue'
import router from '~/router'
import { stateKey, store } from '~/store'

createApp(App)
  .use(router)
  .use(store, stateKey)
  .mount('#app')
