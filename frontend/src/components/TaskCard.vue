<script setup lang="ts">
// Define the task object type
interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
}

// Define the props
const props = defineProps<{
  task: Task;
}>();

// Define emits for the component
const emit = defineEmits<{
  (e: 'view', id: number): void;
  (e: 'status-change', id: number, status: 'pending' | 'in-progress' | 'completed'): void;
  (e: 'delete', id: number): void;
}>();

// Format date for display
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

// Get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return '#fdab3d';
    case 'in-progress': return '#0086c0';
    case 'completed': return '#00c875';
    default: return '#c4c4c4';
  }
};

// Handle status change
const onStatusChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('status-change', props.task.id, target.value as 'pending' | 'in-progress' | 'completed');
};

// Handle delete action
const onDelete = () => {
  emit('delete', props.task.id);
};

// Handle click to view details
const onView = () => {
  emit('view', props.task.id);
};
</script>

<template>
  <div class="monday-card" @click="onView">
    <div class="card-content">
      <div class="card-header">
        <h3 class="card-title">{{ task.title }}</h3>
        <div 
          class="status-pill"
          :style="{ backgroundColor: getStatusColor(task.status) + '20', color: getStatusColor(task.status) }"
        >
          {{ task.status.replace('-', ' ') }}
        </div>
      </div>
      
      <div class="card-body">
        <p v-if="task.description" class="card-description">
          {{ task.description }}
        </p>
        
        <div class="card-metadata">
          <div class="due-date">
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 3.5V1.5M11.5 3.5V1.5M1.75 6.5H14.25M2.75 3.5H13.25C13.8023 3.5 14.25 3.94772 14.25 4.5V13.5C14.25 14.0523 13.8023 14.5 13.25 14.5H2.75C2.19772 14.5 1.75 14.0523 1.75 13.5V4.5C1.75 3.94772 2.19772 3.5 2.75 3.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ formatDate(task.dueDate) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card-actions" @click.stop>
      <div class="status-dropdown">
        <select 
          :value="task.status" 
          @change="onStatusChange"
          class="status-select"
          :style="{ borderColor: getStatusColor(task.status) }"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      
      <button class="delete-button" @click="onDelete">
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 4L3.5 13M3.5 4L12.5 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.monday-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e6e9ef;
  transition: box-shadow 0.2s, transform 0.2s;
  overflow: hidden;
  cursor: pointer;
}

.monday-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card-content {
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.card-title {
  font-size: 15px;
  font-weight: 500;
  color: #323338;
  margin: 0;
  flex: 1;
  word-break: break-word;
}

.status-pill {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  white-space: nowrap;
  margin-left: 8px;
  text-transform: capitalize;
}

.card-body {
  color: #676879;
}

.card-description {
  font-size: 14px;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-metadata {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #676879;
}

.due-date {
  display: flex;
  align-items: center;
}

.due-date svg {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #f5f6f8;
  border-top: 1px solid #e6e9ef;
}

.status-dropdown {
  position: relative;
}

.status-select {
  padding: 6px 8px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid;
  background-color: white;
  color: #323338;
  cursor: pointer;
  appearance: none;
  padding-right: 24px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath fill='%23676879' d='M4 6l-4-4h8z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
}

.status-select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 115, 234, 0.2);
}

.delete-button {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: none;
  background-color: transparent;
  color: #676879;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.delete-button:hover {
  background-color: #ff000020;
  color: #ff0000;
}

.delete-button svg {
  width: 16px;
  height: 16px;
}
</style> 