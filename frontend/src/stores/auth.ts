import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import secureStorage from '../utils/secureStorage'

// Constants for storage keys
const TOKEN_KEY = 'token'
const USER_KEY = 'user'
const REMEMBER_ME_KEY = 'rememberMe'

// Define the base API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Configure axios defaults
axios.defaults.baseURL = API_URL
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Accept'] = 'application/json'

// Add request interceptor to include JWT token with every request
axios.interceptors.request.use(
  (config) => {
    const token = secureStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor to handle expired tokens
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If token expired (401) and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Force logout with secure storage
      secureStorage.removeItem(TOKEN_KEY)
      secureStorage.removeItem(USER_KEY)
      secureStorage.removeItem(REMEMBER_ME_KEY)

      // Redirect to login after a short delay (allows time for this request to finish)
      setTimeout(() => {
        window.location.href = '/login'
      }, 100)
    }

    return Promise.reject(error)
  },
)

interface User {
  id: number
  name: string
  email: string
  role?: string
}

interface AuthResponse {
  user: User
  token: string
}

export type SessionTimeoutReason = 'idle' | 'expired' | 'manual' | null

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const authError = ref('')
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const sessionTimeoutReason = ref<SessionTimeoutReason>(null)
  const rememberMe = ref(false)

  // Initialize from secureStorage if available
  const initAuth = () => {
    try {
      const storedToken = secureStorage.getItem(TOKEN_KEY, false) // Get raw value first
      let storedUser = null

      // Check if remember me was set
      const rememberedUser = secureStorage.getItem(REMEMBER_ME_KEY, false)
      if (rememberedUser) {
        rememberMe.value = true
      }

      // Only try to get user if token exists
      if (storedToken) {
        try {
          // Try to get and parse user data
          storedUser = secureStorage.getItem(USER_KEY)
        } catch (error) {
          console.error('Failed to parse user data from storage, clearing auth state', error)
          // If user data is corrupted, clear everything
          secureStorage.removeItem(TOKEN_KEY)
          secureStorage.removeItem(USER_KEY)
          secureStorage.removeItem(REMEMBER_ME_KEY)
          return
        }
      }

      // Only set authentication if we have both valid token and user data
      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = storedUser
        isAuthenticated.value = true
        setAuthHeader(storedToken)
      }
    } catch (error) {
      // If anything fails, log and clear auth state
      console.error('Error initializing auth state, clearing data', error)
      secureStorage.removeItem(TOKEN_KEY)
      secureStorage.removeItem(USER_KEY)
      secureStorage.removeItem(REMEMBER_ME_KEY)
    }
  }

  // Set token in axios headers
  const setAuthHeader = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }

  // Login
  const login = async (email: string, password: string, shouldRemember = false) => {
    try {
      authError.value = ''
      isLoading.value = true
      sessionTimeoutReason.value = null
      rememberMe.value = shouldRemember

      const response = await axios.post<AuthResponse>(`/auth/login`, {
        email,
        password,
      })

      const { user: userData, token: userToken } = response.data

      // Set state
      user.value = userData
      token.value = userToken
      isAuthenticated.value = true

      // Store in secureStorage
      secureStorage.setItem(TOKEN_KEY, userToken)
      secureStorage.setItem(USER_KEY, JSON.stringify(userData))

      // Store remember me preference
      if (shouldRemember) {
        secureStorage.setItem(REMEMBER_ME_KEY, 'true')
      } else {
        secureStorage.removeItem(REMEMBER_ME_KEY)
      }

      // Set auth header for future requests
      setAuthHeader(userToken)

      return userData
    } catch (error: any) {
      console.error('Login error:', error)

      if (error.response) {
        // Server returned error response
        authError.value = error.response.data.error || 'Invalid credentials'
      } else if (error.request) {
        // No response received
        authError.value = 'Network error, please try again'
      } else {
        // Other error
        authError.value = 'Failed to login, please try again'
      }

      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Register
  const register = async (name: string, email: string, password: string) => {
    try {
      authError.value = ''
      isLoading.value = true

      const response = await axios.post<AuthResponse>(`/auth/register`, {
        name,
        email,
        password,
      })

      // We could automatically log in the user here, but for this app,
      // we'll redirect to login page after registration
      return response.data
    } catch (error: any) {
      console.error('Register error:', error)

      if (error.response) {
        // Server returned error response
        authError.value = error.response.data.error || 'Registration failed'
      } else if (error.request) {
        // No response received
        authError.value = 'Network error, please try again'
      } else {
        // Other error
        authError.value = 'Failed to register, please try again'
      }

      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Logout with reason
  const logout = (reason: SessionTimeoutReason = 'manual') => {
    // Set timeout reason
    sessionTimeoutReason.value = reason

    // Clear auth header first
    setAuthHeader(null)

    // Clear all state
    user.value = null
    token.value = null
    isAuthenticated.value = false
    authError.value = ''

    // Clear storage based on remember me setting
    secureStorage.removeItem(TOKEN_KEY)
    secureStorage.removeItem(USER_KEY)

    // Only clear remember me if it's a manual logout
    if (reason === 'manual') {
      rememberMe.value = false
      secureStorage.removeItem(REMEMBER_ME_KEY)
    }

    // Force reload all API instances to clear any cached auth state
    delete axios.defaults.headers.common['Authorization']

    console.log(`User logged out (reason: ${reason}) - auth state cleared`)
  }

  // Get current user
  const fetchCurrentUser = async () => {
    try {
      if (!token.value && !secureStorage.getItem(TOKEN_KEY)) {
        return null
      }

      isLoading.value = true
      const response = await axios.get<{ user: User }>(`/auth/me`)

      // Update user state
      user.value = response.data.user
      isAuthenticated.value = true

      return response.data.user
    } catch (error) {
      console.error('Fetch user error:', error)
      logout('expired')
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Call init
  initAuth()

  return {
    user,
    isAuthenticated,
    authError,
    token,
    isLoading,
    rememberMe,
    sessionTimeoutReason,
    login,
    register,
    logout,
    fetchCurrentUser,
  }
})
