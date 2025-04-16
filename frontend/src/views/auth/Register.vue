<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

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
  <div class="register-container">
    <div class="register-form">
      <div class="logo-container">
        <h1>HMCTS Task Manager</h1>
      </div>
      
      <h2>Create your account</h2>
      
      <div class="form-group">
        <label for="name">Full Name</label>
        <input 
          id="name" 
          type="text" 
          v-model="name" 
          placeholder="Enter your full name"
          autocomplete="name"
        >
      </div>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          id="email" 
          type="email" 
          v-model="email" 
          placeholder="Enter your work email"
          autocomplete="email"
        >
      </div>
      
      <div class="form-group">
        <label for="password">Password</label>
        <input 
          id="password" 
          type="password" 
          v-model="password" 
          placeholder="Create a password"
          autocomplete="new-password"
        >
      </div>
      
      <div class="form-group">
        <label for="confirm-password">Confirm Password</label>
        <input 
          id="confirm-password" 
          type="password" 
          v-model="confirmPassword" 
          placeholder="Confirm your password"
          autocomplete="new-password"
        >
      </div>
      
      <div v-if="authStore.authError" class="error-message">
        {{ authStore.authError }}
      </div>
      
      <button 
        class="register-button" 
        @click="register" 
        :disabled="isLoading"
      >
        <span v-if="isLoading">Processing...</span>
        <span v-else>Create Account</span>
      </button>
      
      <div class="login-link">
        Already have an account? <router-link to="/login">Sign in</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f6f7fb;
}

.register-form {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

h1 {
  color: #0066ff;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
}

h2 {
  font-size: 18px;
  color: #333;
  margin-bottom: 24px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #0066ff;
  outline: none;
}

.error-message {
  color: #e65050;
  font-size: 14px;
  margin-bottom: 16px;
}

.register-button {
  width: 100%;
  padding: 12px;
  background-color: #0066ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.register-button:hover {
  background-color: #0052cc;
}

.register-button:disabled {
  background-color: #99c2ff;
  cursor: not-allowed;
}

.login-link {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.login-link a {
  color: #0066ff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style> 