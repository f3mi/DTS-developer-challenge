<script setup lang="ts">
import { useNotificationStore } from '../stores/notification'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)

// Get notification icon based on type
const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      `
    case 'error':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      `
    case 'warning':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      `
    case 'info':
    default:
      return `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      `
  }
}

// Close notification
const closeNotification = (id: number) => {
  notificationStore.remove(id)
}
</script>

<template>
  <div class="notifications-container">
    <transition-group name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification-toast', `notification-${notification.type}`]"
      >
        <div class="notification-icon" v-html="getIcon(notification.type)"></div>
        <div class="notification-content">{{ notification.message }}</div>
        <button class="notification-close" @click="closeNotification(notification.id)">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.notifications-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
}

.notification-toast {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background-color: var(--bg-card);
  color: var(--text-primary);
  animation: slide-in 0.3s ease-out;
}

.notification-icon {
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-content {
  flex: 1;
  font-size: 14px;
}

.notification-close {
  background: none;
  border: none;
  padding: 4px;
  margin-left: 8px;
  cursor: pointer;
  opacity: 0.6;
  color: var(--text-primary);
  transition: opacity 0.2s;
}

.notification-close:hover {
  opacity: 1;
}

.notification-success .notification-icon {
  color: var(--success-color);
}

.notification-error .notification-icon {
  color: var(--error-color);
}

.notification-warning .notification-icon {
  color: var(--warning-color, #ff9800);
}

.notification-info .notification-icon {
  color: var(--info-color, #2196f3);
}

/* Animation */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@keyframes slide-in {
  from {
    transform: translateX(30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style> 