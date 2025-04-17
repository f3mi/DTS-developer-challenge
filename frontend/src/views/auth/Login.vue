<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useThemeStore } from '../../stores/theme'
import AppLogo from '../../components/AppLogo.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const rememberMe = ref(false)
const loginSuccess = ref(false)
const validationErrors = ref({
  email: '',
  password: ''
})

// Determine if we should show the session timeout message
const checkSessionExpired = () => {
  // Direct query parameter check (from router navigation)
  const hasTimeoutParam = route.query.timeout === 'true'
  const timeoutReason = route.query.reason as string || null
  
  // Check if it's an actual logout or timeout (not a first-time login)
  if (hasTimeoutParam || authStore.sessionTimeoutReason) {
    return {
      expired: true,
      reason: timeoutReason || authStore.sessionTimeoutReason || 'expired',
      message: getTimeoutMessage(timeoutReason || authStore.sessionTimeoutReason)
    }
  }

  return {
    expired: false,
    reason: null,
    message: ''
  }
}

// Generate appropriate timeout message based on reason
const getTimeoutMessage = (reason: string | null) => {
  if (reason === 'idle') {
    return 'Your session has timed out due to inactivity. Please log in again.'
  } else if (reason === 'expired') {
    return 'Your session has expired. Please log in again.'
  } else {
    return 'You have been logged out. Please log in again to continue.'
  }
}

// Get session expiry state
const sessionState = computed(() => checkSessionExpired())

// Check for remembered credentials
onMounted(() => {
  // Initialize remember me from stored value
  rememberMe.value = Boolean(localStorage.getItem('rememberMe'))
})

