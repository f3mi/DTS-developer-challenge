<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTaskStore, type Task } from '../stores/tasks'
import AppHeader from '../components/AppHeader.vue'
import Sidebar from '../components/Sidebar.vue'

const taskStore = useTaskStore()

// Reactive variables
const isLoading = ref(true)
const errorMessage = ref('')
const activeReport = ref('overview')
const searchQuery = ref('')
const detailedSearchQuery = ref('')
const statusFilter = ref('all')
const sortBy = ref('dueDate')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const dateRange = ref({
  start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
})

// Type definition for the report types
type ReportType = 'overview' | 'performance' | 'detailed'

// Fetch tasks on mount
onMounted(async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await taskStore.fetchTasks()
  } catch (error) {
    console.error('Failed to fetch tasks for dashboard:', error)
    errorMessage.value = 'Failed to load dashboard data. Please try refreshing the page.'
  } finally {
    isLoading.value = false
  }
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
  // Get start and end dates from the selected date range
  const startDate = new Date(dateRange.value.start)
  const endDate = new Date(dateRange.value.end)
  
  // Determine if the date range is 7 days or less
  const dayDifference = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const result = []
  
  // If date range is 7 days or less, show each day
  if (dayDifference <= 7) {
    for (let i = 0; i < dayDifference; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      
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
  } else {
    // If more than 7 days, show the last 7 days of the range
    for (let i = 6; i >= 0; i--) {
      const date = new Date(endDate)
      date.setDate(date.getDate() - i)
      
      // Skip days before the start date
      if (date < startDate) continue
      
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
  }
  
  return result
})

// Tab indicator position
const tabIndicatorStyle = computed(() => {
  let position = 0;
  let width = 33.33; // Default width (%)
  
  if (activeReport.value === 'overview') {
    position = 0;
  } else if (activeReport.value === 'performance') {
    position = 33.33;
  } else if (activeReport.value === 'detailed') {
    position = 66.66;
  }
  
  return {
    left: `${position}%`,
    width: `${width}%`
  };
});

// Additional computed properties for detailed report
const filteredDetailedTasks = computed(() => {
  // First apply date range filter
  let tasks = tasksInDateRange.value;
  
  // Apply status filter if not 'all'
  if (statusFilter.value !== 'all') {
    tasks = tasks.filter(task => task.status === statusFilter.value);
  }
  
  // Apply search filter if there's a query
  if (detailedSearchQuery.value) {
    const query = detailedSearchQuery.value.toLowerCase();
    tasks = tasks.filter(task => 
      task.title.toLowerCase().includes(query) || 
      (task.description?.toLowerCase().includes(query) || false)
    );
  }
  
  // Apply sorting
  return [...tasks].sort((a, b) => {
    if (sortBy.value === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortBy.value === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy.value === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });
});

const totalPages = computed(() => {
  return Math.ceil(filteredDetailedTasks.value.length / itemsPerPage.value);
});

const paginatedTasks = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredDetailedTasks.value.slice(startIndex, endIndex);
});

// Completion-donut style for performance view
const completionDonutStyle = computed(() => {
  return {
    strokeDashoffset: `${251.327 * (1 - completionRate.value / 100)}px`
  };
});

// Additional computed properties for performance metrics
const avgCompletionTime = computed(() => {
  // Calculate average time from task creation to completion
  const completedTasksWithDates = filteredTasks.value.filter(task => 
    task.status === 'completed'
  );
  
  if (completedTasksWithDates.length === 0) return 0;
  
  // For this calculation, we'll use dueDate as a proxy since we don't have 
  // a creation date or completion date in our current model
  const now = new Date();
  let totalDays = 0;
  
  completedTasksWithDates.forEach(task => {
    const dueDate = new Date(task.dueDate);
    // Calculate difference in days between due date and today
    // Assuming tasks were completed near their due date
    const timeDiff = Math.abs(now.getTime() - dueDate.getTime());
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    totalDays += daysDiff;
  });
  
  return (totalDays / completedTasksWithDates.length).toFixed(1);
});

// Task efficiency rate
const taskEfficiency = computed(() => {
  const overdueCount = overdueTasks.value;
  const completedCount = completedTasks.value;
  const totalCount = totalTasks.value;
  
  if (totalCount === 0) return 0;
  
  // Efficiency is measured by: completed tasks compared to overdue tasks
  // Formula: (completed tasks) / (completed + overdue) * 100
  const denominator = completedCount + overdueCount;
  if (denominator === 0) return 100; // If no completed or overdue tasks, 100% efficient
  
  return Math.round((completedCount / denominator) * 100);
});

