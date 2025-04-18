import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from './auth'
import { useNotificationStore } from './notification'

export interface Task {
  id: number
  title: string
  description?: string
  status: 'pending' | 'in-progress' | 'completed'
  dueDate: string
}

export const useTaskStore = defineStore('tasks', () => {
  // State
  const tasks = ref<Task[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Other stores
  const authStore = useAuthStore()
  const notificationStore = useNotificationStore()

  // API base URL
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

  // Get headers with auth token
  const getHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    }
  }

  // Parse error message from API response
  const parseErrorMessage = (err: any): string => {
    // Check for validation errors array
    if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
      return err.response.data.errors.map((e: any) => e.msg).join(', ')
    }

    // Check for error message
    if (err.response?.data?.error) {
      return err.response.data.error
    }

    // Check for network error
    if (err.message === 'Network Error') {
      return 'Network error. Please check your connection.'
    }

    // Generic error
    return 'An unexpected error occurred'
  }

  // Fetch tasks from API
  const fetchTasks = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await axios.get(`${apiUrl}/tasks`, getHeaders())
      tasks.value = response.data.tasks
      return tasks.value
    } catch (err: any) {
      console.error('Error fetching tasks:', err)
      const errorMessage = parseErrorMessage(err)
      error.value = errorMessage
      notificationStore.error(`Failed to load tasks: ${errorMessage}`)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Get a task by ID
  const getTaskById = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      // First check if we already have the task in our state
      const cachedTask = tasks.value.find((task) => task.id === id)
      if (cachedTask) return cachedTask

      // If not, fetch it from the API
      const response = await axios.get(`${apiUrl}/tasks/${id}`, getHeaders())
      return response.data.task
    } catch (err: any) {
      console.error('Error fetching task:', err)
      const errorMessage = parseErrorMessage(err)
      error.value = errorMessage
      notificationStore.error(`Failed to load task details: ${errorMessage}`)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Get tasks due soon (within next 3 days)
  const tasksDueSoon = computed(() => {
    const now = new Date()
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(now.getDate() + 3)

    return tasks.value.filter((task) => {
      const dueDate = new Date(task.dueDate)
      // Include both overdue tasks and tasks due soon (not completed)
      return (
        (dueDate < now || (dueDate >= now && dueDate <= threeDaysFromNow)) &&
        task.status !== 'completed'
      )
    })
  })

  // Create a new task
  const createTask = async (task: Omit<Task, 'id'>) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await axios.post(`${apiUrl}/tasks`, task, getHeaders())
      const newTask = response.data.task
      tasks.value.push(newTask)
      notificationStore.success(`Task "${newTask.title}" has been created successfully`)
      return newTask
    } catch (err: any) {
      console.error('Error creating task:', err)
      const errorMessage = parseErrorMessage(err)
      error.value = errorMessage
      notificationStore.error(`Failed to create task: ${errorMessage}`)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Update a task
  const updateTask = async (id: number, updates: Partial<Omit<Task, 'id'>>) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await axios.put(`${apiUrl}/tasks/${id}`, updates, getHeaders())
      const updatedTask = response.data.task

      // Update the task in our local state
    const index = tasks.value.findIndex((task) => task.id === id)
    if (index !== -1) {
        tasks.value[index] = updatedTask
      }

      // Create a meaningful success message based on what was updated
      let successMessage = `Task "${updatedTask.title}" updated successfully`
      if (updates.status) {
        successMessage = `Task status updated to "${updates.status.replace('-', ' ')}"`
      }

      notificationStore.success(successMessage)
      return updatedTask
    } catch (err: any) {
      console.error('Error updating task:', err)
      const errorMessage = parseErrorMessage(err)
      error.value = errorMessage
      notificationStore.error(`Failed to update task: ${errorMessage}`)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Delete a task
  const deleteTask = async (id: number) => {
    isLoading.value = true
    error.value = null

    // Find task before deletion to get its title
    const taskToDelete = tasks.value.find((task) => task.id === id)
    const taskTitle = taskToDelete?.title || 'Task'

    try {
      await axios.delete(`${apiUrl}/tasks/${id}`, getHeaders())
      // Remove from local state
    tasks.value = tasks.value.filter((task) => task.id !== id)
      notificationStore.success(`"${taskTitle}" has been deleted successfully`)
    } catch (err: any) {
      console.error('Error deleting task:', err)
      const errorMessage = parseErrorMessage(err)
      error.value = errorMessage
      notificationStore.error(`Failed to delete task: ${errorMessage}`)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    getTaskById,
    tasksDueSoon,
    createTask,
    updateTask,
    deleteTask,
  }
})
