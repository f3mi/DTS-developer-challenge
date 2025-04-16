import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'

// Import routes
import Dashboard from './views/Dashboard.vue'
import Login from './views/auth/Login.vue'
import Register from './views/auth/Register.vue'
import TaskDetails from './views/TaskDetails.vue'

// Define routes
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard },
  { path: '/task/:id', component: TaskDetails },
]

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Create app
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
