<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import AppLogo from '../components/AppLogo.vue'
import errorIllustration from '../assets/error-illustration.svg'

const router = useRouter()
const route = useRoute()
const themeStore = useThemeStore()
const isLoading = ref(true)

// Get error information from the route or use defaults
const statusCode = computed(() => route.params.code || '404')
const errorMessage = computed(() => {
  if (route.query.message) return route.query.message
  
  switch (statusCode.value) {
    case '404':
      return 'The page you are looking for does not exist or has been moved.'
    case '403':
      return 'You do not have permission to access this page.'
    case '500':
      return 'Something went wrong on our end. Please try again later.'
    default:
      return 'An error occurred. Please try again later.'
  }
})

onMounted(() => {
  // Simulate loading for a better UX
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
})

// Go back to home or last page
const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <div class="theme-view-container error-page">
    <div v-if="isLoading" class="theme-loading-container loading-container">
      <div class="theme-loader loading-spinner"></div>
      <p class="theme-text-secondary loading-text">Loading error details...</p>
    </div>
    
    <div v-else class="error-content theme-card">
      <div class="error-logo">
        <AppLogo height="50" maxWidth="220" :centered="true" />
      </div>
      
      <div class="error-illustration">
        <img :src="errorIllustration" alt="Error Illustration" />
      </div>
      
      <h1 class="error-title theme-text-primary">Oops! Something went wrong</h1>
      
      <p class="error-description theme-text-secondary">
        {{ errorMessage }}
      </p>
      
      <div class="error-actions">
        <button @click="goHome" class="theme-button-primary primary-button">
          Back to Home
        </button>
        <button @click="goBack" class="theme-button-secondary secondary-button">
          Go Back
        </button>
      </div>
      
      <div class="error-help">
        <p class="theme-text-secondary">Need help? <a href="#" class="theme-link help-link">Contact Support</a></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-primary);
  padding: 20px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 16px;
  font-weight: 500;
}

.error-content {
  max-width: 600px;
  text-align: center;
  padding: 40px;
  border-radius: 12px;
}

.error-logo {
  margin: 0 auto 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-illustration {
  max-width: 300px;
  margin: 0 auto 40px;
}

.error-illustration img {
  width: 100%;
  height: auto;
}

.error-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 16px;
}

.error-description {
  font-size: 16px;
  margin-bottom: 32px;
  line-height: 1.5;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 32px;
}

.primary-button, .secondary-button {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
}

.error-help {
  font-size: 14px;
}

.help-link {
  font-weight: 500;
}

.help-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .error-content {
    padding: 24px;
  }
  
  .error-title {
    font-size: 24px;
  }
  
  .error-description {
    font-size: 14px;
  }
  
  .error-illustration {
    max-width: 220px;
  }
  
  .error-actions {
    flex-direction: column;
  }
}
</style> 