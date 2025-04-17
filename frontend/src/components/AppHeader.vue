<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useThemeStore } from '../stores/theme'
import ThemeSwitcher from './ThemeSwitcher.vue';
import AppLogo from './AppLogo.vue';

interface Task {
  id: number;
  title: string;
  dueDate: string;
}

// Define the props
const props = defineProps<{
  reminderCount: number;
  reminderTasks: Task[];
}>();

// Define emits for the component
const emit = defineEmits<{
  (e: 'search', query: string): void;
  (e: 'view-task', id: number): void;
  (e: 'logout'): void;
}>();

const router = useRouter();
const authStore = useAuthStore();
const searchQuery = ref('');
const showReminders = ref(false);
const themeStore = useThemeStore()

// Get user name or email to display
const userDisplayName = computed(() => {
  if (!authStore.user) return 'User';
  return authStore.user.name || authStore.user.email.split('@')[0];
});

// Computed property to get user initials
const userInitials = computed(() => {
  if (!authStore.user || !authStore.user.name) return '?';
  
  const nameParts = authStore.user.name.split(' ');
  if (nameParts.length >= 2) {
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
  }
  return nameParts[0].charAt(0).toUpperCase();
});

// Computed property to check if we're on the tasks route
const isTasksRoute = computed(() => {
  return router.currentRoute.value.path === '/tasks';
});

// Send search query to parent
const onSearch = () => {
  emit('search', searchQuery.value);
};

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

// Handle logout
const onLogout = () => {
  emit('logout');
};

// View task details
const viewTask = (taskId: number) => {
  emit('view-task', taskId);
  showReminders.value = false;
};
</script>

<template>
  <header class="monday-header">
    <div class="header-container">
      <!-- Logo section -->
      <div class="logo-section">
        <AppLogo height="30" maxWidth="180" :centered="false" />
      </div>

      <!-- Search section - only show on tasks route -->
      <div class="search-section" v-if="isTasksRoute">
        <div class="search-wrapper">
          <svg class="search-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 3C11.5376 3 14 5.46243 14 8.5C14 9.83879 13.5217 11.0659 12.7266 12.0196L16.8536 16.1464C17.0488 16.3417 17.0488 16.6583 16.8536 16.8536C16.68 17.0271 16.4106 17.0464 16.2157 16.9114L16.1464 16.8536L12.0196 12.7266C11.0659 13.5217 9.83879 14 8.5 14C5.46243 14 3 11.5376 3 8.5C3 5.46243 5.46243 3 8.5 3ZM8.5 4C6.01472 4 4 6.01472 4 8.5C4 10.9853 6.01472 13 8.5 13C10.9853 13 13 10.9853 13 8.5C13 6.01472 10.9853 4 8.5 4Z" fill="currentColor"/>
          </svg>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Search tasks..."
            class="search-input"
            @input="onSearch"
          />
        </div>
      </div>

      <!-- Actions section -->
      <div class="actions-section">
          <!-- Theme switcher -->
          <ThemeSwitcher />
          
          <!-- Notification button -->
          <button 
          class="notification-button"
            @click="showReminders = !showReminders"
          >
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2C10.7364 2 11.4276 2.1218 12.0814 2.34991C12.0277 2.56494 12 2.78932 12 3.01971C11.3663 2.85301 10.6943 2.76316 10 2.76316C6.57191 2.76316 3.7934 5.52216 3.7934 8.92982C3.7934 10.7539 4.56823 12.3967 5.80414 13.543H14.1958C14.9213 12.8961 15.5093 12.0957 15.894 11.193C16.0098 11.2303 16.1296 11.2591 16.253 11.2786C15.8556 12.335 15.1546 13.2538 14.2512 13.9542L14.4229 14.3L14.5891 15.3847C14.6436 15.7431 14.3353 16.0589 13.9783 16.0044L13 15.8382L12.0217 16.0044C11.6647 16.0589 11.3564 15.7431 11.4109 15.3847L11.5771 14.3L11.7488 13.9542C11.1487 14.331 10.4917 14.6168 9.79503 14.7812L9.79334 15.2632C9.79334 16.7717 8.56975 18 7.06602 18C5.56229 18 4.3387 16.7717 4.3387 15.2632L4.337 14.7812C2.28253 14.0601 0.79334 11.6963 0.79334 8.92982C0.79334 3.83486 4.8779 -0.236845 10 -0.236845C10.5493 -0.236845 11.0667 -0.1925 11.5468 -0.110604C11.1923 0.468438 11 1.15133 11 1.87891C10.6747 1.82178 10.3402 1.79188 10 1.79188C5.71483 1.79188 2.27365 5.28233 2.27365 9.63158C2.27365 13.9808 5.71483 17.4713 10 17.4713C14.2851 17.4713 17.7263 13.9808 17.7263 9.63158C17.7263 9.28568 17.6957 8.94558 17.6375 8.61467C18.3726 8.43201 19.0278 8.04859 19.5134 7.52395C19.5792 8.21462 19.6129 8.92451 19.5816 9.63158C19.5816 15.8947 15.2427 19.2632 10 19.2632C4.75723 19.2632 0.418388 15.8947 0.418388 9.63158C0.418388 3.36843 4.75723 0 10 0C10.2464 0 10.4899 0.00593459 10.7304 0.0176115C10.4844 0.277939 10.2661 0.56435 10.0795 0.873496C10.0529 0.873011 10.0263 0.872768 9.99966 0.872768C6.14841 0.872768 2.82387 4.51646 2.82387 9.05263C2.82387 13.5888 6.14841 17.2325 9.99966 17.2325C13.8509 17.2325 17.1754 13.5888 17.1754 9.05263C17.1754 8.80789 17.1639 8.5662 17.1413 8.32811C17.639 8.15539 18.0941 7.88424 18.4788 7.53557C18.522 8.03393 18.5439 8.53929 18.5439 9.05263C18.5439 14.3582 14.6924 18.8421 9.99966 18.8421C5.30694 18.8421 1.45544 14.3582 1.45544 9.05263C1.45544 3.74708 5.30694 -0.736842 9.99966 -0.736842C10.3664 -0.736842 10.7278 -0.717361 11.0826 -0.679288C11.0282 -0.496271 11 -0.305293 11 -0.108527V0C11 0.907167 11.374 1.73148 12 2.32184C11.364 2.11393 10.6964 2 10 2ZM16 8C17.6569 8 19 6.65685 19 5C19 3.34315 17.6569 2 16 2C14.3431 2 13 3.34315 13 5C13 6.65685 14.3431 8 16 8Z" fill="currentColor"/>
            </svg>
          <span class="notification-count">{{ reminderCount }}</span>
          
          <!-- Reminders popover -->
          <div v-if="showReminders && reminderCount > 0" class="reminders-popover">
            <div class="popover-header">
              <h3>Tasks Due Soon</h3>
            </div>
            <ul class="reminder-list">
              <li v-for="task in reminderTasks" :key="task.id" 
                class="reminder-item"
                @click="viewTask(task.id)">
                <div class="reminder-title">
                  <span v-if="new Date(task.dueDate) < new Date()" class="overdue-indicator">OVERDUE</span>
                  {{ task.title }}
                </div>
                <div class="reminder-due">Due: {{ formatDate(task.dueDate) }}</div>
              </li>
            </ul>
          </div>
        </button>
        
        <!-- User information with logout button -->
        <div class="user-info">
          <div class="user-name">{{ userDisplayName }}</div>
          <button class="user-button" @click="onLogout">
            <div class="user-avatar">
              <span>{{ userInitials }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </header>
</template> 

<style scoped>
.monday-header {
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  height: 56px;
  padding: 0 16px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1600px;
  margin: 0 auto;
}

.logo-section {
  display: flex;
  align-items: center;
  padding: 0 8px;
}

.search-section {
  flex: 1;
  max-width: 500px;
  margin: 0 24px;
}

.search-wrapper {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--text-secondary);
}

