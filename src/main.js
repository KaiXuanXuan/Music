import './assets/base.css'
import './assets/main.css'
import { auth } from './includes/firebase'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VeeValidation from '@/includes/validation'
import Icon from './directives/icon'
import i18n from './includes/i18n'
import { registerSW } from 'virtual:pwa-register'
import globalComponents from './includes/_global'

registerSW({ immediate: true })

let app

// 监听用户身份验证状态的变化
auth.onAuthStateChanged(() => {
  // 如果应用程序不存在，则创建应用程序实例并进行设置
  if (!app) {
    app = createApp(App)
    app.use(router)
    app.use(createPinia())
    app.use(VeeValidation)
    app.use(i18n)
    app.directive('icon', Icon)
    app.use(globalComponents)

    app.mount('#app')
  }
})
