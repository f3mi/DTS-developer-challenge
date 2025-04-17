<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '../stores/tasks'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import AppHeader from '../components/AppHeader.vue'
import Sidebar from '../components/Sidebar.vue'

const router = useRouter()
const taskStore = useTaskStore()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const isLoading = ref(true)
const currentDate = ref(new Date())
const searchQuery = ref('')

// Move to next month
const nextMonth = () => {
  const date = new Date(currentDate.value)
  date.setMonth(date.getMonth() + 1)
  currentDate.value = date
}

// Move to previous month
const prevMonth = () => {
  const date = new Date(currentDate.value)
  date.setMonth(date.getMonth() - 1)
  currentDate.value = date
}

// Format date for display
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric'
  }).format(date)
}

// Generate days for current month view
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // First day of month
  const firstDay = new Date(year, month, 1)
  // Last day of month
  const lastDay = new Date(year, month + 1, 0)
  
  // Day of week for the first day (0 = Sunday, 6 = Saturday)
  let firstDayOfWeek = firstDay.getDay()
  // Convert to Monday = 0, Sunday = 6
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
  
  const daysInMonth = lastDay.getDate()
  
  // Generate days array
  const days = []
  
  // Add days from previous month to fill the first week
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i
    days.push({
      date: new Date(year, month - 1, day),
      isCurrentMonth: false,
      day
    })
  }
  
  // Add days from current month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      date: new Date(year, month, day),
      isCurrentMonth: true,
      day
    })
  }
  
  // Add days from next month to fill the last week
  const remainingDays = 42 - days.length // 6 rows of 7 days
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      date: new Date(year, month + 1, day),
      isCurrentMonth: false,
      day
    })
  }
  
  return days
})

// Check if two dates are the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
}

// Check if date is weekend
const isWeekend = (date: Date): boolean => {
  const day = date.getDay()
  return day === 0 || day === 6 // Sunday or Saturday
}

// Map tasks to dates
const tasksForDate = computed(() => {
  return (date: Date) => {
    return taskStore.tasks.filter(task => {
      const taskDate = new Date(task.dueDate)
      return isSameDay(taskDate, date)
    })
  }
})

// View task details
const viewTaskDetails = (taskId: number) => {
  router.push(`/task/${taskId}`)
}

// Handle search from header
const handleSearch = (query: string) => {
  searchQuery.value = query
}

// Logout function
const logout = () => {
  authStore.logout()
  router.push('/login')
}

// Simulate loading
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>

<template>
  <div class="theme-view-container calendar-view" :class="{ 'dark-theme': themeStore.isDark }">
    <!-- Header section -->
    <AppHeader 
      :reminderCount="taskStore.tasksDueSoon.length"
      :reminderTasks="taskStore.tasksDueSoon"
      @search="handleSearch"
      @view-task="viewTaskDetails"
      @logout="logout"
    />
    
    <!-- Main layout -->
    <div class="theme-dashboard-layout dashboard-layout">
      <Sidebar />
      
      <!-- Main content -->
      <main class="theme-main-content calendar-main">
        <!-- Loading state -->
        <div v-if="isLoading" class="loading-container">
          <div class="theme-loader loading-spinner"></div>
          <p class="loading-text theme-text-secondary">Loading calendar...</p>
        </div>
        
        <div v-else class="calendar-container">
          <!-- Calendar header -->
          <div class="calendar-header">
            <div class="month-navigation">
              <button 
                class="theme-button-icon month-nav-button" 
                @click="prevMonth"
                aria-label="Previous month"
              >
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              
              <h2 class="current-month theme-text-primary">{{ formatDate(currentDate) }}</h2>
              
              <button 
                class="theme-button-icon month-nav-button" 
                @click="nextMonth"
                aria-label="Next month"
              >
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            
            <button 
              class="theme-button-secondary today-button" 
              @click="currentDate = new Date()"
            >
              Today
            </button>
          </div>
          
          <!-- Calendar grid -->
          <div class="calendar-grid">
            <!-- Weekday headers -->
            <div class="weekday-header theme-text-secondary">Mon</div>
            <div class="weekday-header theme-text-secondary">Tue</div>
            <div class="weekday-header theme-text-secondary">Wed</div>
            <div class="weekday-header theme-text-secondary">Thu</div>
            <div class="weekday-header theme-text-secondary">Fri</div>
            <div class="weekday-header theme-text-secondary">Sat</div>
            <div class="weekday-header theme-text-secondary">Sun</div>
            
            <!-- Calendar days -->
            <div 
              v-for="(day, index) in calendarDays" 
              :key="index"
              class="theme-calendar-day calendar-day"
              :class="{
                'other-month': !day.isCurrentMonth,
                'weekend': isWeekend(day.date),
                'today': isSameDay(day.date, new Date())
              }"
            >
              <div class="day-header">
                <span class="day-number">{{ day.day }}</span>
              </div>
              
              <div class="day-content">
                <div 
                  v-for="task in tasksForDate(day.date)" 
                  :key="task.id"
                  class="theme-calendar-task calendar-task"
                  :class="task.status"
                  @click="viewTaskDetails(task.id)"
                >
                  <span class="task-title">{{ task.title }}</span>
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
.calendar-view {
  min-height: 100vh;
  background-color: var(--bg-primary);
}

.dashboard-layout {
  display: flex;
}

.calendar-main {
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

.calendar-container {
  max-width: 1200px;
  margin: 0 auto;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.month-navigation {
  display: flex;
  align-items: center;
  gap: 16px;
}

.month-nav-button {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
}

.month-nav-button svg {
  width: 20px;
  height: 20px;
}

.current-month {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.today-button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(100px, 1fr);
  gap: 8px;
}

.weekday-header {
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  padding: 12px 0;
}

.calendar-day {
  border-radius: 8px;
  padding: 8px;
  min-height: 100px;
  transition: background-color 0.2s;
}

.calendar-day.other-month {
  opacity: 0.5;
}

.calendar-day.weekend {
  background-color: var(--bg-secondary);
}

.calendar-day.today {
  background-color: var(--bg-highlight);
}

.day-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.day-number {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
}

.day-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: calc(100% - 24px);
  overflow-y: auto;
}

.calendar-task {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: transform 0.2s;
}

.calendar-task:hover {
  transform: translateY(-1px);
}

.calendar-task.pending {
  background-color: rgba(76, 175, 80, 0.15);
  color: var(--status-new);
}

.calendar-task.in-progress {
  background-color: rgba(33, 150, 243, 0.15);
  color: var(--status-in-progress);
}

.calendar-task.completed {
  background-color: rgba(156, 39, 176, 0.15);
  color: var(--status-completed);
}

@media (max-width: 768px) {
  .calendar-grid {
    grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: minmax(80px, 1fr);
    gap: 4px;
  }
  
  .calendar-day {
    padding: 4px;
    min-height: 80px;
  }
  
  .day-number {
    font-size: 12px;
  }
  
  .calendar-task {
    padding: 2px 4px;
    font-size: 10px;
  }
}
</style>