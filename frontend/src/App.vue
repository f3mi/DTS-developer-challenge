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
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  font-size: 16px;
  line-height: 1.5;
}

#app {
  width: 100%;
  min-height: 100vh;
}

button {
  cursor: pointer;
  font-family: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}
</style>
