<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const isLoading = ref(false)

const login = async () => {
  if (!email.value || !password.value) {
    authStore.authError = 'Please enter both email and password'
    return
  }
  
  try {
    isLoading.value = true
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (error) {
    isLoading.value = false
    // The error is already handled and set in the store
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-form">
      <div class="logo-container">
        <h1>HMCTS Task Manager</h1>
      </div>
      
      <h2>Log in to your account</h2>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          id="email" 
          type="email" 
          v-model="email" 
          placeholder="Enter your email"
          autocomplete="email"
        >
      </div>
      
      <div class="form-group">
        <label for="password">Password</label>
        <input 
          id="password" 
          type="password" 
          v-model="password" 
          placeholder="Enter your password"
          autocomplete="current-password"
        >
      </div>
      
      <div v-if="authStore.authError" class="error-message">
        {{ authStore.authError }}
      </div>
      
      <button 
        class="login-button" 
        @click="login" 
        :disabled="isLoading"
      >
        <span v-if="isLoading">Loading...</span>
        <span v-else>Log In</span>
      </button>
      
      <div class="register-link">
        Don't have an account? <router-link to="/register">Sign up</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
}

.login-form {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.logo-container {
  margin-bottom: 24px;
}

.logo-container h1 {
  color: #0052cc;
  font-size: 28px;
  font-weight: bold;
}

h2 {
  font-size: 20px;
  color: #333;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
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
  padding: 12px 16px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #0052cc;
  outline: none;
}

.error-message {
  color: #e65050;
  font-size: 14px;
  margin-bottom: 16px;
}

.login-button {
  width: 100%;
  padding: 14px;
  background-color: #0052cc;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #0041a3;
}

.login-button:disabled {
  background-color: #99c2ff;
  cursor: not-allowed;
}

.register-link {
  margin-top: 24px;
  font-size: 14px;
}

.register-link a {
  color: #0052cc;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
