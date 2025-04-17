import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

type ThemeMode = 'light' | 'dark' | 'system'

export const useThemeStore = defineStore('theme', () => {
  // State
  const mode = ref<ThemeMode>((localStorage.getItem('theme') as ThemeMode) || 'system')
  const isDark = ref(false)

  // Get the system preference
  const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Apply theme to document
  const applyTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark-theme')
      document.documentElement.classList.remove('light-theme')
    } else {
      document.documentElement.classList.add('light-theme')
      document.documentElement.classList.remove('dark-theme')
    }
    isDark.value = dark
  }

  // Update theme based on mode
  const updateTheme = () => {
    if (mode.value === 'system') {
      applyTheme(getSystemTheme() === 'dark')
    } else {
      applyTheme(mode.value === 'dark')
    }
    localStorage.setItem('theme', mode.value)
  }

  // Set theme mode
  const setTheme = (newMode: ThemeMode) => {
    mode.value = newMode
    updateTheme()
  }

  // Toggle between light and dark
  const toggleTheme = () => {
    if (mode.value === 'system') {
      // If in system mode, switch to either light or dark based on current state
      setTheme(isDark.value ? 'light' : 'dark')
    } else {
      // If already in light/dark mode, toggle between them
      setTheme(mode.value === 'light' ? 'dark' : 'light')
    }
  }

  // Listen for system preference changes
  const setupSystemThemeListener = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      if (mode.value === 'system') {
        updateTheme()
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    // Cleanup function
    return () => mediaQuery.removeEventListener('change', handleChange)
  }

  // Initialize theme on store creation
  updateTheme()

  // Watch for mode changes
  watch(mode, updateTheme)

  return {
    mode,
    isDark,
    setTheme,
    toggleTheme,
    updateTheme,
    setupSystemThemeListener,
  }
})
