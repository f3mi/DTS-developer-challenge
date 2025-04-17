<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import logoLight from '../assets/logo.svg'
import logoDark from '../assets/logo-dark.svg'

const themeStore = useThemeStore()

// Props with defaults
const props = withDefaults(defineProps<{
  height?: string | number
  alt?: string
  maxWidth?: string | number
  centered?: boolean
}>(), {
  height: 36,
  alt: 'HMCTS Task Manager Logo',
  maxWidth: 'none',
  centered: true
})

// Determine which logo to use based on theme
const logoSrc = computed(() => {
  return themeStore.isDark ? logoDark : logoLight
})

// Generate style object
const logoStyle = computed(() => {
  return {
    height: typeof props.height === 'number' ? `${props.height}px` : props.height,
    maxWidth: typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth
  }
})

// Compute container class based on props
const containerClass = computed(() => {
  return {
    'app-logo': true,
    'app-logo-centered': props.centered
  }
})
</script>

<template>
  <div :class="containerClass" :style="logoStyle">
    <img :src="logoSrc" :alt="alt" class="logo-img" />
  </div>
</template>

<style scoped>
.app-logo {
  display: flex;
  align-items: center;
  overflow: hidden;
}

.app-logo-centered {
  justify-content: center;
  margin: 0 auto;
}

.logo-img {
  height: 100%;
  width: auto;
  object-fit: contain;
  transition: opacity 0.3s ease;
}
</style> 