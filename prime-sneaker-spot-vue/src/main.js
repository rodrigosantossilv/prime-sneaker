import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import { createPinia } from 'pinia'

import './assets/styler.css'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')