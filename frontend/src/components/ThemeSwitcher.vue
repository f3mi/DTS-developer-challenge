<script setup lang="ts">
import { useThemeStore } from '../stores/theme'
import { computed, ref } from 'vue'

const themeStore = useThemeStore()
const showMenu = ref(false)

// Determine the current theme label
const currentThemeLabel = computed(() => {
  if (themeStore.mode === 'system') {
    return themeStore.isDark ? 'System (Dark)' : 'System (Light)'
  }
  return themeStore.mode.charAt(0).toUpperCase() + themeStore.mode.slice(1)
})

// Set a specific theme mode
const setTheme = (mode: 'light' | 'dark' | 'system') => {
  themeStore.setTheme(mode)
  showMenu.value = false
}
</script>

<template>
  <div class="theme-switcher">
    <button 
      class="theme-button" 
      :class="{ active: themeStore.isDark }"
      @click="themeStore.toggleTheme()"
      aria-label="Toggle theme"
    >
      <!-- Sun icon for light mode -->
      <svg v-if="!themeStore.isDark" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="theme-icon sun-icon">
        <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" />
        <path d="M12 3.5V1M12 23V20.5M3.5 12H1M23 12H20.5M19.7375 19.7375L17.6567 17.6567M19.7375 4.2625L17.6567 6.34329M4.2625 19.7375L6.34329 17.6567M4.2625 4.2625L6.34329 6.34329" stroke-width="2" stroke-linecap="round" />
      </svg>
      
      <!-- Moon icon for dark mode -->
      <svg v-if="themeStore.isDark" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="theme-icon moon-icon">
        <path d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 2.29085V2.29085L12.1432 2.93276ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM12 21.25C6.89137 21.25 2.75 17.1086 2.75 12H1.25C1.25 17.9371 6.06294 22.75 12 22.75V21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25V15.75C18.1349 15.75 20.4407 14.3439 21.7092 12.2447L20.4253 11.469ZM9.75 8.5C9.75 6.41182 10.8627 4.5828 12.531 3.57467L11.7553 2.29085C9.65609 3.5593 8.25 5.86509 8.25 8.5H9.75ZM12 2.75C12.1294 2.75 12.2577 2.75369 12.3846 2.76094L12.5 1.26469C12.335 1.25489 12.1681 1.25 12 1.25V2.75ZM12.531 3.57467C12.3574 3.49402 12.1785 3.42336 11.9942 3.36395L11.5 4.77091C11.6194 4.81263 11.7346 4.85834 11.8448 4.908L12.531 3.57467ZM21.7092 12.2447C21.7523 12.1673 21.7947 12.0885 21.8362 12.0082L20.4292 11.514C20.4035 11.5654 20.3769 11.6157 20.3494 11.6651L21.7092 12.2447ZM12.3846 2.76094C12.296 2.76455 12.2082 2.77007 12.1211 2.77746L12.2497 4.26956C12.3047 4.26506 12.3604 4.26162 12.4167 4.25932L12.3846 2.76094Z" />
      </svg>
    </button>
    
    <div class="theme-dropdown">
      <div class="current-theme" @click="showMenu = !showMenu">
        <span>{{ currentThemeLabel }}</span>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="dropdown-arrow">
          <path d="M7 10L12 15L17 10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      
      <div class="theme-menu" v-show="showMenu">
        <button 
          class="theme-option" 
          :class="{ active: themeStore.mode === 'light' }"
          @click="setTheme('light')"
        >
          Light
        </button>
        <button 
          class="theme-option" 
          :class="{ active: themeStore.mode === 'dark' }"
          @click="setTheme('dark')"
        >
          Dark
        </button>
        <button 
          class="theme-option" 
          :class="{ active: themeStore.mode === 'system' }"
          @click="setTheme('system')"
        >
          System
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-switcher {
  display: flex;
  align-items: center;
  position: relative;
}

.theme-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.theme-button:hover {
  background-color: var(--hover-bg);
}

.theme-button.active {
  color: var(--primary-color);
}

.theme-icon {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
}

.sun-icon path:first-child {
  fill: currentColor;
  stroke: none;
}

.theme-dropdown {
  position: relative;
  margin-left: 8px;
}

.current-theme {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-secondary);
  transition: background-color 0.2s;
}

.current-theme:hover {
  background-color: var(--hover-bg);
}

.dropdown-arrow {
  width: 16px;
  height: 16px;
  margin-left: 4px;
  fill: none;
  stroke: currentColor;
}

.theme-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background-color: var(--bg-secondary);
  border-radius: 4px;
  box-shadow: 0 2px 10px var(--shadow-color);
  z-index: 10;
  min-width: 120px;
  overflow: hidden;
}

.theme-option {
  display: block;
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-primary);
  transition: background-color 0.2s;
}

.theme-option:hover {
  background-color: var(--hover-bg);
}

.theme-option.active {
  color: var(--primary-color);
  font-weight: 500;
}
</style> 