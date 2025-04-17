<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '../stores/tasks'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import TaskCard from '../components/TaskCard.vue'
import AppHeader from '../components/AppHeader.vue'
import Sidebar from '../components/Sidebar.vue'

const router = useRouter()
const taskStore = useTaskStore()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const searchQuery = ref('')
const isCreatingTask = ref(false)
const isLoading = ref(true)


// Filter tasks based on search query
const filteredTasks = computed(() => {
  if (!searchQuery.value) return taskStore.tasks
  
  const query = searchQuery.value.toLowerCase()
  return taskStore.tasks.filter(task => 
    task.title.toLowerCase().includes(query) || 
    (task.description && task.description.toLowerCase().includes(query))
  )
})

// Handle search from header
const handleSearch = (query: string) => {
  searchQuery.value = query
}

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

// Form state for creating a new task
const newTask = ref({
  title: '',
  description: '',
  status: 'pending',
  dueDate: ''
})

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
  <div class="theme-view-container dashboard-task">
    <!-- Header section using the AppHeader component -->
    <AppHeader 
      :reminderCount="taskStore.tasksDueSoon.length"
      :reminderTasks="taskStore.tasksDueSoon"
      @search="handleSearch"
      @view-task="viewTaskDetails"
      @logout="logout"
    />
    
    <!-- Sidebar -->
    <div class="theme-dashboard-layout dashboard-layout">
     <Sidebar />
      
      <!-- Main content -->
      <main class="theme-main-content dashboard-main">
        <!-- Loading state -->
        <div v-if="isLoading" class="loading-container">
          <div class="theme-loader loading-spinner"></div>
          <p class="loading-text theme-text-secondary">Loading your tasks...</p>
        </div>
        
        <div v-else class="main-content">
          <!-- Page header -->
          <div class="page-header">
            <div class="page-title">
              <h1 class="theme-text-primary">My Tasks</h1>
            </div>
            <div class="page-actions">
              <button 
                class="theme-button-primary add-button"
                @click="isCreatingTask = true"
              >
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>Add Task</span>
              </button>
            </div>
          </div>
          
          <!-- Create task form -->
          <div v-if="isCreatingTask" class="create-task-modal">
            <div class="modal-overlay" @click="isCreatingTask = false"></div>
            <div class="theme-card modal-content">
              <div class="modal-header">
                <h3 class="theme-text-primary">Create New Task</h3>
                <button class="close-button" @click="isCreatingTask = false">
                  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
              
              <div class="modal-body">
                <div class="form-group">
                  <label for="title" class="theme-text-secondary">Title <span class="required">*</span></label>
                <input 
                  id="title" 
                  type="text" 
                  v-model="newTask.title" 
                    class="theme-input form-input" 
                    placeholder="What needs to be done?"
                  required
                />
              </div>
              
                <div class="form-group">
                  <label for="description" class="theme-text-secondary">Description</label>
                <textarea 
                  id="description" 
                  v-model="newTask.description" 
                    class="theme-input form-input" 
                    placeholder="Add details about this task"
                  rows="3"
                ></textarea>
              </div>
              
                <div class="form-row">
                  <div class="form-group">
                    <label for="status" class="theme-text-secondary">Status <span class="required">*</span></label>
                    <select id="status" v-model="newTask.status" class="theme-input form-input">
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                  <div class="form-group">
                    <label for="dueDate" class="theme-text-secondary">Due Date <span class="required">*</span></label>
                    <input 
                    id="dueDate" 
                    type="datetime-local" 
                    v-model="newTask.dueDate"
                      class="theme-input form-input"
                    required
                  />
                </div>
              </div>
              
                <div class="form-actions">
                  <button 
                  class="theme-button-secondary cancel-button" 
                  @click="isCreatingTask = false"
                >
                    Cancel
                  </button>
                  <button 
                  class="theme-button-primary save-button" 
                  @click="createTask"
                >
                    Create Task
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Task list -->
          <div class="tasks-container">
            <!-- Empty state -->
            <div v-if="filteredTasks.length === 0" class="empty-state">
              <div class="empty-illustration">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 11v6M9 14h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3 class="theme-text-primary">No tasks found</h3>
              <p class="theme-text-secondary">{{ searchQuery ? 'Try a different search query' : 'Click the "Add Task" button to create your first task' }}</p>
              <button 
                v-if="!searchQuery" 
                class="theme-button-primary create-first-task"
                @click="isCreatingTask = true"
              >
                Create First Task
              </button>
            </div>
            
            <!-- Task cards -->
            <div v-else class="task-list">
              <div 
                v-for="task in filteredTasks" 
                :key="task.id"
                class="theme-task-card task-card"
                @click="viewTaskDetails(task.id)"
              >
                <div class="task-header">
                  <div class="theme-status-pill" :class="task.status">
                    {{ task.status.replace('-', ' ') }}
                  </div>
                  <div class="task-actions">
                    <button 
                      class="task-action-button edit"
                      @click.stop="viewTaskDetails(task.id)"
                    >
                      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667l-8.4 8.4L2 14l.933-3.6 8.4-8.4z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    <button 
                      class="task-action-button delete"
                      @click.stop="deleteTask(task.id)"
                    >
                      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <h3 class="task-title theme-text-primary">{{ task.title }}</h3>
                
                <p v-if="task.description" class="task-description theme-text-secondary truncate-2-lines">
                  {{ task.description }}
                </p>
                
                <div class="task-meta theme-text-secondary">
                  <div class="due-date">
                    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.667 6.667h10.666M2.667 3.333h10.666a1.333 1.333 0 0 1 1.334 1.334v8a1.333 1.333 0 0 1-1.334 1.333H2.667a1.333 1.333 0 0 1-1.334-1.333v-8a1.333 1.333 0 0 1 1.334-1.334zM5.333 1.333v4M10.667 1.333v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{{ formatDate(task.dueDate) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard-task {
  min-height: 100vh;
  background-color: var(--bg-primary);
}

.dashboard-layout {
  display: flex;
}

.dashboard-main {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 16px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.add-button {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 8px;
  border-radius: 4px;
  cursor: pointer;
}

.add-button svg {
  width: 16px;
  height: 16px;
}

/* Create Task Modal */
.create-task-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 500px;
  border-radius: 8px;
  padding: 0;
  z-index: 1001;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--text-secondary);
}

.close-button svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
}

