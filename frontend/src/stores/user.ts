import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>({
    id: 1,
    name: 'Demo User',
    email: 'user@example.com',
  })

  return {
    currentUser,
  }
})
