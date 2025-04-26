import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/Login.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/Register.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/task-details',
      name: 'task-details',
      component: () => import('../views/TaskDetails.vue'),
      meta: { requiresAuth: true },
      props: (route) => ({ taskId: Number(route.query.id) }),
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('../views/Tasks.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/calender',
      name: 'calender',
      component: () => import('../views/Calender.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/error',
      name: 'error',
      component: () => import('../views/ErrorPage.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/error',
    },
  ],
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Quick path for when app is already authenticated
  if (to.meta.requiresAuth && authStore.isAuthenticated) {
    next()
    return
  }

  // Check if there's a token in localStorage but user isn't authenticated in the store
  const storedToken = localStorage.getItem('token')

  // If we have a token but not authenticated state
  if (storedToken && !authStore.isAuthenticated) {
    try {
      // Try to fetch current user to validate token
      if (typeof authStore.fetchCurrentUser === 'function') {
        await authStore.fetchCurrentUser()
      } else {
        // If fetchCurrentUser method not available, clear storage to be safe
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('rememberMe')
      }
    } catch (error) {
      // Token is invalid or expired - clear all auth state
      console.error('Auth validation error:', error)

      if (typeof authStore.logout === 'function') {
        authStore.logout()
      } else {
        // Manual cleanup if logout method not available
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('rememberMe')
      }

      // If trying to access protected route, redirect to login
      if (to.meta.requiresAuth) {
        next({
          name: 'login',
          query: { redirect: to.fullPath },
        })
        return
      }
    }
  }

  // Protected route handling
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('Access denied to protected route:', to.path)
    // Redirect to login and remember where they were going
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    })
    return
  }

  // Guest only route handling (prevents logged in users from accessing login/register)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
    return
  }

  // Clear any query params related to authentication when navigating away from login/register
  const clearAuthParams = (path: string) => {
    if (path !== '/login' && path !== '/register' && Object.keys(to.query).length > 0) {
      const query = { ...to.query }
      delete query.redirect
      router.replace({ path, query })
    }
  }

  // For all other routes, proceed normally
  clearAuthParams(to.path)
  next()
})

export default router