.search-input {
  width: 100%;
  height: 40px;
  background-color: var(--bg-tertiary);
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 0 12px 0 40px;
  font-size: 14px;
  color: var(--text-primary);
  transition: all 0.2s;
}

.search-input:focus {
  background-color: var(--bg-secondary);
  border-color: var(--border-color);
  outline: none;
  box-shadow: 0 0 0 2px var(--focus-ring);
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.actions-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.notification-button {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: none;
  background-color: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.notification-button:hover {
  background-color: var(--hover-bg);
  color: var(--text-primary);
}

.notification-button svg {
  width: 24px;
  height: 24px;
}

.notification-count {
  position: absolute;
  top: 3px;
  right: 3px;
  background-color: #e2445c;
  color: white;
  font-size: 10px;
  font-weight: bold;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.user-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  background: none;
}

.user-avatar {
  width: 100%;
  height: 100%;
  background-color: #0073ea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
}

.reminders-popover {
  position: absolute;
  top: 48px;
  right: 0;
  width: 320px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1000;
}

.popover-header {
  padding: 16px;
  border-bottom: 1px solid #e6e9ef;
}

.popover-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #323338;
}

.reminder-list {
  max-height: 320px;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  list-style: none;
}

.reminder-item {
  padding: 12px 16px;
  border-bottom: 1px solid #e6e9ef;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reminder-item:last-child {
  border-bottom: none;
}

.reminder-item:hover {
  background-color: #f5f6f8;
}

.reminder-title {
  font-size: 14px;
  font-weight: 500;
  color: #323338;
  margin-bottom: 4px;
}

.reminder-due {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.overdue-indicator {
  background-color: var(--error-color);
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 4px;
  border-radius: 4px;
  margin-right: 6px;
  display: inline-block;
}

@media (max-width: 768px) {
  .monday-header {
    padding: 0 8px;
  }
  
  .search-section {
    margin: 0 8px;
  }
  
  .product-name {
    display: none;
  }
  
  .user-name {
    max-width: 100px;
  }
}
</style> 