// Calculate efficiency trend
const efficiencyTrend = computed(() => {
  // Get current date range
  const currentStartDate = new Date(dateRange.value.start);
  const currentEndDate = new Date(dateRange.value.end);
  
  // Calculate previous period of same length
  const dayDifference = Math.floor((currentEndDate.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const previousStartDate = new Date(currentStartDate);
  previousStartDate.setDate(previousStartDate.getDate() - dayDifference);
  const previousEndDate = new Date(currentEndDate);
  previousEndDate.setDate(previousEndDate.getDate() - dayDifference);
  
  // Count tasks in previous period
  const previousTasksInRange = taskStore.tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return taskDate >= previousStartDate && taskDate <= previousEndDate;
  });
  
  // Calculate previous efficiency
  const previousOverdue = previousTasksInRange.filter(task => 
    task.status !== 'completed' && new Date(task.dueDate) < previousEndDate
  ).length;
  
  const previousCompleted = previousTasksInRange.filter(task => 
    task.status === 'completed'
  ).length;
  
  const previousDenominator = previousCompleted + previousOverdue;
  let previousEfficiency = 0;
  
  if (previousDenominator === 0) {
    previousEfficiency = 100;
  } else {
    previousEfficiency = Math.round((previousCompleted / previousDenominator) * 100);
  }
  
  // Calculate efficiency change
  return taskEfficiency.value - previousEfficiency;
});

// Calculate previous period stats for comparison
const previousPeriodStats = computed(() => {
  // Get current date range
  const currentStartDate = new Date(dateRange.value.start);
  const currentEndDate = new Date(dateRange.value.end);
  
  // Calculate previous period of same length
  const dayDifference = Math.floor((currentEndDate.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const previousStartDate = new Date(currentStartDate);
  previousStartDate.setDate(previousStartDate.getDate() - dayDifference);
  const previousEndDate = new Date(currentEndDate);
  previousEndDate.setDate(previousEndDate.getDate() - dayDifference);
  
  // Count completed tasks in previous period
  const previousCompletedTasks = taskStore.tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return task.status === 'completed' && 
      taskDate >= previousStartDate && 
      taskDate <= previousEndDate;
  }).length;
  
  // Calculate percentage change
  const currentCompletedTasks = completedTasks.value;
  const completionChange = previousCompletedTasks === 0 
    ? 100 // If there were no tasks before, that's a 100% increase
    : Math.round(((currentCompletedTasks - previousCompletedTasks) / previousCompletedTasks) * 100);
  
  return {
    completedTasks: previousCompletedTasks,
    completionChange: completionChange
  };
});

// Calculate weekly comparison data for the trend chart
const weeklyComparisonData = computed(() => {
  // Get weekly completion data for current period
  const currentData = weeklyCompletionData.value;
  
  // Calculate the same days for previous period
  const result: { day: string; current: number; previous: number }[] = [];
  
  // For each day in current period, calculate previous period equivalent
  currentData.forEach(dayData => {
    // Find current day's date
    const dayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(dayData.day);
    if (dayIndex === -1) return;
    
    // Calculate date for current day
    const currentDayDate = new Date(dateRange.value.end);
    const diff = currentDayDate.getDay() - dayIndex;
    currentDayDate.setDate(currentDayDate.getDate() - diff);
    
    // Calculate previous period date (same day of week)
    const previousDayDate = new Date(currentDayDate);
    previousDayDate.setDate(previousDayDate.getDate() - 7);
    
    // Count completed tasks on this day in previous period
    const previousCount = taskStore.tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return task.status === 'completed' && 
        taskDate.getDate() === previousDayDate.getDate() &&
        taskDate.getMonth() === previousDayDate.getMonth() &&
        taskDate.getFullYear() === previousDayDate.getFullYear();
    }).length;
    
    result.push({
      day: dayData.day,
      current: dayData.count,
      previous: previousCount
    });
  });
  
  return result;
});

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
  // No need to do anything else here since the computed properties
  // will automatically recalculate when dateRange changes
}

function setActiveReport(reportType: string): void {
  activeReport.value = reportType as ReportType
}

function handleDetailedSearch(): void {
  currentPage.value = 1; // Reset to first page when searching
  console.log('Searching detailed tasks for:', detailedSearchQuery.value);
}

