<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import logoSrc from '../../assets/logo.svg'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const rememberMe = ref(false)
const loginSuccess = ref(false)
const validationErrors = ref({
  email: '',
  password: ''
})

// Initialization - check if we have a session timeout message
const queryParams = router.currentRoute.value.query
const sessionExpired = ref(queryParams.timeout === 'true')
const timeoutReason = ref(queryParams.reason || null)
let timeoutMessage = 'Your session has expired. Please log in again.'

if (timeoutReason.value === 'idle') {
  timeoutMessage = 'Your session has timed out due to inactivity. Please log in again.'
}

// If the authStore has a timeout reason, use that instead
if (authStore.sessionTimeoutReason) {
  sessionExpired.value = true
  if (authStore.sessionTimeoutReason === 'idle') {
    timeoutMessage = 'Your session has timed out due to inactivity. Please log in again.'
  }
}

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
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-content">
        <div class="logo-container">
          <img :src="logoSrc" alt="App Logo" class="app-logo" />
        </div>
        
        <div class="form-container">
          <h1 class="login-title">Log in to your account</h1>
          
          <!-- Session Expired Message -->
          <div v-if="sessionExpired" class="timeout-message">
            <div class="timeout-icon">⚠️</div>
            <p>{{ timeoutMessage }}</p>
          </div>
          
          <!-- Success Message -->
          <div v-if="loginSuccess" class="success-message">
            <div class="success-icon">✓</div>
            <div class="success-text">
              <h3>Login Successful!</h3>
              <p>Redirecting to your dashboard...</p>
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
                class="form-input" 
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
                class="form-input" 
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
                <span class="remember-text">Remember me</span>
              </label>
              
              <a href="#" class="forgot-link">Forgot your password?</a>
            </div>
            
            <button 
              type="submit"
              class="login-button"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="button-spinner"></span>
              <span v-else>Log in</span>
            </button>

            <div class="divider">
              <span>Or</span>
            </div>

            <!-- Social buttons not needed for now -->
            <!-- <div class="social-buttons">
              <button type="button" class="social-button google">
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                <span>Continue with Google</span>
              </button>

              <button type="button" class="social-button microsoft">
                <svg width="18" height="18" viewBox="0 0 21 21">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                </svg>
                <span>Continue with Microsoft</span>
              </button>
            </div> -->
          </form>
        </div>
        
        <div class="register-section" v-if="!loginSuccess">
          <p>
            Don't have an account? 
            <router-link to="/register" class="register-link">Sign up</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 24px;
}

.login-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 32px;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.app-logo {
  height: 40px;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  text-align: center;
}

.error-message {
  background-color: #ffebee;
  color: #f44336;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
}

.login-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: #1976d2;
  outline: none;
}

.options-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.remember-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.remember-checkbox {
  margin-right: 8px;
}

.remember-text {
  font-size: 14px;
}

.forgot-link {
  font-size: 14px;
  color: #1976d2;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
}

.login-button:hover {
  background-color: #1565c0;
}

.login-button:disabled {
  background-color: #90caf9;
  cursor: not-allowed;
}

.button-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #e0e0e0;
}

.divider span {
  padding: 0 16px;
  font-size: 14px;
  color: #757575;
}

.social-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.social-button svg {
  margin-right: 8px;
}

.social-button:hover {
  background-color: #f5f5f5;
}

.register-section {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
}

.register-link {
  color: #1976d2;
  text-decoration: none;
  font-weight: 500;
}

.register-link:hover {
  text-decoration: underline;
}

.validation-error {
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
}

.has-error .form-input {
  border-color: #f44336;
}

.success-message {
  background-color: #e6f7ed;
  border: 1px solid #b7e6cd;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
}

.success-icon {
  width: 30px;
  height: 30px;
  background-color: #4caf50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 16px;
}

.success-text h3 {
  margin: 0 0 4px;
  color: #2e7d32;
  font-size: 16px;
  font-weight: 500;
}

.success-text p {
  margin: 0;
  color: #388e3c;
  font-size: 14px;
}

.timeout-message {
  background-color: #fff8e1;
  border-left: 4px solid #ffc107;
  padding: 12px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  border-radius: 4px;
}

.timeout-icon {
  margin-right: 12px;
  font-size: 20px;
}

.timeout-message p {
  margin: 0;
  color: #5d4037;
}
</style>
