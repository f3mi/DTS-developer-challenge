import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Task {
  id: number
  title: string
  description?: string
  status: 'pending' | 'in-progress' | 'completed'
  dueDate: string
}

export const useTaskStore = defineStore('tasks', () => {
  // State
  const tasks = ref<Task[]>([
    {
      id: 1,
      title: 'Review case documents',
      description: 'Read through all case files and prepare summary',
      status: 'in-progress',
      dueDate: '2025-04-20T14:00:00',
    },
    {
      id: 2,
      title: 'Schedule client meeting',
      status: 'pending',
      dueDate: '2025-04-25T10:00:00',
    },
    {
      id: 3,
      title: 'Submit final report',
      description: 'Complete and submit the quarterly report to management',
      status: 'completed',
      dueDate: '2025-04-15T17:00:00',
    },
  ])

  // Loading state
  const isLoading = ref(false)

  // Fetch tasks (simulated API call)
  const fetchTasks = async () => {
    isLoading.value = true
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      // Data is already loaded in the ref above
      return tasks.value
    } catch (error) {
      console.error('Error fetching tasks:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Get a task by ID
  const getTaskById = (id: number) => {
    return tasks.value.find((task) => task.id === id) || null
  }

  // Get tasks due soon (within next 3 days)
  const tasksDueSoon = computed(() => {
    const now = new Date()
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(now.getDate() + 3)

    return tasks.value.filter((task) => {
      const dueDate = new Date(task.dueDate)
      return dueDate >= now && dueDate <= threeDaysFromNow && task.status !== 'completed'
    })
  })

  // Create a new task
  const createTask = (task: Omit<Task, 'id'>) => {
    const newId = tasks.value.length > 0 ? Math.max(...tasks.value.map((t) => t.id)) + 1 : 1

    const newTask: Task = {
      id: newId,
      ...task,
    }

    tasks.value.push(newTask)
    return newTask
  }

  // Update a task
  const updateTask = (id: number, updates: Partial<Omit<Task, 'id'>>) => {
    const index = tasks.value.findIndex((task) => task.id === id)
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updates }
      return tasks.value[index]
    }
    return null
  }

  // Delete a task
  const deleteTask = (id: number) => {
    tasks.value = tasks.value.filter((task) => task.id !== id)
  }

  return {
    tasks,
    isLoading,
    fetchTasks,
    getTaskById,
    tasksDueSoon,
    createTask,
    updateTask,
    deleteTask,
  }
})
