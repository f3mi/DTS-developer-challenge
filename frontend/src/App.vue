<script setup lang="ts">
// App.vue - Main layout component
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
/* Global styles */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --toastify-color-success: #0ab87b;
  --toastify-color-error: #d83a52;
  --toastify-color-warning: #ff9800;
  --toastify-color-info: #0073ea;
}

html {
  height: 100%;
  font-family: 'Roboto', 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  min-height: 100%;
  background-color: #f7f8fa;
  color: #323338;
  line-height: 1.5;
}

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Fix for Firefox */
@supports (-moz-appearance: none) {
  body {
    height: 100vh;
  }
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: #c5c7d0;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8abb6;
}

/* Utility classes */
.truncate-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.truncate-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.focus-ring {
  outline: none;
  transition: box-shadow 0.2s;
}

.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 115, 234, 0.3), 0 0 0 4px rgba(0, 115, 234, 0.2);
}

/* Transition classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
