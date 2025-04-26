<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTaskStore } from '../stores/tasks'
import { useThemeStore } from '../stores/theme'
import AppHeader from '../components/AppHeader.vue'
import Sidebar from '../components/Sidebar.vue'
import { useNotificationStore } from '../stores/notification'

const props = defineProps<{
  taskId: number
}>()

const router = useRouter()
const route = useRoute()
const taskStore = useTaskStore()
const themeStore = useThemeStore()
const notificationStore = useNotificationStore()
const isEditing = ref(false)
const isLoading = ref(true)
const errorMessage = ref('')
const task = ref<any>(null)

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
    isLoading.value = true
    const fetchedTask = await taskStore.getTaskById(props.taskId)
    
    if (fetchedTask) {
      task.value = fetchedTask
      // Initialize edit form with current task data
      editForm.value = {
        title: fetchedTask.title,
        description: fetchedTask.description || '',
        status: fetchedTask.status,
        dueDate: fetchedTask.dueDate
      }
    } else {
      errorMessage.value = 'Task not found'
    }
  } catch (error) {
    console.error('Failed to load task:', error)
    errorMessage.value = 'Failed to load task'
  } finally {
    isLoading.value = false
  }
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

// Navigate back to tasks
const goBack = () => {
  router.push('/tasks')
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
const saveTask = async () => {
  if (!editForm.value.title || !editForm.value.dueDate) {
    notificationStore.error('Please fill in all required fields')
    return
  }
  
  try {
    isLoading.value = true
    const updatedTask = await taskStore.updateTask(props.taskId, {
      title: editForm.value.title,
      description: editForm.value.description,
      status: editForm.value.status,
      dueDate: editForm.value.dueDate
    })
    
    if (updatedTask) {
      task.value = updatedTask
      isEditing.value = false
      notificationStore.success('Task updated successfully')
    }
  } catch (error) {
    console.error('Failed to update task:', error)
  } finally {
    isLoading.value = false
  }
}

// Delete task
const deleteTask = async () => {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      isLoading.value = true
      await taskStore.deleteTask(props.taskId)
      notificationStore.success('Task deleted successfully')
      router.push('/tasks')
    } catch (error) {
      console.error('Failed to delete task:', error)
      isLoading.value = false
    }
  }
}
</script>

<template>
  <div class="theme-view-container task-details-container">
    <!-- Header section -->
    <AppHeader 
      :reminderCount="taskStore.tasksDueSoon.length"
      :reminderTasks="taskStore.tasksDueSoon"
    />
    
    <!-- Main Layout -->
    <div class="theme-dashboard-layout main-layout">
      <Sidebar />
      
      <!-- Main content -->
      <main class="theme-main-content main-content">
        <!-- Loading state -->
        <div v-if="isLoading" class="loading-container">
          <div class="theme-loader loading-spinner"></div>
          <p class="theme-text-secondary">Loading task...</p>
        </div>
        
        <!-- Error message -->
        <div v-else-if="errorMessage" class="error-container">
          <p class="error-message theme-text-primary">{{ errorMessage }}</p>
          <button class="theme-button-primary back-button" @click="goBack">Back to Dashboard</button>
        </div>
        
        <!-- Task details -->
        <div v-else-if="task" class="task-details">
          <div class="task-details-header">
            <button class="theme-button-secondary back-button" @click="goBack">
              &larr; Back to Dashboard
            </button>
            
            <div class="task-actions">
              <button v-if="!isEditing" class="theme-button-secondary edit-button" @click="toggleEdit">
                Edit Task
              </button>
              <button class="theme-button-secondary delete-button" @click="deleteTask">
                Delete Task
              </button>
            </div>
          </div>
          
          <!-- View mode -->
          <div v-if="!isEditing" class="theme-card task-details-card">
            <div class="theme-status-pill" :class="task.status">
              {{ task.status.replace('-', ' ') }}
            </div>
            
            <h2 class="task-title theme-text-primary">{{ task.title }}</h2>
            
            <div class="task-detail theme-text-secondary">
              <strong class="theme-text-primary">Due Date:</strong> {{ formatDate(task.dueDate) }}
            </div>
            
            <div v-if="task.description" class="task-detail description">
              <strong class="theme-text-primary">Description:</strong>
              <p class="theme-text-secondary">{{ task.description }}</p>
            </div>
          </div>
          
          <!-- Edit mode -->
          <div v-else class="theme-card task-edit-form">
            <h2 class="form-title theme-text-primary">Edit Task</h2>
            
            <div class="form-group">
              <label for="title" class="theme-text-secondary">Title *</label>
              <input 
                id="title" 
                type="text" 
                v-model="editForm.title" 
                class="theme-input form-input" 
                placeholder="Enter task title"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="description" class="theme-text-secondary">Description</label>
              <textarea 
                id="description" 
                v-model="editForm.description" 
                class="theme-input form-textarea" 
                placeholder="Enter task description (optional)"
                rows="3"
              ></textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="status" class="theme-text-secondary">Status *</label>
                <select id="status" v-model="editForm.status" class="theme-input form-select">
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="dueDate" class="theme-text-secondary">Due Date *</label>
                <input 
                  id="dueDate" 
                  type="datetime-local" 
                  v-model="editForm.dueDate"
                  class="theme-input form-input"
                  required
                />
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="theme-button-secondary cancel-button" @click="toggleEdit">
                Cancel
              </button>
              <button type="button" class="theme-button-primary save-button" @click="saveTask">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.task-details-container {
  min-height: 100vh;
  background-color: var(--bg-primary);
}

.main-layout {
  display: flex;
  min-height: calc(100vh - 56px);
}

.main-content {
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

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
}

.error-message {
  margin-bottom: 24px;
  font-size: 18px;
  text-align: center;
}

.back-button {
  padding: 8px 16px;
  cursor: pointer;
}

.task-details-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.task-actions {
  display: flex;
  gap: 12px;
}

.edit-button, .delete-button {
  padding: 8px 16px;
  cursor: pointer;
}

.delete-button {
  border-color: var(--error-color);
  color: var(--error-color);
}

.delete-button:hover {
  background-color: rgba(244, 67, 54, 0.1);
}

.task-details-card {
  padding: 24px;
  margin-bottom: 24px;
}

.task-status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 16px;
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

.task-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.task-detail {
  margin-bottom: 16px;
  line-height: 1.5;
}

.task-detail strong {
  font-weight: 600;
  margin-right: 8px;
}

.description p {
  margin: 8px 0 0 0;
  line-height: 1.6;
}

/* Edit form */
.task-edit-form {
  padding: 24px;
}

.form-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 24px 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
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

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border-radius: 4px;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-button, .save-button {
  padding: 10px 16px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 20px;
  }
  
  .task-details-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .task-actions {
    width: 100%;
  }
  
  .edit-button, .delete-button {
    flex: 1;
  }
}
</style> 