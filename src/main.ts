import { createApp } from 'vue'
import '@phosphor-icons/web/regular'
import '@phosphor-icons/web/bold'
import '@phosphor-icons/web/fill'
import './assets/styles/main.css'
import './assets/styles/custom.css'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
