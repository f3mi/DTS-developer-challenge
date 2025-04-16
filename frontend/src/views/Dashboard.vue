<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '../stores/tasks'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const taskStore = useTaskStore()
const authStore = useAuthStore()
const searchQuery = ref('')
const isCreatingTask = ref(false)
const isLoading = ref(true)
const showReminders = ref(false)

// Form state for creating a new task
const newTask = ref({
  title: '',
  description: '',
  status: 'pending',
  dueDate: ''
})

// Filter tasks based on search query
const filteredTasks = computed(() => {
  if (!searchQuery.value) return taskStore.tasks
  
  const query = searchQuery.value.toLowerCase()
  return taskStore.tasks.filter(task => 
    task.title.toLowerCase().includes(query) || 
    (task.description && task.description.toLowerCase().includes(query))
  )
})

// Create a new task
const createTask = () => {
  if (!newTask.value.title || !newTask.value.dueDate) {
    alert('Please fill in required fields')
    return
  }
  
  taskStore.createTask({
    title: newTask.value.title,
    description: newTask.value.description,
    status: newTask.value.status as 'pending' | 'in-progress' | 'completed',
    dueDate: newTask.value.dueDate
  })
  
  resetNewTaskForm()
  isCreatingTask.value = false
}

// Update task status
const updateTaskStatus = (taskId: number, newStatus: 'pending' | 'in-progress' | 'completed') => {
  taskStore.updateTask(taskId, { status: newStatus })
}

// Delete a task
const deleteTask = (taskId: number) => {
  if (confirm('Are you sure you want to delete this task?')) {
    taskStore.deleteTask(taskId)
  }
}

// View task details
const viewTaskDetails = (taskId: number) => {
  router.push(`/task/${taskId}`)
}

// Reset new task form
const resetNewTaskForm = () => {
  newTask.value = {
    title: '',
    description: '',
    status: 'pending',
    dueDate: ''
  }
}

// Format date for display
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(dateString).toLocaleDateString('en-GB', options)
}

// Simulate loading
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})

// Logout function
const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="dashboard-container">
    <!-- Header section -->
    <header class="header">
      <div class="logo">
        <h1>HMCTS Task Manager</h1>
      </div>
      <div class="header-actions">
        <button class="reminder-button" @click="showReminders = !showReminders">
          🔔 {{ taskStore.tasksDueSoon.length }} 
        </button>
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Search tasks..."
            class="search-input"
          />
        </div>
        <button class="logout-button" @click="logout">Logout</button>
      </div>
    </header>
    
    <!-- Reminders popover -->
    <div v-if="showReminders && taskStore.tasksDueSoon.length > 0" class="reminders-popover">
      <h3>Tasks Due Soon</h3>
      <ul class="reminder-list">
        <li v-for="task in taskStore.tasksDueSoon" :key="task.id" class="reminder-item">
          <span class="reminder-title">{{ task.title }}</span>
          <span class="reminder-due">Due: {{ formatDate(task.dueDate) }}</span>
        </li>
      </ul>
    </div>
    
    <!-- Main content -->
    <main class="main-content">
      <!-- Loading state -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading tasks...</p>
      </div>
      
      <div v-else>
        <!-- Task actions section -->
        <div class="task-actions">
          <h2>My Tasks</h2>
          <button class="create-button" @click="isCreatingTask = true">
            + Create Task
          </button>
        </div>
        
        <!-- Create task form -->
        <div v-if="isCreatingTask" class="create-task-form">
          <h3>Create New Task</h3>
          
          <div class="form-group">
            <label for="title">Title *</label>
            <input 
              id="title" 
              type="text" 
              v-model="newTask.title" 
              placeholder="Enter task title"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description" 
              v-model="newTask.description" 
              placeholder="Enter task description (optional)"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="status">Status *</label>
              <select id="status" v-model="newTask.status">
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="due-date">Due Date/Time *</label>
              <input 
                id="due-date" 
                type="datetime-local" 
                v-model="newTask.dueDate"
                required
              />
            </div>
          </div>
          
          <div class="form-actions">
            <button 
              class="cancel-button" 
              @click="isCreatingTask = false"
            >
              Cancel
            </button>
            <button 
              class="save-button" 
              @click="createTask"
            >
              Create Task
            </button>
          </div>
        </div>
        
        <!-- Tasks list -->
        <div class="tasks-list">
          <div v-if="filteredTasks.length === 0" class="no-tasks">
            <p>No tasks found. Create a new task to get started.</p>
          </div>
          
          <div 
            v-for="task in filteredTasks" 
            :key="task.id" 
            class="task-card"
            :class="{ 'completed': task.status === 'completed' }"
            @click="viewTaskDetails(task.id)"
          >
            <div class="task-header">
              <h3 class="task-title">{{ task.title }}</h3>
              <div class="task-status" :class="task.status">
                {{ task.status.replace('-', ' ') }}
              </div>
            </div>
            
            <div class="task-body">
              <p v-if="task.description" class="task-description">
                {{ task.description }}
              </p>
              <p class="task-due-date">
                Due: {{ formatDate(task.dueDate) }}
              </p>
            </div>
            
            <div class="task-actions" @click.stop>
              <select 
                :value="task.status" 
                @change="updateTaskStatus(task.id, $event.target as HTMLSelectElement ? ($event.target as HTMLSelectElement).value as 'pending' | 'in-progress' | 'completed' : 'pending')"
                class="status-select"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <button class="delete-button" @click="deleteTask(task.id)">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #f6f7fb;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.logo h1 {
  color: #0066ff;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-container {
  position: relative;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 240px;
  font-size: 14px;
}

