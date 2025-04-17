<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import logoSrc from '../../assets/logo.svg'

const router = useRouter()
const authStore = useAuthStore()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const agreeToTerms = ref(false)

const register = async () => {
  // Reset error
  authStore.authError = ''

  // Form validation
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    authStore.authError = 'Please fill in all fields'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    authStore.authError = 'Passwords do not match'
    return
  }

  if (!agreeToTerms.value) {
    authStore.authError = 'Please agree to the terms and conditions'
    return
  }
  
  try {
    isLoading.value = true
    await authStore.register(name.value, email.value, password.value)
    router.push('/login')
  } catch (error) {
    isLoading.value = false
    // Error is already set in the store
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-content">
        <div class="logo-container">
          <img :src="logoSrc" alt="App Logo" class="app-logo" />
        </div>
        
        <div class="form-container">
          <h1 class="register-title">Sign up for free</h1>
          
          <div v-if="authStore.authError" class="error-message">
            {{ authStore.authError }}
          </div>
          
          <form @submit.prevent="register" class="register-form">
            <div class="form-group">
              <input 
                id="name" 
                type="text" 
                v-model="name" 
                class="form-input" 
                placeholder="Full name"
                required
              />
            </div>
            
            <div class="form-group">
              <input 
                id="email" 
                type="email" 
                v-model="email" 
                class="form-input" 
                placeholder="Work email"
                required
              />
            </div>
            
            <div class="form-group">
              <input 
                id="password" 
                type="password" 
                v-model="password" 
                class="form-input" 
                placeholder="Password (8+ characters)"
                required
              />
            </div>
            
            <div class="form-group">
              <input 
                id="confirm-password" 
                type="password" 
                v-model="confirmPassword" 
                class="form-input" 
                placeholder="Confirm password"
                required
              />
            </div>
            
            <div class="terms-container">
              <label class="terms-wrapper">
              <input 
                type="checkbox" 
                v-model="agreeToTerms"
                class="terms-checkbox"
              />
                <span class="terms-text">
                  I agree to the 
                  <a href="#" class="terms-link">Terms of Service</a> 
                  and 
                  <a href="#" class="terms-link">Privacy Policy</a>
                </span>
              </label>
            </div>
            
            <button 
              type="submit"
              class="register-button"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="button-spinner"></span>
              <span v-else>Continue</span>
            </button>

            <div class="divider">
              <span>Or</span>
            </div>

              <div class="social-buttons">
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
            </div>
          </form>
        </div>
        
        <div class="login-section">
          <p>
            Already have an account? 
            <router-link to="/login" class="login-link">Log in</router-link>
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
  background-color: #f6f7fb;
  font-family: 'Roboto', sans-serif;
}

.register-container {
  width: 100%;
  max-width: 480px;
  margin: 40px auto;
  padding: 0 20px;
}

.register-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 40px;
}

.logo-container {
  text-align: center;
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.app-logo {
  width: 200px;
  height: auto;
  max-width: 100%;
  margin: 0 auto;
  display: block;
}

.register-title {
  font-size: 32px;
  font-weight: 500;
  color: #323338;
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
  border: 1px solid #c3c6d4;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;
  outline: none;
}

.form-input:focus {
  border-color: #0073ea;
  box-shadow: 0 0 0 2px rgba(0, 115, 234, 0.2);
}

.form-input::placeholder {
  color: #b2b2b2;
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
  accent-color: #0073ea;
}

.terms-text {
  margin-left: 8px;
  font-size: 14px;
  color: #676879;
  line-height: 1.5;
}

.terms-link {
  color: #0073ea;
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  text-decoration: underline;
}

.register-button {
  background-color: #0073ea;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
}

.register-button:hover {
  background-color: #0060c0;
}

.register-button:disabled {
  background-color: #c3c6d4;
  cursor: not-allowed;
}

.button-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
  color: #676879;
  font-size: 14px;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #e1e1e1;
}

.divider span {
  margin: 0 12px;
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
  background-color: white;
  border: 1px solid #c3c6d4;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #323338;
  cursor: pointer;
  transition: background-color 0.2s;
}

.social-button svg {
  margin-right: 12px;
}

.social-button:hover {
  background-color: #f6f7fb;
}

.login-section {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #676879;
}

.login-link {
  color: #0073ea;
  text-decoration: none;
  font-weight: 500;
}

.login-link:hover {
  text-decoration: underline;
}

.error-message {
  padding: 12px;
  background-color: #ffebe9;
  border: 1px solid #ffc7c7;
  border-radius: 4px;
  color: #d83a52;
  font-size: 14px;
  margin-bottom: 16px;
}
</style> 