// Additional function to retry loading
const retryLoading = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await taskStore.fetchTasks()
  } catch (error) {
    console.error('Failed to fetch tasks for dashboard:', error)
    errorMessage.value = 'Failed to load dashboard data. Please try refreshing the page.'
  } finally {
    isLoading.value = false
  }
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
        
        <!-- Error state -->
        <div v-else-if="errorMessage" class="error-container">
          <div class="theme-alert error-message">
            <p>{{ errorMessage }}</p>
            <button @click="retryLoading" class="theme-button-primary retry-button">Retry</button>
          </div>
        </div>
        
        <!-- Reports Content -->
        <div v-else class="reports-content">
          <!-- Page header -->
          <div class="page-header">
            <div class="page-title">
              <h1 class="theme-text-primary">Reports Dashboard</h1>
              <p class="subtitle theme-text-secondary">Analytics and insights about your task management</p>
            </div>
          </div>
  
          <!-- Report Types Navigation -->
          <div class="report-tabs-container">
            <div class="theme-tabs report-tabs">
              <button 
                :class="{ 'tab-active': activeReport === 'overview' }"
                @click="setActiveReport('overview')"
                class="tab-button"
              >
                Overview
              </button>
              <button 
                :class="{ 'tab-active': activeReport === 'performance' }"
                @click="setActiveReport('performance')"
                class="tab-button"
              >
                Performance
              </button>
              <button 
                :class="{ 'tab-active': activeReport === 'detailed' }"
                @click="setActiveReport('detailed')"
                class="tab-button"
              >
                Detailed Reports
              </button>
              <div class="tab-indicator" :style="tabIndicatorStyle"></div>
            </div>
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
                <div class="weekly-activity-header">
                  <h3 class="theme-text-secondary">Weekly Completed Task Activity</h3>
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
              
              <!-- Date range for Performance -->
              <div class="performance-filters">
                <div class="date-filter">
                  <div class="date-range">
                    <label for="perf-start-date" class="theme-text-secondary">From:</label>
                    <input 
                      type="date" 
                      id="perf-start-date" 
                      v-model="dateRange.start" 
                      @change="updateDateRange"
                      class="theme-input"
                    />
                  </div>
                  <div class="date-range">
                    <label for="perf-end-date" class="theme-text-secondary">To:</label>
                    <input 
                      type="date" 
                      id="perf-end-date" 
                      v-model="dateRange.end"
                      @change="updateDateRange"
                      class="theme-input"
                    />
                  </div>
                </div>
              </div>
              
              <!-- Time-based metrics -->
              <div class="metrics-grid">
                <div class="theme-card metric-card">
                  <h3 class="theme-text-secondary">Task Completion Time</h3>
                  <div class="metric-chart">
                    <div class="time-metric">
                      <div class="time-value theme-text-primary">{{ avgCompletionTime }}</div>
                      <div class="time-unit theme-text-secondary">days</div>
                    </div>
                    <div class="metric-label theme-text-secondary">Average completion time</div>
                    <div class="metric-trend" :class="{ 'positive': Number(avgCompletionTime) <= 3, 'negative': Number(avgCompletionTime) > 3 }">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline v-if="Number(avgCompletionTime) <= 3" points="18 15 12 9 6 15"></polyline>
                        <polyline v-else points="6 9 12 15 18 9"></polyline>
                      </svg>
                      <span>{{ Number(avgCompletionTime) <= 3 ? 'Good completion speed' : 'Completion taking longer' }}</span>
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
                    <div class="metric-trend" :class="{ 'positive': previousPeriodStats.completionChange >= 0, 'negative': previousPeriodStats.completionChange < 0 }">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline v-if="previousPeriodStats.completionChange >= 0" points="18 15 12 9 6 15"></polyline>
                        <polyline v-else points="6 9 12 15 18 9"></polyline>
                      </svg>
                      <span>{{ Math.abs(previousPeriodStats.completionChange) }}% {{ previousPeriodStats.completionChange >= 0 ? 'more' : 'fewer' }} than previous period</span>
                    </div>
                  </div>
                </div>
                
                <div class="theme-card metric-card">
                  <h3 class="theme-text-secondary">Completion Rate</h3>
                  <div class="metric-chart">
                    <div class="completion-donut">
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--bg-tertiary)" stroke-width="10" />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          fill="none" 
                          stroke="var(--success-color)" 
                          stroke-width="10"
                          stroke-dasharray="251.327"
                          :stroke-dashoffset="251.327 * (1 - completionRate / 100)"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div class="donut-text theme-text-primary">{{ completionRate }}%</div>
                    </div>
                    <div class="metric-label theme-text-secondary">Completion rate for filtered tasks</div>
                  </div>
                </div>
                
                <div class="theme-card metric-card">
                  <h3 class="theme-text-secondary">Task Efficiency</h3>
                  <div class="metric-chart">
                    <div class="time-metric">
                      <div class="time-value theme-text-primary">{{ taskEfficiency }}%</div>
                    </div>
                    <div class="metric-label theme-text-secondary">On-time completion efficiency</div>
                    <div class="metric-trend" :class="{ 'positive': efficiencyTrend >= 0, 'negative': efficiencyTrend < 0 }">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline v-if="efficiencyTrend >= 0" points="18 15 12 9 6 15"></polyline>
                        <polyline v-else points="6 9 12 15 18 9"></polyline>
                      </svg>
                      <span>{{ Math.abs(efficiencyTrend) }}% {{ efficiencyTrend >= 0 ? 'increase' : 'decrease' }} from previous period</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Productivity Trends -->
              <div class="productivity-section">
                <h3 class="theme-text-primary section-title">Productivity Trends</h3>
                <div class="theme-card trend-chart">
                  <div class="chart-header">
                    <div class="chart-title theme-text-secondary">Tasks Completed Per Day</div>
                    <div class="chart-legend">
                      <div class="legend-item">
                        <div class="legend-color" style="background-color: var(--primary-color)"></div>
                        <div class="legend-label theme-text-secondary">This Period</div>
                      </div>
                      <div class="legend-item">
                        <div class="legend-color" style="background-color: var(--bg-tertiary)"></div>
                        <div class="legend-label theme-text-secondary">Previous Period</div>
                      </div>
                    </div>
                  </div>
                  <div class="trend-bars">
                    <div v-for="(day, index) in weeklyComparisonData" :key="index" class="trend-bar-container">
                      <div class="trend-bar-group">
                        <div class="trend-bar current" :style="{ height: `${Math.max(day.current * 15, 4)}px` }"></div>
                        <div class="trend-bar previous" :style="{ height: `${Math.max(day.previous * 15, 2)}px` }"></div>
                      </div>
                      <div class="trend-bar-label theme-text-secondary">{{ day.day }}</div>
                      <div class="trend-value-group">
                        <div class="trend-value current theme-text-primary">{{ day.current }}</div>
                        <div class="trend-value previous theme-text-secondary">{{ day.previous }}</div>
                      </div>
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
              
              <!-- Filters for Detailed Report -->
              <div class="detailed-filters theme-card">
                <div class="filter-row">
                  <div class="date-filter">
                    <div class="date-range">
                      <label for="detailed-start-date" class="theme-text-secondary">From:</label>
                      <input 
                        type="date" 
                        id="detailed-start-date" 
                        v-model="dateRange.start" 
                        @change="updateDateRange"
                        class="theme-input"
                      />
                    </div>
                    <div class="date-range">
                      <label for="detailed-end-date" class="theme-text-secondary">To:</label>
                      <input 
                        type="date" 
                        id="detailed-end-date" 
                        v-model="dateRange.end"
                        @change="updateDateRange"
                        class="theme-input"
                      />
                    </div>
                  </div>
                  
                  <div class="filter-group">
                    <label for="status-filter" class="theme-text-secondary">Status:</label>
                    <select id="status-filter" class="theme-input filter-select" v-model="statusFilter">
                      <option value="all">All Statuses</option>
                      <option value="completed">Completed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
                
                <div class="filter-row">
                  <div class="search-filter">
                    <input 
                      type="text" 
                      placeholder="Search tasks..." 
                      class="theme-input search-input" 
                      v-model="detailedSearchQuery"
                      @input="handleDetailedSearch"
                    />
                    <button class="theme-button-secondary search-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </button>
                  </div>
                  
                  <div class="filter-group">
                    <label for="sort-by" class="theme-text-secondary">Sort By:</label>
                    <select id="sort-by" class="theme-input filter-select" v-model="sortBy">
                      <option value="dueDate">Due Date</option>
                      <option value="title">Title</option>
                      <option value="status">Status</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div class="theme-card tasks-table-container">
                <div v-if="filteredDetailedTasks.length === 0" class="no-tasks theme-text-secondary">
                  No tasks found in the selected date range.
                </div>
                
                <div v-else>
                  <table class="tasks-table">
                    <thead>
                      <tr>
                        <th class="theme-text-secondary">Task</th>
                        <th class="theme-text-secondary">Status</th>
                        <th class="theme-text-secondary">Due Date</th>
                        <th class="theme-text-secondary">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="task in paginatedTasks" :key="task.id">
                        <td class="theme-text-primary">{{ task.title }}</td>
                        <td>
                          <span class="theme-status-pill" :class="task.status">
                            {{ task.status.replace('-', ' ') }}
                          </span>
                        </td>
                        <td class="theme-text-secondary">{{ formatDate(task.dueDate) }}</td>
                        <td class="actions-cell">
                          <button class="action-btn view-btn" title="View Details">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <!-- Pagination -->
                  <div class="pagination">
                    <button 
                      class="theme-button-secondary pagination-btn" 
                      :disabled="currentPage === 1"
                      @click="currentPage--"
                    >
                      Previous
                    </button>
                    <span class="page-info theme-text-secondary">
                      Page {{ currentPage }} of {{ totalPages }}
                    </span>
                    <button 
                      class="theme-button-secondary pagination-btn" 
                      :disabled="currentPage === totalPages"
                      @click="currentPage++"
                    >
                      Next
                    </button>
                  </div>
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

