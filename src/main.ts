import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from '@/plugins/vuetify.ts'
import store from '@/stores'
import i18n from '@/plugins/i18n.ts'

import '@mdi/font/css/materialdesignicons.css'

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .use(i18n)
  .mount('#app')
