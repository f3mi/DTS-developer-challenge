<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

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
        <svg viewBox="0 0 136 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M98.0717 21.3943C98.0717 17.0307 94.5449 13.631 90.0361 13.631C85.5273 13.631 82.0004 17.0307 82.0004 21.3943C82.0004 25.7579 85.5272 29.1577 90.0361 29.1577C94.5449 29.1577 98.0717 25.7579 98.0717 21.3943Z" fill="#FF3D57"/>
          <path d="M70.8345 21.3943C70.8345 17.0307 67.3078 13.631 62.7989 13.631C58.29 13.631 54.7632 17.0307 54.7632 21.3943C54.7632 25.7579 58.29 29.1577 62.7989 29.1577C67.3078 29.1577 70.8345 25.7579 70.8345 21.3943Z" fill="#FFCC00"/>
          <path d="M43.5975 21.3943C43.5975 17.0307 40.0708 13.631 35.5619 13.631C31.053 13.631 27.5262 17.0307 27.5262 21.3943C27.5262 25.7579 31.053 29.1577 35.5619 29.1577C40.0708 29.1577 43.5975 25.7579 43.5975 21.3943Z" fill="#00D647"/>
          <path d="M16.3604 21.3943C16.3604 17.0307 12.8336 13.631 8.32472 13.631C3.81585 13.631 0.289062 17.0307 0.289062 21.3943C0.289062 25.7579 3.81585 29.1577 8.32472 29.1577C12.8336 29.1577 16.3604 25.7579 16.3604 21.3943Z" fill="#00A0FF"/>
          <path d="M134.538 16.9272H133.917V22.1459L129.833 16.9272H129.213V25.8615H129.833V20.7518L133.917 25.8615H134.538V16.9272Z" fill="#333333"/>
          <path d="M121.392 25.8615H126.096V25.2939H122.012V21.6874H125.476V21.1198H122.012V17.4948H126.096V16.9272H121.392V25.8615Z" fill="#333333"/>
          <path d="M114.096 16.9272L111.039 25.8615H111.659L112.485 23.3963H116.012L116.839 25.8615H117.459L114.402 16.9272H114.096ZM112.692 22.8287L114.249 18.2439L115.805 22.8287H112.692Z" fill="#333333"/>
          <path d="M103.517 16.9272V25.8615H104.138V21.6874H105.787L107.343 25.8615H108.17L106.408 21.4059C107.343 21.0364 107.963 20.1826 107.963 19.142C107.963 18.1013 107.136 16.9272 105.408 16.9272H103.517ZM104.138 17.4948H105.408C106.615 17.4948 107.343 18.2192 107.343 19.1421C107.343 20.0651 106.615 21.1198 105.408 21.1198H104.138V17.4948Z" fill="#333333"/>
        </svg>
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
  width: 120px;
  margin: 0 auto 40px;
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