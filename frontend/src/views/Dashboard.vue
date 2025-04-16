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
const activeReport = ref('overview')
const searchQuery = ref('')
const dateRange = ref({
  start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
})

// Simulate loading
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 800)
})

// Computed properties for reports
const filteredTasks = computed(() => {
  if (!searchQuery.value) return taskStore.tasks
  
  const query = searchQuery.value.toLowerCase()
  return taskStore.tasks.filter(task => 
    task.title.toLowerCase().includes(query) || 
    (task.description?.toLowerCase().includes(query) || false)
  )
})

const totalTasks = computed(() => filteredTasks.value.length)

const inProgressTasks = computed(() => 
  filteredTasks.value.filter(task => task.status === 'in-progress').length
)

const completedTasks = computed(() => 
  filteredTasks.value.filter(task => task.status === 'completed').length
)

const overdueTasks = computed(() => 
  filteredTasks.value.filter(task => 
    task.status !== 'completed' && new Date(task.dueDate) < new Date()
  ).length
)

const tasksInDateRange = computed(() => {
  const startDate = new Date(dateRange.value.start)
  startDate.setHours(0, 0, 0, 0)
  
  const endDate = new Date(dateRange.value.end)
  endDate.setHours(23, 59, 59, 999)
  
  return filteredTasks.value.filter(task => {
    const taskDate = new Date(task.dueDate)
    return taskDate >= startDate && taskDate <= endDate
  })
})

const completionRate = computed(() => {
  if (totalTasks.value === 0) return 0
  return Math.round((completedTasks.value / totalTasks.value) * 100)
})

const statusDistribution = computed(() => {
  const total = totalTasks.value
  if (total === 0) return { completed: 0, inProgress: 0, pending: 0, overdue: 0 }
  
  const pending = filteredTasks.value.filter(task => 
    task.status === 'pending' && new Date(task.dueDate) >= new Date()
  ).length
  
  return {
    completed: Math.round((completedTasks.value / total) * 100),
    inProgress: Math.round((inProgressTasks.value / total) * 100),
    pending: Math.round((pending / total) * 100),
    overdue: Math.round((overdueTasks.value / total) * 100)
  }
})

// Weekly task completion data (simulated)
const weeklyCompletionData = computed(() => {
  const now = new Date()
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const result = []
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Count completed tasks on this day
    const completedOnDay = filteredTasks.value.filter(task => {
      const taskDate = new Date(task.dueDate)
      return task.status === 'completed' && 
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
    }).length
    
    result.push({
      day: days[date.getDay()],
      count: completedOnDay
    })
  }
  
  return result
})

// Utility functions
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function handleSearch(): void {
  console.log('Searching for:', searchQuery.value)
}

function viewTaskDetails(taskId: number): void {
  router.push(`/task/${taskId}`)
}

function logout(): void {
  authStore.logout()
  router.push('/login')
}