.report-tabs-container {
  margin-bottom: 24px;
  background-color: var(--bg-secondary);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.report-tabs {
  display: flex;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.tab-button {
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  position: relative;
  z-index: 2;
  transition: color 0.3s ease;
  text-align: center;
}

.tab-button.tab-active {
  color: var(--primary-color);
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  height: 3px;
  background-color: var(--primary-color);
  transition: all 0.3s ease;
  z-index: 1;
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

.weekly-activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.weekly-activity h3 {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  text-align: left;
}

.weekly-activity .date-filter {
  display: flex;
  gap: 12px;
}

.weekly-activity .date-range {
  display: flex;
  align-items: center;
  gap: 6px;
}

.weekly-activity .date-range label {
  font-size: 12px;
}

.weekly-activity .date-range input[type="date"] {
  border-radius: 4px;
  padding: 6px;
  font-size: 12px;
  width: 130px;
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

.performance-filters {
  margin-bottom: 24px;
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

.productivity-section {
  margin-top: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.trend-chart {
  padding: 24px;
  background-color: var(--bg-secondary);
  border-radius: 8px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-title {
  font-size: 16px;
  font-weight: 500;
}

.chart-legend {
  display: flex;
  gap: 16px;
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
}

.legend-label {
  font-size: 14px;
  font-weight: 500;
}

.trend-bars {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 180px;
}

.trend-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.trend-bar-group {
  display: flex;
  gap: 8px;
}

.trend-bar {
  width: 100%;
  background-color: var(--bg-tertiary);
  border-radius: 4px;
  margin-bottom: 8px;
}

.trend-bar.current {
  background-color: var(--primary-color);
}

.trend-bar.previous {
  background-color: var(--bg-tertiary);
}

.trend-bar-label {
  font-size: 14px;
  margin-top: 4px;
}

.trend-value-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trend-value {
  font-size: 14px;
  font-weight: 600;
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

.detailed-filters {
  margin-bottom: 24px;
  padding: 16px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 16px;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-select {
  padding: 8px;
  min-width: 150px;
}

.search-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.search-input {
  flex: 1;
  min-width: 200px;
  padding: 8px 12px;
}

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 4px;
}

.tasks-table-container {
  overflow-x: auto;
  padding: 16px;
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

.actions-cell {
  white-space: nowrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background-color: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: var(--bg-tertiary);
  color: var(--primary-color);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  gap: 16px;
}

.pagination-btn {
  padding: 8px 16px;
  border-radius: 4px;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
}

/* Performance Metrics Styles */
.performance-filters {
  margin-bottom: 24px;
}

.completion-donut {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 16px;
}

.donut-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  font-weight: 600;
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
  
  .weekly-activity-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .weekly-activity .date-filter {
    width: 100%;
  }
  
  .tab-button {
    padding: 12px 8px;
    font-size: 12px;
  }
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
}

.error-message {
  padding: 16px;
  max-width: 400px;
  text-align: center;
  background-color: var(--bg-error);
  border: 1px solid var(--error-color);
  border-radius: 4px;
}

.retry-button {
  margin-top: 16px;
}
</style> 