.search-input:focus {
  border-color: #0066ff;
  outline: none;
}

.reminder-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  position: relative;
}

.reminder-button:hover {
  background-color: #f5f5f5;
}

.logout-button {
  background-color: transparent;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #f5f5f5;
}

.reminders-popover {
  position: absolute;
  top: 65px;
  right: 200px;
  width: 300px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
  z-index: 20;
}

.reminders-popover h3 {
  margin-top: 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.reminder-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.reminder-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.reminder-item:last-child {
  border-bottom: none;
}

.reminder-title {
  display: block;
  font-weight: 500;
  color: #333;
}

.reminder-due {
  display: block;
  font-size: 12px;
  color: #e65050;
  margin-top: 4px;
}

.main-content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #0066ff;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.task-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.task-actions h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.create-button {
  background-color: #0066ff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.create-button:hover {
  background-color: #0052cc;
}

.create-task-form {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.create-task-form h3 {
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 18px;
  color: #333;
}

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

input, select, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus, select:focus, textarea:focus {
  border-color: #0066ff;
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #e5e5e5;
}

.save-button {
  background-color: #0066ff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.save-button:hover {
  background-color: #0052cc;
}

.tasks-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.no-tasks {
  grid-column: 1 / -1;
  background-color: white;
  border-radius: 8px;
  padding: 48px 24px;
  text-align: center;
  color: #666;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.task-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 16px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.task-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.task-card.completed {
  opacity: 0.7;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.task-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.task-status {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: capitalize;
}

.task-status.pending {
  background-color: #fff4e5;
  color: #ff9800;
}

.task-status.in-progress {
  background-color: #e3f2fd;
  color: #2196f3;
}

.task-status.completed {
  background-color: #e8f5e9;
  color: #4caf50;
}

.task-body {
  margin-bottom: 16px;
}

.task-description {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.task-due-date {
  margin: 0;
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

.task-actions {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.status-select {
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ddd;
  width: auto;
  font-size: 13px;
}

.delete-button {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #d32f2f;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .tasks-list {
    grid-template-columns: 1fr;
  }
  
  .header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .search-input {
    width: 100%;
  }
}
</style> 