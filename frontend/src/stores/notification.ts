import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface Notification {
  id: number
  type: NotificationType
  message: string
  timeout?: number
}

export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref<Notification[]>([])
  let nextId = 1

  // Add a notification
  const add = (message: string, type: NotificationType = 'info', timeout: number = 3000) => {
    const id = nextId++

    // Add the notification to the list
    notifications.value.push({
      id,
      message,
      type,
      timeout,
    })

    // Automatically remove the notification after timeout
    if (timeout > 0) {
      setTimeout(() => {
        remove(id)
      }, timeout)
    }

    return id
  }

  // Success notification shorthand
  const success = (message: string, timeout?: number) => {
    return add(message, 'success', timeout)
  }

  // Error notification shorthand
  const error = (message: string, timeout?: number) => {
    return add(message, 'error', timeout)
  }

  // Warning notification shorthand
  const warning = (message: string, timeout?: number) => {
    return add(message, 'warning', timeout)
  }

  // Info notification shorthand
  const info = (message: string, timeout?: number) => {
    return add(message, 'info', timeout)
  }

  // Remove a notification by id
  const remove = (id: number) => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  // Clear all notifications
  const clear = () => {
    notifications.value = []
  }

  return {
    notifications,
    add,
    success,
    error,
    warning,
    info,
    remove,
    clear,
  }
})