.required {
  color: var(--error-color);
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border-radius: 4px;
}

textarea.form-input {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-button, .save-button {
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 0;
}

.empty-illustration {
  margin-bottom: 24px;
  color: var(--text-secondary);
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-weight: 600;
  font-size: 18px;
}

.empty-state p {
  margin: 0 0 24px 0;
  font-size: 14px;
  max-width: 300px;
}

.create-first-task {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

/* Task list */
.task-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.task-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.task-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px var(--shadow-color);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.theme-status-pill {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.theme-status-pill.pending {
  background-color: rgba(76, 175, 80, 0.15);
  color: var(--status-new);
}

.theme-status-pill.in-progress {
  background-color: rgba(33, 150, 243, 0.15);
  color: var(--status-in-progress);
}

.theme-status-pill.completed {
  background-color: rgba(156, 39, 176, 0.15);
  color: var(--status-completed);
}

.task-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.task-card:hover .task-actions {
  opacity: 1;
}

.task-action-button {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-secondary);
}

.task-action-button:hover {
  background-color: var(--hover-bg);
}

.task-action-button.delete:hover {
  color: var(--error-color);
}

.task-action-button svg {
  width: 16px;
  height: 16px;
}

.task-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.task-description {
  font-size: 14px;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.task-meta {
  display: flex;
  align-items: center;
  font-size: 12px;
}

.due-date {
  display: flex;
  align-items: center;
  gap: 4px;
}

.due-date svg {
  width: 14px;
  height: 14px;
}

@media (max-width: 768px) {
  .task-list {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    flex-direction: column;
    gap: 16px;
  }
}
</style> 