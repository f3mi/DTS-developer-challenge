<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTaskStore, type Task } from '../stores/tasks'
import { useAuthStore } from '../stores/auth'
import AppHeader from '../components/AppHeader.vue'
import Sidebar from '../components/Sidebar.vue'

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
  <div class="reports-view">
    <!-- Header section -->
    <AppHeader 
      :reminderCount="taskStore.tasksDueSoon.length"
      :reminderTasks="taskStore.tasksDueSoon"
      @search="handleSearch"
    />
    
    <!-- Main Layout -->
    <div class="dashboard-layout">
      <Sidebar />
      
      <!-- Main Content -->
      <main class="reports-main">
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">Loading reports data...</p>
        </div>
  
        <!-- Reports Content -->
        <div v-else class="reports-content">
          <!-- Page header -->
          <div class="page-header">
            <div class="page-title">
              <h1>Reports Dashboard</h1>
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
              :class="{ active: activeReport === 'overview' }"
              @click="setActiveReport('overview')"
            >
              Overview
            </button>
            <button 
              :class="{ active: activeReport === 'performance' }"
              @click="setActiveReport('performance')"
            >
              Performance
            </button>
            <button 
              :class="{ active: activeReport === 'detailed' }"
              @click="setActiveReport('detailed')"
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
                <div class="card">
                  <h3>Total Tasks</h3>
                  <div class="card-value">{{ totalTasks }}</div>
                </div>
                <div class="card">
                  <h3>Completed</h3>
                  <div class="card-value">{{ completedTasks }}</div>
                  <div class="card-rate">{{ completionRate }}% completion rate</div>
                </div>
                <div class="card">
                  <h3>In Progress</h3>
                  <div class="card-value">{{ inProgressTasks }}</div>
                </div>
                <div class="card">
                  <h3>Overdue</h3>
                  <div class="card-value">{{ overdueTasks }}</div>
                </div>
              </div>
              
              <!-- Charts Section -->
              <div class="charts-section">
                <div class="chart-container">
                  <h3>Completion Rate</h3>
                  <div class="completion-chart">
                    <div class="progress-circle">
                      <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="#e6e6e6" stroke-width="12" />
                        <circle 
                          cx="60" 
                          cy="60" 
                          r="54" 
                          fill="none" 
                          stroke="#4caf50" 
                          stroke-width="12"
                          stroke-dasharray="339.292"
                          :stroke-dashoffset="339.292 * (1 - completionRate / 100)"
                          transform="rotate(-90 60 60)"
                        />
                      </svg>
                      <div class="progress-text">{{ completionRate }}%</div>
                    </div>
                  </div>
                </div>
                
                <div class="chart-container">
                  <h3>Status Distribution</h3>
                  <div class="status-bars">
                    <div class="status-bar">
                      <div class="bar-label">Completed</div>
                      <div class="bar-container">
                        <div 
                          class="bar completed" 
                          :style="{ width: `${statusDistribution.completed}%` }"
                        ></div>
                      </div>
                      <div class="bar-value">{{ statusDistribution.completed }}%</div>
                    </div>
                    <div class="status-bar">
                      <div class="bar-label">In Progress</div>
                      <div class="bar-container">
                        <div 
                          class="bar in-progress" 
                          :style="{ width: `${statusDistribution.inProgress}%` }"
                        ></div>
                      </div>
                      <div class="bar-value">{{ statusDistribution.inProgress }}%</div>
                    </div>
                    <div class="status-bar">
                      <div class="bar-label">Pending</div>
                      <div class="bar-container">
                        <div 
                          class="bar pending" 
                          :style="{ width: `${statusDistribution.pending}%` }"
                        ></div>
                      </div>
                      <div class="bar-value">{{ statusDistribution.pending }}%</div>
                    </div>
                    <div class="status-bar">
                      <div class="bar-label">Overdue</div>
                      <div class="bar-container">
                        <div 
                          class="bar overdue" 
                          :style="{ width: `${statusDistribution.overdue}%` }"
                        ></div>
                      </div>
                      <div class="bar-value">{{ statusDistribution.overdue }}%</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Weekly Activity Chart -->
              <div class="weekly-activity">
                <h3>Weekly Activity</h3>
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
                    <div class="chart-label">{{ day.day }}</div>
                    <div class="chart-value">{{ day.count }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Performance Report -->
            <div v-else-if="activeReport === 'performance'" class="performance-report">
              <h2>Performance Metrics</h2>
              <p>Task completion analytics and productivity insights</p>
              
              <!-- Time-based metrics -->
              <div class="metrics-grid">
                <div class="metric-card">
                  <h3>Task Completion Time</h3>
                  <div class="metric-chart">
                    <div class="time-metric">
                      <div class="time-value">2.4</div>
                      <div class="time-unit">days</div>
                    </div>
                    <div class="metric-label">Average completion time</div>
                    <div class="metric-trend positive">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="18 15 12 9 6 15"></polyline>
                      </svg>
                      <span>12% faster than last month</span>
                    </div>
                  </div>
                </div>

                <div class="metric-card">
                  <h3>Response Time</h3>
                  <div class="metric-chart">
                    <div class="time-metric">
                      <div class="time-value">4.7</div>
                      <div class="time-unit">hours</div>
                    </div>
                    <div class="metric-label">Average time to start tasks</div>
                    <div class="metric-trend negative">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                      <span>8% slower than last month</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Productivity score -->
              <div class="productivity-section">
                <h3>Productivity Score</h3>
                <div class="productivity-chart">
                  <div class="score-gauge">
                    <svg width="200" height="120" viewBox="0 0 200 120">
                      <!-- Background arc -->
                      <path d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke="#e6e6e6" stroke-width="16" stroke-linecap="round" />
                      <!-- Value arc (76% filled) -->
                      <path d="M20,100 A80,80 0 0,1 153,60" fill="none" stroke="#4caf50" stroke-width="16" stroke-linecap="round" />
                      <!-- Marker -->
                      <circle cx="153" cy="60" r="8" fill="#333" />
                    </svg>
                    <div class="score-value">76</div>
                    <div class="score-label">out of 100</div>
                  </div>
                  <div class="score-details">
                    <div class="score-item">
                      <div class="score-name">Tasks completed on time</div>
                      <div class="score-bar-container">
                        <div class="score-bar" style="width: 82%"></div>
                      </div>
                      <div class="score-percentage">82%</div>
                    </div>
                    <div class="score-item">
                      <div class="score-name">Response rate</div>
                      <div class="score-bar-container">
                        <div class="score-bar" style="width: 90%"></div>
                      </div>
                      <div class="score-percentage">90%</div>
                    </div>
                    <div class="score-item">
                      <div class="score-name">Workload balance</div>
                      <div class="score-bar-container">
                        <div class="score-bar" style="width: 65%"></div>
                      </div>
                      <div class="score-percentage">65%</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Monthly comparison -->
              <div class="comparison-section">
                <h3>Monthly Comparison</h3>
                <div class="comparison-chart">
                  <div class="month-column">
                    <div class="month-label">January</div>
                    <div class="month-bar-container">
                      <div class="month-bar" style="height: 160px;"></div>
                      <div class="month-value">24</div>
                    </div>
                  </div>
                  <div class="month-column">
                    <div class="month-label">February</div>
                    <div class="month-bar-container">
                      <div class="month-bar" style="height: 120px;"></div>
                      <div class="month-value">18</div>
                    </div>
                  </div>
                  <div class="month-column">
                    <div class="month-label">March</div>
                    <div class="month-bar-container">
                      <div class="month-bar" style="height: 140px;"></div>
                      <div class="month-value">21</div>
                    </div>
                  </div>
                  <div class="month-column">
                    <div class="month-label">April</div>
                    <div class="month-bar-container">
                      <div class="month-bar" style="height: 180px;"></div>
                      <div class="month-value">27</div>
                    </div>
                  </div>
                  <div class="month-column">
                    <div class="month-label">May</div>
                    <div class="month-bar-container">
                      <div class="month-bar" style="height: 200px;"></div>
                      <div class="month-value">30</div>
                    </div>
                  </div>
                  <div class="month-column">
                    <div class="month-label">June</div>
                    <div class="month-bar-container">
                      <div class="month-bar current" style="height: 220px;"></div>
                      <div class="month-value">33</div>
                    </div>
                  </div>
                </div>
                <div class="comparison-legend">
                  <div class="legend-item">
                    <div class="legend-color"></div>
                    <div class="legend-label">Tasks completed per month</div>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color current"></div>
                    <div class="legend-label">Current month</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Detailed Report -->
            <div v-else-if="activeReport === 'detailed'" class="detailed-report">
              <h2>Detailed Task Reports</h2>
              
              <!-- Tasks in date range -->
              <div class="tasks-in-range">
                <h3>Tasks within selected date range ({{ tasksInDateRange.length }})</h3>
                
                <table class="tasks-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="task in tasksInDateRange" :key="task.id">
                      <td>{{ task.title }}</td>
                      <td>
                        <span :class="`status-badge ${task.status}`">
                          {{ task.status }}
                        </span>
                      </td>
                      <td>{{ formatDate(task.dueDate) }}</td>
                    </tr>
                    <tr v-if="tasksInDateRange.length === 0">
                      <td colspan="3" class="no-data">No tasks in the selected date range</td>
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
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.dashboard-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.reports-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f7fa;
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.subtitle {
  margin: 4px 0 0;
  color: #666;
  font-size: 14px;
}

.date-filter {
  display: flex;
  gap: 12px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-range label {
  font-size: 14px;
  color: #666;
}

.date-range input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.report-tabs {
  display: flex;
  margin-bottom: 24px;
  border-bottom: 1px solid #ddd;
}

.report-tabs button {
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 15px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.report-tabs button:hover {
  color: #333;
}

.report-tabs button.active {
  color: #3498db;
  border-bottom-color: #3498db;
}

.report-section {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

/* Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 4px solid #3498db;
}

.card h3 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.card-value {
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.card-rate {
  margin-top: 4px;
  font-size: 13px;
  color: #666;
}

/* Charts Section */
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.chart-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.chart-container h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

/* Completion Chart */
.completion-chart {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

.progress-circle {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-text {
  position: absolute;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

/* Status Bars */
.status-bars {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-label {
  width: 90px;
  font-size: 14px;
  color: #666;
}

.bar-container {
  flex: 1;
  height: 8px;
  background-color: #e6e6e6;
  border-radius: 4px;
  overflow: hidden;
}

.bar {
  height: 100%;
  border-radius: 4px;
}

.bar.completed {
  background-color: #4caf50;
}

.bar.in-progress {
  background-color: #2196f3;
}

.bar.pending {
  background-color: #ff9800;
}

.bar.overdue {
  background-color: #f44336;
}

.bar-value {
  width: 40px;
  font-size: 14px;
  color: #333;
  text-align: right;
}

/* Weekly Activity Chart */
.weekly-activity {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

.weekly-activity h3 {
  margin: 0 0 20px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.bar-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200px;
  padding-top: 20px;
}

.chart-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.chart-bar {
  width: 30px;
  background-color: #3498db;
  border-radius: 4px 4px 0 0;
  transition: height 0.5s;
}

.chart-label {
  font-size: 13px;
  color: #666;
}

.chart-value {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

/* Detailed Report */
.tasks-in-range {
  margin-top: 20px;
}

.tasks-in-range h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.tasks-table {
  width: 100%;
  border-collapse: collapse;
}

.tasks-table th {
  text-align: left;
  padding: 12px 16px;
  border-bottom: 2px solid #eee;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.tasks-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  color: #333;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.completed {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.status-badge.in-progress {
  background-color: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.status-badge.pending {
  background-color: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.no-data {
  text-align: center;
  color: #666;
  padding: 24px 0;
}

/* Performance Report Styles */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.metric-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.metric-card h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.time-metric {
  display: flex;
  align-items: baseline;
  margin-bottom: 8px;
}

.time-value {
  font-size: 36px;
  font-weight: 600;
  color: #333;
}

.time-unit {
  font-size: 16px;
  color: #666;
  margin-left: 4px;
}

.metric-label {
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
}

.metric-trend {
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
}

.metric-trend.positive {
  color: #4caf50;
}

.metric-trend.negative {
  color: #f44336;
}

.metric-trend svg {
  margin-right: 4px;
}

.productivity-section,
.comparison-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

.productivity-section h3,
.comparison-section h3 {
  margin: 0 0 20px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.productivity-chart {
  display: flex;
  gap: 32px;
}

.score-gauge {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-value {
  position: absolute;
  bottom: 24px;
  font-size: 32px;
  font-weight: 600;
  color: #333;
}

.score-label {
  font-size: 13px;
  color: #666;
}

.score-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
}

.score-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.score-name {
  width: 160px;
  font-size: 14px;
  color: #666;
}

.score-bar-container {
  flex: 1;
  height: 8px;
  background-color: #e6e6e6;
  border-radius: 4px;
  overflow: hidden;
}

.score-bar {
  height: 100%;
  background-color: #4caf50;
  border-radius: 4px;
}

.score-percentage {
  width: 40px;
  font-size: 14px;
  font-weight: 500;
  text-align: right;
  color: #333;
}

.comparison-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 260px;
  padding-top: 20px;
  margin-bottom: 16px;
}

.month-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 16%;
}

.month-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.month-bar {
  width: 40px;
  background-color: #3498db;
  border-radius: 4px 4px 0 0;
}

.month-bar.current {
  background-color: #ff3d57;
}

.month-label {
  margin-bottom: 8px;
  font-size: 13px;
  color: #666;
}

.month-value {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.comparison-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: #3498db;
}

.legend-color.current {
  background-color: #ff3d57;
}

.legend-label {
  font-size: 13px;
  color: #666;
}

/* Replace the placeholder chart style */
.placeholder-chart {
  display: none;
}
</style> 