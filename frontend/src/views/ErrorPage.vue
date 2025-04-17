<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import logoSrc from '../assets/logo.svg'

const router = useRouter()
const isLoading = ref(true)
const dotsCount = ref(3)

onMounted(() => {
  // Simulate loading for a better UX
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
  
  // Animate loading dots
  const dotsInterval = setInterval(() => {
    dotsCount.value = (dotsCount.value % 3) + 1
  }, 500)
  
  // Clean up interval
  return () => clearInterval(dotsInterval)
})

// Navigate back to dashboard
function goToDashboard() {
  router.push('/dashboard')
}
</script>

<template>
  <div class="error-page">
    <div v-if="isLoading" class="loading-container">
      <div class="loading-text">
        Loading<span v-for="n in dotsCount" :key="n">.</span><span v-for="n in 3-dotsCount" :key="`empty-${n}`" class="invisible-dot">.</span>
      </div>
    </div>
    
    <div v-else class="error-content">
      <div class="error-logo">
        <img :src="logoSrc" alt="App Logo" class="app-logo" />
      </div>
      
      <div class="error-illustration">
        <img src="https://cdn.monday.com/images/404_error_page/error-header-img.svg" alt="Error Illustration" />
      </div>
      
      <h1 class="error-title">Oops! Something went wrong</h1>
      
      <p class="error-description">
        We couldn't find the page you're looking for. The page might be temporarily unavailable, moved or no longer exist.
      </p>
      
      <div class="error-actions">
        <button @click="goToDashboard" class="primary-button">
          Back to Dashboard
        </button>
      </div>
      
      <div class="error-help">
        <p>Need help? <a href="#" class="help-link">Contact Support</a></p>
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
  background-color: #f6f7fb;
  font-family: 'Roboto', sans-serif;
  padding: 20px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.loading-text {
  font-size: 24px;
  color: #0073ea;
  font-weight: 500;
}

.invisible-dot {
  opacity: 0;
}

.error-content {
  max-width: 600px;
  text-align: center;
}

.error-logo {
  width: 220px;
  margin: 0 auto 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.app-logo {
  width: 100%;
  height: auto;
  max-width: 220px;
  display: block;
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
  font-size: 32px;
  font-weight: 700;
  color: #323338;
  margin-bottom: 16px;
}

.error-description {
  font-size: 16px;
  color: #676879;
  margin-bottom: 32px;
  line-height: 1.5;
}

.error-actions {
  margin-bottom: 32px;
}

.primary-button {
  background-color: #0073ea;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-button:hover {
  background-color: #0060b9;
}

.error-help {
  font-size: 14px;
  color: #676879;
}

.help-link {
  color: #0073ea;
  text-decoration: none;
  font-weight: 500;
}

.help-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .error-title {
    font-size: 24px;
  }
  
  .error-description {
    font-size: 14px;
  }
  
  .error-illustration {
    max-width: 220px;
  }
}
</style> 