<script setup lang="ts">
import { onMounted, ref, watchEffect, onBeforeUnmount } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import IdleTimer from './utils/idleTimer'

const router = useRouter()
const authStore = useAuthStore()
const initialLoading = ref(true)
let idleTimer: IdleTimer | null = null

// Initialize the idle timer
const initIdleTimer = () => {
  // Only start idle timer if user is authenticated
  if (authStore.isAuthenticated) {
    // Use 1 minute timeout with 15 second warning (easier to test but not too quick)
    idleTimer = new IdleTimer({
      timeout: 60 * 1000, // 1 minute
      warningTime: 15 * 1000, // 15 second warning
      onIdle: () => {
        console.log('User is idle, logging out')
        // Perform logout
        if (authStore.isAuthenticated) {
          authStore.logout('idle')
          // Redirect to login with timeout reason
          router.push({
            path: '/login',
            query: { timeout: 'true', reason: 'idle' }
          })
        }
      },
      onWarning: () => {
        console.log('Session about to expire due to inactivity')
      },
      idleMessage: 'Your session is about to expire due to inactivity. Click "Stay Logged In" to continue.'
    })
    
    idleTimer.start()
    console.log('Idle timer started with 1-minute timeout')
  } else if (idleTimer) {
    // Stop the timer if user is not authenticated
    idleTimer.stop()
    idleTimer = null
  }
}

// Watch for authentication changes to start/stop the idle timer
watchEffect(() => {
  if (authStore.isAuthenticated) {
    initIdleTimer()
  } else if (idleTimer) {
    idleTimer.stop()
    idleTimer = null
  }
})

// Clean up on component unmount
onBeforeUnmount(() => {
  if (idleTimer) {
    idleTimer.stop()
    idleTimer = null
  }
})

onMounted(async () => {
  // Check if user is authenticated on app load
  if (localStorage.getItem('token')) {
    try {
      await authStore.fetchCurrentUser()
      console.log('User authenticated on app load')
      // Start the idle timer
      initIdleTimer()
    } catch (error) {
      console.error('Failed to authenticate user on app load:', error)
      // Clear invalid authentication state
      authStore.logout('expired')
      
      // If on a protected route, redirect to login
      const currentRoute = router.currentRoute.value
      if (currentRoute.meta.requiresAuth) {
        router.push({ 
          path: '/login',
          query: { timeout: 'true', reason: 'expired', redirect: currentRoute.fullPath }
        })
      }
    }
  } else {
    // No token, ensure we're fully logged out
    authStore.logout()
  }
  
  // Mark initial loading as complete
  initialLoading.value = false
})
</script>

<template>
  <div class="app-container">
    <!-- Initial loading spinner while checking authentication -->
    <div v-if="initialLoading" class="initial-loading">
      <div class="spinner"></div>
      <p>Loading your account...</p>
    </div>
    <!-- Show router view once initial loading is done -->
    <RouterView v-else />
  </div>
</template>

<style>
/* Global styles */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --toastify-color-success: #0ab87b;
  --toastify-color-error: #d83a52;
  --toastify-color-warning: #ff9800;
  --toastify-color-info: #0073ea;
}

html {
  height: 100%;
  font-family: 'Roboto', 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  min-height: 100%;
  background-color: #f7f8fa;
  color: #323338;
  line-height: 1.5;
  margin: 0;
  padding: 0;
}

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Fix for Firefox */
@supports (-moz-appearance: none) {
  body {
    height: 100vh;
  }
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: #c5c7d0;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8abb6;
}

/* Utility classes */
.truncate-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.truncate-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.focus-ring {
  outline: none;
  transition: box-shadow 0.2s;
}

.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 115, 234, 0.3), 0 0 0 4px rgba(0, 115, 234, 0.2);
}

/* Transition classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

* {
  box-sizing: border-box;
}

.initial-loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #1976d2;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
