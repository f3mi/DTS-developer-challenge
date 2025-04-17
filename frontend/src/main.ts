import './assets/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import Router from './router'
import ThemePlugin from './plugins/theme'

// Create app
const app = createApp(App)

app.use(createPinia())
app.use(Router)
app.use(ThemePlugin)

app.mount('#app')
