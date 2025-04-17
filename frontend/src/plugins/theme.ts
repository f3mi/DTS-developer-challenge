import type { App } from 'vue'
import { useThemeStore } from '../stores/theme'
import '../assets/styles/theme.css'

// Plugin to handle global theme application
export default {
  install: (app: App) => {
    // Initialize theme based on stored preference
    const initTheme = () => {
      const themeStore = useThemeStore()

      // Apply the theme
      themeStore.updateTheme()

      // Setup system theme change listener
      themeStore.setupSystemThemeListener()

      // Add theme toggle keyboard shortcut (Shift+T)
      document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key === 'T') {
          themeStore.toggleTheme()
        }
      })
    }

    // Initialize after app is mounted
    if (document.readyState === 'complete') {
      initTheme()
    } else {
      window.addEventListener('load', initTheme)
    }

    // Provide theme helper directive
    app.directive('theme-class', {
      beforeMount(el, binding) {
        const themeStore = useThemeStore()
        const applyClass = () => {
          const isDark = themeStore.isDark
          if (binding.value) {
            if (typeof binding.value === 'string') {
              el.className = binding.value
            } else if (typeof binding.value === 'object') {
              const { light, dark } = binding.value
              el.className = isDark ? dark : light
            }
          }
        }

        // Apply initial class
        applyClass()

        // Watch for theme changes
        const unwatch = themeStore.$subscribe(() => {
          applyClass()
        })

        // Store unwatch function for cleanup
        el._unwatchTheme = unwatch
      },
      unmounted(el) {
        // Clean up subscription
        if (el._unwatchTheme) {
          el._unwatchTheme()
        }
      },
    })
  },
}
