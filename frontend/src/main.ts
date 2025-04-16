import './assets/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'

// Import routes
import Dashboard from './views/Dashboard.vue'
import Tasks from './views/Tasks.vue'
import Calender from './views/Calender.vue'
import Login from './views/auth/Login.vue'
import Register from './views/auth/Register.vue'
import TaskDetails from './views/TaskDetails.vue'
import ErrorPage from './views/ErrorPage.vue'

// Define routes
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard },
  { path: '/tasks', component: Tasks },
  { path: '/task/:id', component: TaskDetails },
  { path: '/calender', component: Calender },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: ErrorPage },
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
