<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '../stores/tasks'
import { useAuthStore } from '../stores/auth'
import TaskCard from '../components/TaskCard.vue'
import AppHeader from '../components/AppHeader.vue'
import Sidebar from '../components/Sidebar.vue'
const router = useRouter()
const taskStore = useTaskStore()
const authStore = useAuthStore()
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
  <div class="dashboard-task">
    <!-- Header section using the AppHeader component -->
    <AppHeader 
      :reminderCount="taskStore.tasksDueSoon.length"
      :reminderTasks="taskStore.tasksDueSoon"
      @search="handleSearch"
      @view-task="viewTaskDetails"
      @logout="logout"
    />
    
    <!-- Sidebar -->
    <div class="dashboard-layout">
     <Sidebar />
      
      <!-- Main content -->
      <main class="dashboard-main">
        <!-- Loading state -->
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">Loading your tasks...</p>
        </div>
        
        <div v-else class="main-content">
          <!-- Page header -->
          <div class="page-header">
            <div class="page-title">
              <h1>My Tasks</h1>
            </div>
            <div class="page-actions">
              <button 
                class="add-button"
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
            <div class="modal-content">
              <div class="modal-header">
                <h3>Create New Task</h3>
                <button class="close-button" @click="isCreatingTask = false">
                  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
              
              <div class="modal-body">
                <div class="form-group">
                  <label for="title">Title <span class="required">*</span></label>
                <input 
                  id="title" 
                  type="text" 
                  v-model="newTask.title" 
                    class="form-input" 
                    placeholder="What needs to be done?"
                  required
                />
              </div>
              
                <div class="form-group">
                  <label for="description">Description</label>
                <textarea 
                  id="description" 
                  v-model="newTask.description" 
                    class="form-input" 
                    placeholder="Add details about this task"
                  rows="3"
                ></textarea>
              </div>
              
                <div class="form-row">
                  <div class="form-group">
                    <label for="status">Status <span class="required">*</span></label>
                    <select id="status" v-model="newTask.status" class="form-input">
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                  <div class="form-group">
                    <label for="due-date">Due Date <span class="required">*</span></label>
                  <input 
                    id="due-date" 
                    type="datetime-local" 
                    v-model="newTask.dueDate"
                      class="form-input"
                    required
                  />
                </div>
              </div>
            </div>
            
              <div class="modal-footer">
                <button class="cancel-button" @click="isCreatingTask = false">
                Cancel
              </button>
                <button class="primary-button" @click="createTask">
                Create Task
              </button>
            </div>
          </div>
        </div>
        
        <!-- Tasks list -->
          <div v-if="filteredTasks.length === 0" class="empty-state">
            <div class="empty-state-content">
              <div class="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19l-8.5-8.5a7 7 0 1 1 9.9-9.9L14 2.2l1.6 1.6-9.1 9.1 4.5 4.5L19.8 8.6l1.6 1.6-1.6 1.6a7 7 0 1 1-9.9 9.9L8.4 20z" fill="currentColor"/>
            </svg>
              </div>
              <h2 class="empty-title">No tasks yet</h2>
              <p class="empty-text">Create your first task to get started</p>
              <button class="primary-button" @click="isCreatingTask = true">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
                <span>Add Task</span>
            </button>
          </div>
        </div>
        
          <div v-else class="tasks-grid">
          <TaskCard 
            v-for="task in filteredTasks" 
            :key="task.id" 
            :task="task"
            @view="viewTaskDetails"
            @status-change="updateTaskStatus"
            @delete="deleteTask"
          />
        </div>
      </div>
    </main>
    </div>
  </div>
</template>

<style scoped>


.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(0, 115, 234, 0.1);
  border-radius: 50%;
  border-top-color: #0073ea;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #676879;
  font-size: 14px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title h1 {
  font-size: 24px;
  font-weight: 700;
  color: #323338;
  margin: 0;
}

.add-button {
  display: flex;
  align-items: center;
  background-color: #0073ea;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #0060b9;
}

.add-button svg {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.create-task-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 500px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e6e9ef;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #323338;
  margin: 0;
}

.close-button {
  background: transparent;
  border: none;
  color: #676879;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: #f5f6f8;
}

.close-button svg {
  width: 16px;
  height: 16px;
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
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #323338;
  margin-bottom: 8px;
}

.required {
  color: #e2445c;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #c3c6d4;
  border-radius: 4px;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #0073ea;
  box-shadow: 0 0 0 2px rgba(0, 115, 234, 0.2);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid #e6e9ef;
  gap: 12px;
}

.cancel-button {
  padding: 8px 16px;
  background-color: transparent;
  border: 1px solid #c3c6d4;
  border-radius: 4px;
  color: #676879;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button:hover {
  background-color: #f5f6f8;
}

.primary-button {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #0073ea;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-button:hover {
  background-color: #0060b9;
}

.primary-button svg {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  border: 1px solid #e6e9ef;
}

.empty-state-content {
  max-width: 320px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: #c3c6d4;
  margin: 0 auto 16px;
}

.empty-title {
  font-size: 20px;
  font-weight: 700;
  color: #323338;
  margin: 0 0 8px 0;
}

.empty-text {
  color: #676879;
  margin: 0 0 24px 0;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

@media (max-width: 768px) {
  .dashboard-sidebar {
    display: none;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .modal-content {
    max-width: 95%;
  }
}
</style> 