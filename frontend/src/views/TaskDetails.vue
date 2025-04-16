<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTaskStore } from '../stores/tasks'

const router = useRouter()
const route = useRoute()
const taskStore = useTaskStore()
const taskId = computed(() => Number(route.params.id))
const isEditing = ref(false)
const isLoading = ref(true)
const errorMessage = ref('')

// Form data for editing
const editForm = ref({
  title: '',
  description: '',
  status: 'pending' as 'pending' | 'in-progress' | 'completed',
  dueDate: ''
})

// Load task data
onMounted(async () => {
  try {
    // Simulate network delay
    setTimeout(() => {
      isLoading.value = false
      
      const task = taskStore.getTaskById(taskId.value)
      
      if (task) {
        // Initialize edit form with current task data
        editForm.value = {
          title: task.title,
          description: task.description || '',
          status: task.status,
          dueDate: task.dueDate
        }
      } else {
        errorMessage.value = 'Task not found'
      }
    }, 1000)
  } catch (error) {
    isLoading.value = false
    errorMessage.value = 'Failed to load task'
  }
})

// Get the current task
const task = computed(() => {
  return taskStore.getTaskById(taskId.value)
})

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

// Navigate back to dashboard
const goBack = () => {
  router.push('/dashboard')
}

// Toggle edit mode
const toggleEdit = () => {
  isEditing.value = !isEditing.value
  
  // Reset form if cancelling edit
  if (!isEditing.value && task.value) {
    editForm.value = {
      title: task.value.title,
      description: task.value.description || '',
      status: task.value.status,
      dueDate: task.value.dueDate
    }
  }
}

// Save edited task
const saveTask = () => {
  if (!editForm.value.title || !editForm.value.dueDate) {
    alert('Please fill in required fields')
    return
  }
  
  taskStore.updateTask(taskId.value, {
    title: editForm.value.title,
    description: editForm.value.description,
    status: editForm.value.status,
    dueDate: editForm.value.dueDate
  })
  
  isEditing.value = false
}

// Delete task
const deleteTask = () => {
  if (confirm('Are you sure you want to delete this task?')) {
    taskStore.deleteTask(taskId.value)
    router.push('/dashboard')
  }
}
</script>

<template>
  <div class="task-details-container">
    <!-- Header section -->
    <header class="header">
      <div class="logo">
        <h1>HMCTS Task Manager</h1>
      </div>
    </header>
    
    <!-- Main content -->
    <main class="main-content">
      <!-- Loading state -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading task...</p>
      </div>
      
      <!-- Error message -->
      <div v-else-if="errorMessage" class="error-container">
        <p class="error-message">{{ errorMessage }}</p>
        <button class="back-button" @click="goBack">Back to Dashboard</button>
      </div>
      
      <!-- Task details -->
      <div v-else-if="task" class="task-details">
        <div class="task-details-header">
          <button class="back-button" @click="goBack">
            &larr; Back to Dashboard
          </button>
          
          <div class="task-actions">
            <button v-if="!isEditing" class="edit-button" @click="toggleEdit">
              Edit Task
            </button>
            <button class="delete-button" @click="deleteTask">
              Delete Task
            </button>
          </div>
        </div>
        
        <!-- View mode -->
        <div v-if="!isEditing" class="task-details-card">
          <div class="task-status" :class="task.status">
            {{ task.status.replace('-', ' ') }}
          </div>
          
          <h2 class="task-title">{{ task.title }}</h2>
          
          <div class="task-detail">
            <strong>Due Date:</strong> {{ formatDate(task.dueDate) }}
          </div>
          
          <div v-if="task.description" class="task-detail description">
            <strong>Description:</strong>
            <p>{{ task.description }}</p>
          </div>
        </div>
        
        <!-- Edit mode -->
        <div v-else class="task-edit-form">
          <h2>Edit Task</h2>
          
          <div class="form-group">
            <label for="title">Title *</label>
            <input 
              id="title" 
              type="text" 
              v-model="editForm.title" 
              placeholder="Enter task title"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description" 
              v-model="editForm.description" 
              placeholder="Enter task description (optional)"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="status">Status *</label>
              <select id="status" v-model="editForm.status">
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
                v-model="editForm.dueDate"
                required
              />
            </div>
          </div>
          
          <div class="form-actions">
            <button 
              class="cancel-button" 
              @click="toggleEdit"
            >
              Cancel
            </button>
            <button 
              class="save-button" 
              @click="saveTask"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.task-details-container {
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

.main-content {
  padding: 24px;
  max-width: 800px;
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

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 24px;
}

.error-message {
  color: #e65050;
  font-size: 18px;
  margin-bottom: 24px;
}

.task-details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.task-actions {
  display: flex;
  gap: 16px;
}

.back-button {
  background-color: transparent;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.back-button:hover {
  background-color: #f5f5f5;
}

.edit-button {
  background-color: #0066ff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
}

.edit-button:hover {
  background-color: #0052cc;
}

.delete-button {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #d32f2f;
}

.task-details-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 24px;
}

.task-status {
  display: inline-block;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: capitalize;
  margin-bottom: 16px;
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

.task-title {
  margin: 0 0 24px 0;
  font-size: 24px;
  color: #333;
}

.task-detail {
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.5;
}

.task-detail.description {
  margin-top: 24px;
}

.task-detail.description p {
  margin: 8px 0 0;
  color: #666;
  line-height: 1.6;
}

.task-edit-form {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 24px;
}

.task-edit-form h2 {
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 20px;
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

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .task-details-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .task-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style> 