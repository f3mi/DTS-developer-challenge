<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTaskStore, type Task } from '../stores/tasks'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import AppHeader from '../components/AppHeader.vue'
import Sidebar from '../components/Sidebar.vue'

const taskStore = useTaskStore()
const authStore = useAuthStore()
const themeStore = useThemeStore()

// Reactive variables
const isLoading = ref(true)
const activeReport = ref('overview')
const searchQuery = ref('')
const dateRange = ref({
  start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
})

// Type definition for the report types
type ReportType = 'overview' | 'performance' | 'detailed'

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

// Weekly task completion data
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

function updateDateRange(): void {
  console.log('Date range updated:', dateRange.value)
}

function setActiveReport(reportType: string): void {
  activeReport.value = reportType as ReportType
}
</script>

<template>
  <div class="theme-view-container reports-view">
    <!-- Header section -->
    <AppHeader 
      :reminderCount="taskStore.tasksDueSoon.length"
      :reminderTasks="taskStore.tasksDueSoon"
      @search="handleSearch"
    />
    
    <!-- Main Layout -->
    <div class="theme-dashboard-layout dashboard-layout">
      <Sidebar />
      
      <!-- Main Content -->
      <main class="theme-main-content reports-main">
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
          <div class="theme-loader loading-spinner"></div>
          <p class="theme-text-secondary loading-text">Loading reports data...</p>
        </div>
  
        <!-- Reports Content -->
        <div v-else class="reports-content">
          <!-- Page header -->
          <div class="page-header">
            <div class="page-title">
              <h1 class="theme-text-primary">Reports Dashboard</h1>
              <p class="subtitle theme-text-secondary">Analytics and insights about your task management</p>
            </div>
            <div class="date-filter">
              <div class="date-range">
                <label for="start-date" class="theme-text-secondary">From:</label>
                <input 
                  type="date" 
                  id="start-date" 
                  v-model="dateRange.start" 
                  @change="updateDateRange"
                  class="theme-input"
                />
              </div>
              <div class="date-range">
                <label for="end-date" class="theme-text-secondary">To:</label>
                <input 
                  type="date" 
                  id="end-date" 
                  v-model="dateRange.end"
                  @change="updateDateRange"
                  class="theme-input"
                />
              </div>
            </div>
          </div>
  
          <!-- Report Types Navigation -->
          <div class="theme-tabs report-tabs">
            <button 
              :class="{ active: activeReport === 'overview' }"
              @click="setActiveReport('overview')"
              class="theme-tab-button"
            >
              Overview
            </button>
            <button 
              :class="{ active: activeReport === 'performance' }"
              @click="setActiveReport('performance')"
              class="theme-tab-button"
            >
              Performance
            </button>
            <button 
              :class="{ active: activeReport === 'detailed' }"
              @click="setActiveReport('detailed')"
              class="theme-tab-button"
            >
              Detailed Reports
            </button>
          </div>
  
          <!-- Report Section -->
          <div class="report-section">
            <!-- Overview Report -->
            <div v-if="activeReport === 'overview'" class="overview-report">
              <!-- Summary Cards -->
              <div class="summary-cards">
                <div class="theme-card card">
                  <h3 class="theme-text-secondary">Total Tasks</h3>
                  <div class="card-value theme-text-primary">{{ totalTasks }}</div>
                </div>
                <div class="theme-card card">
                  <h3 class="theme-text-secondary">Completed</h3>
                  <div class="card-value theme-text-primary">{{ completedTasks }}</div>
                  <div class="card-rate theme-text-secondary">{{ completionRate }}% completion rate</div>
                </div>
                <div class="theme-card card">
                  <h3 class="theme-text-secondary">In Progress</h3>
                  <div class="card-value theme-text-primary">{{ inProgressTasks }}</div>
                </div>
                <div class="theme-card card">
                  <h3 class="theme-text-secondary">Overdue</h3>
                  <div class="card-value theme-text-primary">{{ overdueTasks }}</div>
                </div>
              </div>
              
              <!-- Charts Section -->
              <div class="charts-section">
                <div class="theme-card chart-container">
                  <h3 class="theme-text-secondary">Completion Rate</h3>
                  <div class="completion-chart">
                    <div class="progress-circle">
                      <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="var(--bg-tertiary)" stroke-width="12" />
                        <circle 
                          cx="60" 
                          cy="60" 
                          r="54" 
                          fill="none" 
                          stroke="var(--success-color)" 
                          stroke-width="12"
                          stroke-dasharray="339.292"
                          :stroke-dashoffset="339.292 * (1 - completionRate / 100)"
                          transform="rotate(-90 60 60)"
                        />
                      </svg>
                      <div class="progress-text theme-text-primary">{{ completionRate }}%</div>
                    </div>
                  </div>
                </div>
                
                <div class="theme-card chart-container">
                  <h3 class="theme-text-secondary">Status Distribution</h3>
                  <div class="status-bars">
                    <div class="status-bar">
                      <div class="bar-label theme-text-secondary">Completed</div>
                      <div class="bar-container">
                        <div 
                          class="bar completed" 
                          :style="{ width: `${statusDistribution.completed}%` }"
                        ></div>
                      </div>
                      <div class="bar-value theme-text-primary">{{ statusDistribution.completed }}%</div>
                    </div>
                    <div class="status-bar">
                      <div class="bar-label theme-text-secondary">In Progress</div>
                      <div class="bar-container">
                        <div 
                          class="bar in-progress" 
                          :style="{ width: `${statusDistribution.inProgress}%` }"
                        ></div>
                      </div>
                      <div class="bar-value theme-text-primary">{{ statusDistribution.inProgress }}%</div>
                    </div>
                    <div class="status-bar">
                      <div class="bar-label theme-text-secondary">Pending</div>
                      <div class="bar-container">
                        <div 
                          class="bar pending" 
                          :style="{ width: `${statusDistribution.pending}%` }"
                        ></div>
                      </div>
                      <div class="bar-value theme-text-primary">{{ statusDistribution.pending }}%</div>
                    </div>
                    <div class="status-bar">
                      <div class="bar-label theme-text-secondary">Overdue</div>
                      <div class="bar-container">
                        <div 
                          class="bar overdue" 
                          :style="{ width: `${statusDistribution.overdue}%` }"
                        ></div>
                      </div>
                      <div class="bar-value theme-text-primary">{{ statusDistribution.overdue }}%</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Weekly Activity Chart -->
              <div class="theme-card weekly-activity">
                <h3 class="theme-text-secondary">Weekly Activity</h3>
                <div class="bar-chart">
                  <div 
                    v-for="(day, index) in weeklyCompletionData" 
                    :key="index"
                    class="chart-column"
                  >
                    <div 
                      class="chart-bar" 
                      :style="{ height: `${Math.max(day.count * 20, 10)}px` }"
                    ></div>
                    <div class="chart-label theme-text-secondary">{{ day.day }}</div>
                    <div class="chart-value theme-text-primary">{{ day.count }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Performance Report -->
            <div v-else-if="activeReport === 'performance'" class="performance-report">
              <h2 class="theme-text-primary">Performance Metrics</h2>
              <p class="theme-text-secondary">Task completion analytics and productivity insights</p>
              
              <!-- Time-based metrics -->
              <div class="metrics-grid">
                <div class="theme-card metric-card">
                  <h3 class="theme-text-secondary">Task Completion Time</h3>
                  <div class="metric-chart">
                    <div class="time-metric">
                      <div class="time-value theme-text-primary">2.4</div>
                      <div class="time-unit theme-text-secondary">days</div>
                    </div>
                    <div class="metric-label theme-text-secondary">Average completion time</div>
                    <div class="metric-trend positive">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="18 15 12 9 6 15"></polyline>
                      </svg>
                      <span>12% faster than last month</span>
                    </div>
                  </div>
                </div>
                
                <div class="theme-card metric-card">
                  <h3 class="theme-text-secondary">Tasks Completed</h3>
                  <div class="metric-chart">
                    <div class="time-metric">
                      <div class="time-value theme-text-primary">{{ completedTasks }}</div>
                      <div class="time-unit theme-text-secondary">tasks</div>
                    </div>
                    <div class="metric-label theme-text-secondary">Completed this period</div>
                    <div class="metric-trend positive">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="18 15 12 9 6 15"></polyline>
                      </svg>
                      <span>8% more than previous period</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Detailed Report -->
            <div v-else-if="activeReport === 'detailed'" class="detailed-report">
              <h2 class="theme-text-primary">Detailed Task Reports</h2>
              <p class="theme-text-secondary">
                View all tasks within the selected date range. Filter and sort to analyze your task management patterns.
              </p>
              
              <div class="theme-card tasks-table-container">
                <div v-if="tasksInDateRange.length === 0" class="no-tasks theme-text-secondary">
                  No tasks found in the selected date range.
                </div>
                <table v-else class="tasks-table">
                  <thead>
                    <tr>
                      <th class="theme-text-secondary">Task</th>
                      <th class="theme-text-secondary">Status</th>
                      <th class="theme-text-secondary">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="task in tasksInDateRange" :key="task.id">
                      <td class="theme-text-primary">{{ task.title }}</td>
                      <td>
                        <span class="theme-status-pill" :class="task.status">
                          {{ task.status.replace('-', ' ') }}
                        </span>
                      </td>
                      <td class="theme-text-secondary">{{ formatDate(task.dueDate) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.reports-view {
  min-height: 100vh;
  background-color: var(--bg-primary);
}

.dashboard-layout {
  display: flex;
}

.reports-main {
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
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.page-title .subtitle {
  font-size: 14px;
  margin: 4px 0 0 0;
}

.date-filter {
  display: flex;
  gap: 16px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-range label {
  font-size: 14px;
}

.date-range input[type="date"] {
  border-radius: 4px;
  padding: 8px;
  font-size: 14px;
}

.report-tabs {
  margin-bottom: 24px;
}

.report-section {
  margin-top: 24px;
}

/* Overview Report Styles */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.card {
  padding: 24px;
  text-align: center;
}

.card h3 {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 12px 0;
}

.card-value {
  font-size: 32px;
  font-weight: 600;
  margin: 0;
}

.card-rate {
  font-size: 14px;
  margin-top: 8px;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.chart-container {
  padding: 24px;
  text-align: center;
}

.chart-container h3 {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 16px 0;
}

.completion-chart {
  display: flex;
  justify-content: center;
}

.progress-circle {
  position: relative;
  width: 120px;
  height: 120px;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-weight: 600;
}

.status-bars {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-bar {
  display: grid;
  grid-template-columns: 100px 1fr 60px;
  align-items: center;
  gap: 12px;
}

.bar-label {
  font-size: 14px;
  text-align: left;
}

.bar-container {
  height: 8px;
  background-color: var(--bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
}

.bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s;
}

.bar.completed {
  background-color: var(--status-completed);
}

.bar.in-progress {
  background-color: var(--status-in-progress);
}

.bar.pending {
  background-color: var(--status-new);
}

.bar.overdue {
  background-color: var(--error-color);
}

.bar-value {
  font-size: 14px;
  font-weight: 600;
  text-align: right;
}

.weekly-activity {
  padding: 24px;
  margin-bottom: 24px;
}

.weekly-activity h3 {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 16px 0;
  text-align: center;
}

.bar-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 180px;
}

.chart-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.chart-bar {
  width: 40px;
  background-color: var(--primary-color);
  border-radius: 4px 4px 0 0;
  margin-bottom: 8px;
  transition: height 0.5s;
}

.chart-label {
  font-size: 14px;
  margin-bottom: 4px;
}

.chart-value {
  font-size: 14px;
  font-weight: 600;
}

/* Performance Report Styles */
.performance-report h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.performance-report > p {
  font-size: 16px;
  margin: 0 0 24px 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  padding: 24px;
}

.metric-card h3 {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 16px 0;
  text-align: center;
}

.metric-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-metric {
  display: flex;
  align-items: baseline;
  margin-bottom: 8px;
}

.time-value {
  font-size: 36px;
  font-weight: 600;
}

.time-unit {
  font-size: 18px;
  margin-left: 4px;
}

.metric-label {
  font-size: 14px;
  margin-bottom: 16px;
}

.metric-trend {
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 16px;
}

.metric-trend.positive {
  color: var(--success-color);
  background-color: rgba(76, 175, 80, 0.15);
}

.metric-trend.negative {
  color: var(--error-color);
  background-color: rgba(244, 67, 54, 0.15);
}

.metric-trend svg {
  margin-right: 4px;
}

/* Detailed Report Styles */
.detailed-report h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.detailed-report > p {
  font-size: 16px;
  margin: 0 0 24px 0;
}

.tasks-table-container {
  overflow-x: auto;
  padding: 24px;
}

.no-tasks {
  text-align: center;
  padding: 48px 0;
  font-size: 16px;
}

.tasks-table {
  width: 100%;
  border-collapse: collapse;
}

.tasks-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 500;
  border-bottom: 1px solid var(--border-color);
}

.tasks-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}

.theme-status-pill {
  display: inline-block;
  padding: 4px 10px;
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

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .date-filter {
    width: 100%;
    flex-direction: column;
  }
  
  .summary-cards,
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .chart-bar {
    width: 30px;
  }
}
</style> 