// Computed properties for validation
const isEmailValid = computed(() => {
  if (!email.value) return true
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

// Validation functions
const validateEmail = () => {
  if (!email.value.trim()) {
    validationErrors.value.email = 'Email is required'
    return false
  }
  if (!isEmailValid.value) {
    validationErrors.value.email = 'Please enter a valid email address'
    return false
  }
  validationErrors.value.email = ''
  return true
}

const validatePassword = () => {
  if (!password.value) {
    validationErrors.value.password = 'Password is required'
    return false
  }
  validationErrors.value.password = ''
  return true
}

// Form validation
const validateForm = () => {
  const emailValid = validateEmail()
  const passwordValid = validatePassword()
  
  return emailValid && passwordValid
}

const login = async () => {
  // Reset error and success state
  authStore.authError = ''
  loginSuccess.value = false
  
  // Validate form
  if (!validateForm()) {
    return
  }
  
  try {
    isLoading.value = true
    // Pass the remember me setting to the login method
    const userData = await authStore.login(email.value, password.value, rememberMe.value)
    
    // Show success message
    loginSuccess.value = true
    
    // Clear form
    email.value = ''
    password.value = ''
    
    // Get the redirect path from the query parameters if present
    const redirectPath = router.currentRoute.value.query.redirect || '/dashboard'
    
    // Redirect after a delay for user to see success message
    setTimeout(() => {
      router.push(redirectPath.toString())
    }, 1500)
  } catch (error) {
    // Error is already set in the store
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}

// Toggle theme
const toggleTheme = () => {
  themeStore.toggleTheme()
}
</script>

<template>
  <div class="theme-view-container login-page">
    <div class="theme-card login-container">
      <div class="login-content">
        <div class="logo-container">
          <AppLogo height="48" maxWidth="200" :centered="true" />
          <div class="theme-toggle">
            <button @click="toggleTheme" class="theme-toggle-button">
              <span v-if="themeStore.isDark" class="theme-icon">🌙</span>
              <span v-else class="theme-icon">☀️</span>
            </button>
          </div>
        </div>
        
        <div class="form-container">
          <h1 class="login-title theme-text-primary">Log in to your account</h1>
          
          <!-- Session Expired Message - only shown when actually expired -->
          <div v-if="sessionState.expired" class="timeout-message">
            <div class="timeout-icon">⚠️</div>
            <p class="theme-text-primary">{{ sessionState.message }}</p>
          </div>
          
          <!-- Success Message -->
          <div v-if="loginSuccess" class="success-message">
            <div class="success-icon">✓</div>
            <div class="success-text">
              <h3 class="theme-text-primary">Login Successful!</h3>
              <p class="theme-text-secondary">Redirecting to your dashboard...</p>
            </div>
          </div>
          
          <!-- Server Error -->
          <div v-if="authStore.authError" class="error-message">
            {{ authStore.authError }}
          </div>
          
          <form @submit.prevent="login" class="login-form" v-if="!loginSuccess">
            <div class="form-group" :class="{ 'has-error': validationErrors.email }">
              <input 
                id="email" 
                type="email" 
                v-model="email" 
                class="form-input theme-input" 
                placeholder="Work email"
                @blur="validateEmail"
                required
              />
              <div v-if="validationErrors.email" class="validation-error">
                {{ validationErrors.email }}
              </div>
            </div>
            
            <div class="form-group" :class="{ 'has-error': validationErrors.password }">
              <input 
                id="password" 
                type="password" 
                v-model="password" 
                class="form-input theme-input" 
                placeholder="Password"
                @blur="validatePassword"
                required
              />
              <div v-if="validationErrors.password" class="validation-error">
                {{ validationErrors.password }}
              </div>
            </div>
            
            <div class="options-container">
              <label class="remember-wrapper">
                <input 
                  type="checkbox" 
                  v-model="rememberMe"
                  class="remember-checkbox"
                />
                <span class="remember-text theme-text-secondary">Remember me</span>
              </label>
              
              <a href="#" class="forgot-link theme-text-primary">Forgot your password?</a>
            </div>
            
            <button 
              type="submit"
              class="login-button theme-button-primary"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="button-spinner theme-loader"></span>
              <span v-else>Log in</span>
            </button>
            
            <div class="register-prompt">
              <span class="theme-text-secondary">Don't have an account?</span>
              <router-link to="/register" class="register-link">Register</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: var(--bg-primary);
}

.login-container {
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.login-content {
  padding: 40px;
}

.logo-container {
  position: relative;
  width: 100%;
  margin-bottom: 32px;
  text-align: center;
}

.theme-toggle {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.theme-toggle-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.theme-toggle-button:hover {
  background-color: var(--hover-bg);
}

.theme-icon {
  font-size: 20px;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  text-align: center;
}

.timeout-message {
  display: flex;
  align-items: center;
  background-color: rgba(255, 193, 7, 0.15);
  color: var(--warning-color);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.timeout-icon {
  margin-right: 12px;
  font-size: 20px;
}

.success-message {
  display: flex;
  align-items: center;
  background-color: rgba(76, 175, 80, 0.15);
  color: var(--success-color);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: var(--success-color);
  color: white;
  border-radius: 50%;
  margin-right: 12px;
  font-size: 16px;
}

.error-message {
  background-color: rgba(244, 67, 54, 0.15);
  color: var(--error-color);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 16px;
}

.form-input {
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.has-error .form-input {
  border-color: var(--error-color);
}

.validation-error {
  color: var(--error-color);
  font-size: 12px;
  margin-top: 4px;
}

.options-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.remember-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.remember-checkbox {
  margin-right: 8px;
}

.remember-text, .forgot-link {
  font-size: 14px;
}

.forgot-link {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover {
  text-decoration: underline;
}

.login-button {
  height: 44px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-spinner {
  width: 20px;
  height: 20px;
}

.register-prompt {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
}

.register-link {
  color: var(--primary-color);
  text-decoration: none;
  margin-left: 4px;
  font-weight: 500;
  transition: color 0.2s;
}

.register-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-content {
    padding: 24px;
  }
}
</style>
