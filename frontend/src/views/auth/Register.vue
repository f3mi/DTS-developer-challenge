<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useThemeStore } from '../../stores/theme'
import logoSrc from '../../assets/logo.svg'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const agreeToTerms = ref(false)
const registerSuccess = ref(false)
const validationErrors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: ''
})

// Computed properties for validation
const isEmailValid = computed(() => {
  if (!email.value) return true
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

const isPasswordValid = computed(() => {
  if (!password.value) return true
  return password.value.length >= 8
})

const doPasswordsMatch = computed(() => {
  if (!confirmPassword.value) return true
  return password.value === confirmPassword.value
})

// Validation functions
const validateName = () => {
  if (!name.value.trim()) {
    validationErrors.value.name = 'Name is required'
    return false
  }
  validationErrors.value.name = ''
  return true
}

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
  if (!isPasswordValid.value) {
    validationErrors.value.password = 'Password must be at least 8 characters'
    return false
  }
  validationErrors.value.password = ''
  return true
}

const validateConfirmPassword = () => {
  if (!confirmPassword.value) {
    validationErrors.value.confirmPassword = 'Please confirm your password'
    return false
  }
  if (!doPasswordsMatch.value) {
    validationErrors.value.confirmPassword = 'Passwords do not match'
    return false
  }
  validationErrors.value.confirmPassword = ''
  return true
}

const validateTerms = () => {
  if (!agreeToTerms.value) {
    validationErrors.value.terms = 'You must agree to the terms and conditions'
    return false
  }
  validationErrors.value.terms = ''
  return true
}

// Form validation
const validateForm = () => {
  const nameValid = validateName()
  const emailValid = validateEmail()
  const passwordValid = validatePassword()
  const confirmPasswordValid = validateConfirmPassword()
  const termsValid = validateTerms()
  
  return nameValid && emailValid && passwordValid && confirmPasswordValid && termsValid
}

const register = async () => {
  // Reset
  authStore.authError = ''
  registerSuccess.value = false
  
  // Validate form
  if (!validateForm()) {
    return
  }
  
  try {
    isLoading.value = true
    await authStore.register(name.value, email.value, password.value)
    
    // Show success message
    registerSuccess.value = true
    
    // Clear form
    name.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    agreeToTerms.value = false
    
    // Redirect after a delay for user to see success message
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    // Error is already set in the store
    console.error('Registration error:', error)
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
  <div class="theme-view-container register-page">
    <div class="register-container">
      <div class="theme-card register-content">
        <div class="logo-container">
          <img :src="logoSrc" alt="App Logo" class="app-logo" />
          <div class="theme-toggle">
            <button @click="toggleTheme" class="theme-toggle-button">
              <span v-if="themeStore.isDark" class="theme-icon">🌙</span>
              <span v-else class="theme-icon">☀️</span>
            </button>
          </div>
        </div>
        
        <div class="form-container">
          <h1 class="register-title theme-text-primary">Sign up for free</h1>
          
          <!-- Success Message -->
          <div v-if="registerSuccess" class="theme-success-alert success-message">
            <div class="theme-success-icon success-icon">✓</div>
            <div class="success-text">
              <h3 class="theme-text-primary">Registration Successful!</h3>
              <p class="theme-text-secondary">Redirecting you to login...</p>
            </div>
          </div>
          
          <!-- Server Error -->
          <div v-if="authStore.authError" class="theme-error-alert error-message">
            {{ authStore.authError }}
          </div>
          
          <form @submit.prevent="register" class="register-form" v-if="!registerSuccess">
            <div class="form-group" :class="{ 'has-error': validationErrors.name }">
              <input 
                id="name" 
                type="text" 
                v-model="name" 
                class="theme-input form-input" 
                placeholder="Full name"
                @blur="validateName"
                required
              />
              <div v-if="validationErrors.name" class="validation-error">
                {{ validationErrors.name }}
              </div>
            </div>
            
            <div class="form-group" :class="{ 'has-error': validationErrors.email }">
              <input 
                id="email" 
                type="email" 
                v-model="email" 
                class="theme-input form-input" 
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
                class="theme-input form-input" 
                placeholder="Password (8+ characters)"
                @blur="validatePassword"
                required
              />
              <div v-if="validationErrors.password" class="validation-error">
                {{ validationErrors.password }}
              </div>
            </div>
            
            <div class="form-group" :class="{ 'has-error': validationErrors.confirmPassword }">
              <input 
                id="confirm-password" 
                type="password" 
                v-model="confirmPassword" 
                class="theme-input form-input" 
                placeholder="Confirm password"
                @blur="validateConfirmPassword"
                required
              />
              <div v-if="validationErrors.confirmPassword" class="validation-error">
                {{ validationErrors.confirmPassword }}
              </div>
            </div>
            
            <div class="terms-container" :class="{ 'has-error': validationErrors.terms }">
              <label class="terms-wrapper">
              <input 
                type="checkbox" 
                v-model="agreeToTerms"
                class="terms-checkbox"
                @change="validateTerms"
              />
                <span class="terms-text theme-text-secondary">
                  I agree to the 
                  <a href="#" class="terms-link theme-link">Terms of Service</a> 
                  and 
                  <a href="#" class="terms-link theme-link">Privacy Policy</a>
                </span>
              </label>
              <div v-if="validationErrors.terms" class="validation-error terms-error">
                {{ validationErrors.terms }}
              </div>
            </div>
            
            <button 
              type="submit"
              class="theme-button-primary register-button"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="theme-loader button-spinner"></span>
              <span v-else>Continue</span>
            </button>

            <div class="divider">
              <span class="theme-text-secondary">Or</span>
            </div>
          </form>
        </div>
        
        <div class="login-section">
          <p class="theme-text-secondary">
            Already have an account? 
            <router-link to="/login" class="theme-link login-link">Log in</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  display: flex;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-primary);
}

.register-container {
  width: 100%;
  max-width: 480px;
  margin: 40px auto;
  padding: 0 20px;
}

.register-content {
  padding: 40px;
}

.logo-container {
  text-align: center;
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.app-logo {
  width: 200px;
  height: auto;
  max-width: 100%;
  margin: 0 auto;
  display: block;
}

.theme-toggle {
  position: absolute;
  right: 0;
  top: 0;
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

.register-title {
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 32px;
  text-align: center;
}

.form-container {
  margin-bottom: 24px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;
  outline: none;
}

.terms-container {
  margin-bottom: 8px;
}

.terms-wrapper {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
}

.terms-checkbox {
  width: 16px;
  height: 16px;
  margin-top: 3px;
  accent-color: var(--primary-color);
}

.terms-text {
  margin-left: 8px;
  font-size: 14px;
  line-height: 1.5;
}

.register-button {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
}

.register-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.button-spinner {
  width: 20px;
  height: 20px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
  font-size: 14px;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid var(--border-color);
}

.divider span {
  margin: 0 12px;
}

.login-section {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
}

.validation-error {
  color: var(--error-color);
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
}

.terms-error {
  margin-left: 24px;
}

.has-error .form-input {
  border-color: var(--error-color);
}

.success-message {
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
}

.success-icon {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 16px;
}

.success-text h3 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 500;
}

.success-text p {
  margin: 0;
  font-size: 14px;
}
</style> 