import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const authError = ref('')

  // Login
  const login = (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      // This is a mock implementation
      // In a real app, this would send a request to the backend API
      setTimeout(() => {
        if (email && password) {
          // Simulate successful login
          user.value = {
            id: 1,
            name: 'Test User',
            email,
          }
          isAuthenticated.value = true
          authError.value = ''
          resolve()
        } else {
          // Simulate failed login
          authError.value = 'Invalid email or password'
          reject(new Error('Invalid credentials'))
        }
      }, 1000)
    })
  }

  // Register
  const register = (name: string, email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      // This is a mock implementation
      // In a real app, this would send a request to the backend API
      setTimeout(() => {
        if (name && email && password) {
          // Simulate successful registration
          // In a real app, the user would need to login after registration
          resolve()
        } else {
          // Simulate failed registration
          authError.value = 'Failed to register'
          reject(new Error('Registration failed'))
        }
      }, 1000)
    })
  }

  // Logout
  const logout = () => {
    user.value = null
    isAuthenticated.value = false
  }

  return {
    user,
    isAuthenticated,
    authError,
    login,
    register,
    logout,
  }
})
