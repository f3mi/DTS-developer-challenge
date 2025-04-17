<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore, type Task } from '../stores/tasks'
import { useAuthStore } from '../stores/auth'
import AppHeader from '../components/AppHeader.vue'
import Sidebar from '../components/Sidebar.vue'

const router = useRouter()
const taskStore = useTaskStore()
const authStore = useAuthStore()

// Reactive variables
const isLoading = ref(true)
const currentDate = ref(new Date())
const searchQuery = ref('')

// Simulate loading
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 800)
})

// Calendar navigation
function prevMonth() {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
}

function nextMonth() {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
}

function goToToday() {
  currentDate.value = new Date()
}

// Format date for display
function formatDate(date: Date, format: 'month-year' | 'day' | 'full' = 'full'): string {
  if (format === 'month-year') {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  } else if (format === 'day') {
    return date.getDate().toString()
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
}

// Get all days in the current month view
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // First day of the month
  const firstDay = new Date(year, month, 1)
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0)
  
  // Day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayIndex = firstDay.getDay()
  // Total days in the month
  const daysInMonth = lastDay.getDate()
  
  // Create array for all days to display
  const days = []
  
  // Add days from previous month to fill the first week
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i)
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isSameDay(date, new Date()),
      isWeekend: isWeekend(date)
    })
  }
  
  // Add days from current month
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    days.push({
      date,
      isCurrentMonth: true,
      isToday: isSameDay(date, new Date()),
      isWeekend: isWeekend(date)
    })
  }
  
  // Add days from next month to complete the last week
  const remainingDays = 42 - days.length // 6 rows x 7 days = 42
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isSameDay(date, new Date()),
      isWeekend: isWeekend(date)
    })
  }
  
  return days
})

// Helper function to check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
}

// Helper function to check if a date is a weekend
function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6 // 0 = Sunday, 6 = Saturday
}

// Tasks for each day
const tasksForDay = computed(() => {
  const taskMap = new Map<string, Task[]>()
  
  taskStore.tasks.forEach(task => {
    const taskDate = new Date(task.dueDate)
    const dateKey = taskDate.toISOString().split('T')[0]
    
    if (!taskMap.has(dateKey)) {
      taskMap.set(dateKey, [])
    }
    
    taskMap.get(dateKey)!.push(task)
  })
  
  return taskMap
})

// Get tasks for a specific date
function getTasksForDate(date: Date): Task[] {
  const dateKey = date.toISOString().split('T')[0]
  return tasksForDay.value.get(dateKey) || []
}

// Handle task click
function viewTaskDetails(taskId: number): void {
  router.push(`/task/${taskId}`)
}

function handleSearch(query: string): void {
  searchQuery.value = query
}

function logout(): void {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="dashboard-task">
    <!-- Header section -->
    <AppHeader 
      :reminderCount="taskStore.tasksDueSoon.length"
      :reminderTasks="taskStore.tasksDueSoon"
      @search="handleSearch"
      @view-task="viewTaskDetails"
      @logout="logout"
    />
    
    <!-- Main Layout -->
    <div class="dashboard-layout">
      <Sidebar />
      
      <!-- Main Content -->
      <main class="dashboard-main">
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">Loading calendar...</p>
        </div>
  
        <!-- Calendar Content -->
        <div v-else class="main-content">
          <!-- Page header -->
          <div class="page-header">
            <div class="page-title">
              <h1>Calendar</h1>
              <p class="subtitle">View your tasks by due date</p>
            </div>
            <div class="calendar-navigation">
              <button @click="prevMonth" class="nav-button">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button @click="goToToday" class="today-button">Today</button>
              <button @click="nextMonth" class="nav-button">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <h2 class="current-month">{{ formatDate(currentDate, 'month-year') }}</h2>
            </div>
          </div>
          
          <!-- Calendar -->
          <div class="calendar-container">
            <!-- Weekday headers -->
            <div class="weekday-header">Sun</div>
            <div class="weekday-header">Mon</div>
            <div class="weekday-header">Tue</div>
            <div class="weekday-header">Wed</div>
            <div class="weekday-header">Thu</div>
            <div class="weekday-header">Fri</div>
            <div class="weekday-header">Sat</div>
            
            <!-- Calendar days -->
            <div 
              v-for="(day, index) in calendarDays" 
              :key="index" 
              :class="[
                'calendar-day', 
                { 
                  'current-month': day.isCurrentMonth,
                  'other-month': !day.isCurrentMonth,
                  'today': day.isToday,
                  'weekend': day.isWeekend
                }
              ]"
            >
              <div class="day-number">{{ formatDate(day.date, 'day') }}</div>
              
              <!-- Tasks for this day -->
              <div class="day-tasks">
                <div 
                  v-for="task in getTasksForDate(day.date).slice(0, 3)" 
                  :key="task.id"
                  :class="['task-item', `status-${task.status}`]"
                  @click="viewTaskDetails(task.id)"
                >
                  <div class="task-title">{{ task.title }}</div>
                </div>
                
                <!-- Show count if there are more tasks -->
                <div v-if="getTasksForDate(day.date).length > 3" class="more-tasks">
                  +{{ getTasksForDate(day.date).length - 3 }} more
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
  background-color: #f5f7fa;
}

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
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.page-title h1 {
  font-size: 24px;
  font-weight: 700;
  color: #323338;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: #676879;
  margin: 0;
}

.calendar-navigation {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #e6e9ef;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  color: #676879;
  transition: all 0.2s;
}

.nav-button:hover {
  background-color: #f5f6f8;
  color: #323338;
}

.nav-button svg {
  width: 20px;
  height: 20px;
}

.today-button {
  padding: 8px 12px;
  background-color: white;
  border: 1px solid #e6e9ef;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #676879;
  cursor: pointer;
  transition: all 0.2s;
}

.today-button:hover {
  background-color: #f5f6f8;
  color: #323338;
}

.current-month {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #323338;
}

.calendar-container {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #e6e9ef;
  border: 1px solid #e6e9ef;
  border-radius: 8px;
  overflow: hidden;
}

.weekday-header {
  background-color: #f8f9fb;
  padding: 12px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #676879;
}

.calendar-day {
  background-color: white;
  min-height: 100px;
  padding: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.current-month {
  background-color: white;
}

.other-month {
  background-color: #f8f9fb;
}

.today {
  background-color: #f0f7ff;
}

.weekend {
  background-color: #fafbfd;
}

.day-number {
  font-size: 14px;
  font-weight: 600;
  color: #323338;
  margin-bottom: 8px;
}

.today .day-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: #0073ea;
  color: white;
  border-radius: 50%;
}

.day-tasks {
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
}

.task-item {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: transform 0.2s;
}

.task-item:hover {
  transform: translateY(-2px);
}

.status-pending {
  background-color: #FFF8E1;
  color: #F57C00;
  border-left: 3px solid #F57C00;
}

.status-in-progress {
  background-color: #E3F2FD;
  color: #1976D2;
  border-left: 3px solid #1976D2;
}

.status-completed {
  background-color: #E8F5E9;
  color: #388E3C;
  border-left: 3px solid #388E3C;
}

.more-tasks {
  font-size: 11px;
  color: #676879;
  text-align: center;
  padding: 2px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .calendar-navigation {
    width: 100%;
    justify-content: space-between;
  }
  
  .calendar-container {
    grid-template-columns: repeat(7, 1fr);
  }
  
  .calendar-day {
    min-height: 80px;
    padding: 4px;
  }
  
  .task-item {
    padding: 2px 4px;
    font-size: 10px;
  }
}
</style>