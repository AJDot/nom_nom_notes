import '~/vendor'
import 'Styles/index'
import { createApp } from 'vue'
import App from '~/App.vue'
import router from '~/router'
import { stateKey, store } from '~/store'
import VueAxios from 'vue-axios'
import { plainAxiosInstance, securedAxiosInstance } from '~/backend/axios'

createApp(App)
  .use(router)
  .use(store, stateKey)
  .use(VueAxios,
    {
      secured: securedAxiosInstance,
      plain: plainAxiosInstance,
    },
  )
  .mount('#app')