function updateDateRange(): void {
  console.log('Date range updated:', dateRange.value)
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
          <p class="loading-text">Loading reports data...</p>
        </div>
  
        <!-- Reports Content -->
        <div v-else class="main-content">
          <!-- Page header -->
          <div class="page-header">
            <div class="page-title">
              <h1>Task Reports</h1>
              <p class="subtitle">Analytics and insights about your task management</p>
            </div>
            <div class="date-filter">
              <div class="date-range">
                <label for="start-date">From:</label>
                <input 
                  type="date" 
                  id="start-date" 
                  v-model="dateRange.start" 
                  @change="updateDateRange"
                />
              </div>
              <div class="date-range">
                <label for="end-date">To:</label>
                <input 
                  type="date" 
                  id="end-date" 
                  v-model="dateRange.end"
                  @change="updateDateRange"
                />
              </div>
            </div>
          </div>
  
          <!-- Report Types Navigation -->
          <div class="report-tabs">
            <button 
              @click="activeReport = 'overview'" 
              :class="{ active: activeReport === 'overview' }"
            >
              Overview
            </button>
            <button 
              @click="activeReport = 'completion'" 
              :class="{ active: activeReport === 'completion' }"
            >
              Completion Rate
            </button>
            <button 
              @click="activeReport = 'status'" 
              :class="{ active: activeReport === 'status' }"
            >
              Status Distribution
            </button>
            <button 
              @click="activeReport = 'time'" 
              :class="{ active: activeReport === 'time' }"
            >
              Time Analysis
            </button>
          </div>
  
          <!-- Summary Cards -->
          <div class="metrics-grid">
            <div class="metric-card">
              <h3>Total Tasks</h3>
              <div class="metric-value">{{ totalTasks }}</div>
            </div>
            <div class="metric-card">
              <h3>In Progress</h3>
              <div class="metric-value">{{ inProgressTasks }}</div>
            </div>
            <div class="metric-card">
              <h3>Completed</h3>
              <div class="metric-value">{{ completedTasks }}</div>
            </div>
            <div class="metric-card">
              <h3>Overdue</h3>
              <div class="metric-value">{{ overdueTasks }}</div>
            </div>
          </div>
  
          <!-- Completion Rate Chart -->
          <div v-if="activeReport === 'overview' || activeReport === 'completion'" class="chart-section">
            <h2>Task Completion Rate</h2>
            <div class="completion-rate">
              <div class="progress-circle">
                <svg viewBox="0 0 36 36">
                  <path class="circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path class="circle"
                    :stroke-dasharray="`${completionRate}, 100`"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" class="percentage">{{ completionRate }}%</text>
                </svg>
              </div>
              <div class="completion-details">
                <h3>Completion Summary</h3>
                <p>You have completed {{ completedTasks }} out of {{ totalTasks }} tasks in the selected period.</p>
                <p>Current completion rate: <strong>{{ completionRate }}%</strong></p>
              </div>
            </div>
          </div>
  
          <!-- Status Distribution Chart -->
          <div v-if="activeReport === 'overview' || activeReport === 'status'" class="chart-section">
            <h2>Task Status Distribution</h2>
            <div class="status-distribution">
              <div class="bar-chart">
                <div class="bar-container">
                  <div class="bar-label">Completed</div>
                  <div class="bar-outer">
                    <div class="bar-inner completed" :style="`width: ${statusDistribution.completed}%`"></div>
                  </div>
                  <div class="bar-value">{{ statusDistribution.completed }}%</div>
                </div>
                <div class="bar-container">
                  <div class="bar-label">In Progress</div>
                  <div class="bar-outer">
                    <div class="bar-inner in-progress" :style="`width: ${statusDistribution.inProgress}%`"></div>
                  </div>
                  <div class="bar-value">{{ statusDistribution.inProgress }}%</div>
                </div>
                <div class="bar-container">
                  <div class="bar-label">Pending</div>
                  <div class="bar-outer">
                    <div class="bar-inner pending" :style="`width: ${statusDistribution.pending}%`"></div>
                  </div>
                  <div class="bar-value">{{ statusDistribution.pending }}%</div>
                </div>
                <div class="bar-container">
                  <div class="bar-label">Overdue</div>
                  <div class="bar-outer">
                    <div class="bar-inner overdue" :style="`width: ${statusDistribution.overdue}%`"></div>
                  </div>
                  <div class="bar-value">{{ statusDistribution.overdue }}%</div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Weekly Activity Chart -->
          <div v-if="activeReport === 'overview' || activeReport === 'time'" class="chart-section">
            <h2>Weekly Task Completion</h2>
            <div class="weekly-chart">
              <div class="weekly-bars">
                <div 
                  v-for="(day, index) in weeklyCompletionData" 
                  :key="index" 
                  class="weekly-bar-container"
                >
                  <div 
                    class="weekly-bar" 
                    :style="`height: ${day.count * 20}px`"
                  ></div>
                  <div class="weekly-day">{{ day.day }}</div>
                  <div class="weekly-count">{{ day.count }}</div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Tasks in Date Range Table -->
          <div class="tasks-table-container">
            <h2>Tasks in Selected Period</h2>
            <table class="tasks-table" v-if="tasksInDateRange.length > 0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="task in tasksInDateRange" :key="task.id">
                  <td>{{ task.title }}</td>
                  <td>
                    <span :class="['status-pill', `status-${task.status}`]">
                      {{ task.status.replace('-', ' ') }}
                    </span>
                  </td>
                  <td>{{ formatDate(task.dueDate) }}</td>
                  <td>
                    <button @click="viewTaskDetails(task.id)" class="view-btn">View</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-else class="no-tasks">No tasks found in the selected date range.</p>
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
  align-items: center;
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

.date-filter {
  display: flex;
  gap: 16px;
  align-items: center;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-range label {
  font-size: 14px;
  color: #676879;
}

.date-range input {
  padding: 8px;
  border: 1px solid #c3c6d4;
  border-radius: 4px;
  font-size: 14px;
}

.report-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e6e9ef;
  padding-bottom: 8px;
}

.report-tabs button {
  padding: 8px 16px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #676879;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.report-tabs button:hover {
  background-color: #f0f0f5;
}

.report-tabs button.active {
  background-color: #0073ea;
  color: white;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.metric-card h3 {
  font-size: 14px;
  font-weight: 500;
  color: #676879;
  margin: 0 0 8px 0;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: #323338;
}

.chart-section {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-section h2 {
  font-size: 16px;
  font-weight: 700;
  color: #323338;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e6e9ef;
}

.completion-rate {
  display: flex;
  align-items: center;
  gap: 32px;
}

.progress-circle {
  width: 150px;
  height: 150px;
}

.progress-circle svg {
  width: 100%;
  height: 100%;
}

.circle-bg {
  fill: none;
  stroke: #eee;
  stroke-width: 3.8;
}

.circle {
  fill: none;
  stroke: #0073ea;
  stroke-width: 3.8;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dasharray 0.5s;
}

.percentage {
  fill: #323338;
  font-size: 0.5em;
  text-anchor: middle;
  font-weight: bold;
}

.completion-details h3 {
  font-size: 16px;
  font-weight: 600;
  color: #323338;
  margin: 0 0 8px 0;
}

.completion-details p {
  font-size: 14px;
  color: #676879;
  margin: 0 0 8px 0;
}

.status-distribution {
  padding: 16px 0;
}

.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bar-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.bar-label {
  width: 100px;
  font-size: 14px;
  color: #323338;
}

.bar-outer {
  flex-grow: 1;
  height: 16px;
  background-color: #f0f0f5;
  border-radius: 8px;
  overflow: hidden;
}

.bar-inner {
  height: 100%;
  border-radius: 8px;
  transition: width 0.5s;
}

.bar-inner.completed {
  background-color: #4CAF50;
}

.bar-inner.in-progress {
  background-color: #2196F3;
}

.bar-inner.pending {
  background-color: #FFC107;
}

.bar-inner.overdue {
  background-color: #F44336;
}

.bar-value {
  width: 50px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: #323338;
}

.weekly-chart {
  padding: 16px 0;
}

.weekly-bars {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 200px;
}

.weekly-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
}

.weekly-bar {
  width: 24px;
  background-color: #0073ea;
  border-radius: 4px 4px 0 0;
  transition: height 0.5s;
  min-height: 4px;
}

.weekly-day {
  margin-top: 8px;
  font-size: 12px;
  color: #676879;
}

.weekly-count {
  font-size: 12px;
  font-weight: 600;
  color: #323338;
  margin-top: 4px;
}

.tasks-table-container {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tasks-table-container h2 {
  font-size: 16px;
  font-weight: 700;
  color: #323338;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e6e9ef;
}

.tasks-table {
  width: 100%;
  border-collapse: collapse;
}

.tasks-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #676879;
  border-bottom: 1px solid #e6e9ef;
}

.tasks-table td {
  padding: 12px 16px;
  font-size: 14px;
  color: #323338;
  border-bottom: 1px solid #e6e9ef;
}

.status-pill {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.status-pending {
  background-color: #FFF8E1;
  color: #F57C00;
}

.status-in-progress {
  background-color: #E3F2FD;
  color: #1976D2;
}

.status-completed {
  background-color: #E8F5E9;
  color: #388E3C;
}

.view-btn {
  padding: 4px 8px;
  background-color: #f0f0f5;
  border: none;
  border-radius: 4px;
  color: #323338;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.view-btn:hover {
  background-color: #e6e9ef;
}

.no-tasks {
  text-align: center;
  padding: 24px;
  color: #676879;
  font-size: 14px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .date-filter {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .completion-rate {
    flex-direction: column;
  }
  
  .bar-container {
    flex-wrap: wrap;
  }
  
  .bar-label {
    width: auto;
    min-width: 80px;
  }
}
</style> 