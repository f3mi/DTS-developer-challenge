<script setup lang="ts">
import { onMounted, ref, watchEffect, onBeforeUnmount } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useThemeStore } from './stores/theme'
import NotificationToast from './components/NotificationToast.vue'
import IdleTimer from './utils/idleTimer'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const initialLoading = ref(true)
let idleTimer: IdleTimer | null = null

// Initialize theme system
onMounted(() => {
  // Setup listener for system theme changes
  const cleanupThemeListener = themeStore.setupSystemThemeListener()
  
  // Clean up listener on component unmount
  onBeforeUnmount(() => {
    cleanupThemeListener()
  })
})

// Initialize the idle timer
const initIdleTimer = () => {
  // Stop any existing timer first
  stopIdleTimer()
  
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
  }
}

// Stop the idle timer
const stopIdleTimer = () => {
  if (idleTimer) {
    idleTimer.stop()
    idleTimer = null
    console.log('Idle timer stopped')
  }
}

// Watch for authentication changes to start/stop the idle timer
watchEffect(() => {
  if (authStore.isAuthenticated) {
    initIdleTimer()
  } else {
    stopIdleTimer()
  }
})

// Clean up on component unmount
onBeforeUnmount(() => {
  stopIdleTimer()
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
      // Ensure idle timer is stopped
      stopIdleTimer()
      
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
    // Make sure idle timer is stopped
    stopIdleTimer()
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
    
    <!-- Global notification toast component -->
    <NotificationToast />
  </div>
</template>

<style>
/* Global styles */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Light theme variables (default) */
:root {
  /* Primary palette */
  --primary-color: #1976d2;
  --primary-light: #42a5f5;
  --primary-dark: #0d47a1;
  --primary-text: #ffffff;
  
  /* Secondary palette */
  --secondary-color: #4caf50;
  --secondary-light: #80e27e;
  --secondary-dark: #087f23;
  --secondary-text: #ffffff;
  
  /* Text colors */
  --text-primary: #323338;
  --text-secondary: #676879;
  --text-disabled: #b3b3b3;
  
  /* Background colors */
  --bg-primary: #f7f8fa;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f5f6f8;
  --bg-card: #ffffff;
  
  /* Border colors */
  --border-color: #e6e9ef;
  --divider-color: #e0e0e0;
  
  /* Status colors */
  --success-color: #00c875;
  --error-color: #f44336;
  --warning-color: #ff9800;
  --info-color: #2196f3;
  
  /* Task status colors */
  --status-new: #4CAF50;
  --status-in-progress: #2196F3;
  --status-review: #FFC107;
  --status-completed: #9C27B0;
  
  /* UI element colors */
  --shadow-color: rgba(0, 0, 0, 0.1);
  --hover-bg: #f5f5f5;
  --focus-ring: rgba(0, 115, 234, 0.3);
  
  /* Scrollbar colors */
  --scrollbar-track: #f1f1f1;
  --scrollbar-thumb: #c5c7d0;
  --scrollbar-thumb-hover: #a8abb6;
  
  /* Toast colors */
  --toastify-color-success: #0ab87b;
  --toastify-color-error: #d83a52;
  --toastify-color-warning: #ff9800;
  --toastify-color-info: #0073ea;
}

/* Dark theme variables */
.dark-theme {
  /* Primary palette */
  --primary-color: #42a5f5;
  --primary-light: #80d6ff;
  --primary-dark: #0077c2;
  --primary-text: #ffffff;
  
  /* Secondary palette */
  --secondary-color: #4caf50;
  --secondary-light: #80e27e;
  --secondary-dark: #087f23;
  --secondary-text: #ffffff;
  
  /* Text colors */
  --text-primary: #e0e0e0;
  --text-secondary: #9e9e9e;
  --text-disabled: #616161;
  
  /* Background colors */
  --bg-primary: #121212;
  --bg-secondary: #1e1e1e;
  --bg-tertiary: #2c2c2c;
  --bg-card: #2c2c2c;
  
  /* Border colors */
  --border-color: #424242;
  --divider-color: #424242;
  
  /* Status colors */
  --success-color: #00c853;
  --error-color: #ff5252;
  --warning-color: #ffab40;
  --info-color: #448aff;
  
  /* Task status colors */
  --status-new: #66bb6a;
  --status-in-progress: #42a5f5;
  --status-review: #ffca28;
  --status-completed: #ba68c8;
  
  /* UI element colors */
  --shadow-color: rgba(0, 0, 0, 0.3);
  --hover-bg: #383838;
  --focus-ring: rgba(66, 165, 245, 0.4);
  
  /* Scrollbar colors */
  --scrollbar-track: #2c2c2c;
  --scrollbar-thumb: #616161;
  --scrollbar-thumb-hover: #757575;
  
  /* Toast colors */
  --toastify-color-success: #00c853;
  --toastify-color-error: #ff5252;
  --toastify-color-warning: #ffab40;
  --toastify-color-info: #448aff;
}

html {
  height: 100%;
  font-family: 'Roboto', 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  min-height: 100%;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.5;
  margin: 0;
  padding: 0;
  transition: background-color 0.3s ease, color 0.3s ease;
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
  background: var(--scrollbar-track);
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover);
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
  box-shadow: 0 0 0 2px var(--focus-ring), 0 0 0 4px rgba(0, 115, 234, 0.2);
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
  background-color: var(--bg-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Dark mode overrides for spinner */
.dark-theme .spinner {
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--primary-color);
}
</style>
